# EBAC Shop — Desafio Técnico QA

## Stack

| Camada | Tecnologia |
|---|---|
| Automação E2E | Cypress |
| Linguagem | JavaScript |
| Dados de teste | Faker.js (pt_BR) |
| Padrão de projeto | Page Object Model + Component Helpers |

---

## Estrutura do Projeto

```
cypress/
  e2e/
    spec.cy.js              # Especificações de teste
  fixtures/
    CheckoutFactory.js      # Factory para dados de checkout com Faker
  pages/
    ProductsPage.js         # Page Object - vitrine de produtos
    ProductDetailsPage.js   # Page Object - página do produto
    CartPage.js             # Page Object - carrinho
    CheckoutPage.js         # Page Object - checkout
    index.js                # Exportação centralizada
  support/
    ProductHelpers.js       # Helper - seleção dinâmica de produto e variação
    commands.js             # Custom commands
    e2e.js                  # Configuração global
cypress.config.js
```

---

## Instalação e Execução

```bash
npm install
```

### Headless
```bash
npx cypress run
```

### Interativo
```bash
npx cypress open
```

---

## Cenários Automatizados

| ID | Descrição | Tipo |
|---|---|---|
| CT-01 | Navegar da vitrine até o produto e exibir informações corretas | Funcional |
| CT-02 | Adicionar produto ao carrinho com sucesso | Funcional |
| CT-03 | Alterar quantidade no carrinho e recalcular total | Funcional |
| CT-04 | Navegar para o checkout | Funcional |
| CT-05 | Remover produto do carrinho | Funcional |
| CT-06 | Manter quantidade mínima de 1 | Negativo |
| CT-07 | Respeitar quantidade máxima em estoque | Negativo |
| CT-07.2 | Validar comportamento atual com overstock no checkout | Negativo |
| CT-08 | Exibir total correto após alteração de quantidade | Funcional |
| CT-09 | Finalizar pedido com dados válidos | Funcional |
| CT-10 | Exibir erros sem campos obrigatórios | Negativo |
| CT-11 | Exibir erro sem aceitar termos | Negativo |
| CT-12 | Exibir erro com email inválido | Negativo |
| CT-13 | Resumo do pedido consistente com o carrinho | Funcional |

---

## Análise de Qualidade

### Cenários mais críticos e justificativa

**CT-02: Adicionar produto ao carrinho** é o cenário de maior criticidade. É o ponto de entrada da jornada de compra — sem ele nenhum outro fluxo funciona. Validei tanto o comportamento frontend (produto visível no carrinho) quanto o backend (cart_hash gerado via intercept da API).

**CT-09: Finalizar pedido** é o cenário de maior impacto de negócio. É onde a conversão acontece. Bug representa perda direta de receita.

**CT-07/CT-07.2: Quantidade máxima** foi tratado em dois cenários separados porque o comportamento esperado e o comportamento atual divergem. O sistema usa validação nativa do HTML5 em vez de exibir mensagem de erro da aplicação.

---

### Riscos identificados

| Risco | Impacto | Observação |
|---|---|---|
| Produtos variáveis com estoque por combinação | Alto | Resolvido com seleção dinâmica de variação disponível |
| Estoque se esgota após finalizar pedido | Alto | Testes não fixam produto — seleção dinâmica adapta ao estado atual |
| Select2 cobre o select nativo de Estado | Médio | Resolvido com `force: true` |


---

### O que foi testado e o que não foi

**Testado:**
- Fluxo completo de compra end-to-end
- Validações de carrinho (quantidade, total, remoção)
- Validações de checkout (campos obrigatórios, email, termos)
- Consistência entre carrinho e checkout
- Comportamento com overstock

**Não testado e justificativa:**
- Login/cadastro: fora do escopo do fluxo obrigatório
- Cupom de desconto: funcionalidade secundária dado o prazo
- Múltiplos produtos no carrinho: aumentaria a complexidade sem agregar cobertura proporcional
- Performance: não recomendado no contexto do projeto
- Mobile responsivo: requereria configuração de viewport adicional

---

## Desafio de Investigação

**Cenário:** "Às vezes, o cliente paga, mas o pedido não aparece na tela de Meus Pedidos."

### Resposta

Reproduzir o problema de forma controlada antes de qualquer investigação técnica. Acessaria o ambiente de produção com um usuário de teste, realizaria um pagamento real e monitoraria o comportamento em tempo real.

"às vezes" me leva a pensar em intermitência, o que aponta para uma condição de corrida ou falha assíncrona entre o gateway e o sistema de pedidos, como por exemplo, o callback do webhook estar retornando antes do pedido ser salvo no banco.

1: pediria ao time de Backend os logs do gateway de pagamento e do sistema de pedidos no mesmo horário dos casos reportados. Se o pagamento foi confirmado mas o pedido não criado, o problema está no processamento.

2: bateria no endpoint que recebe a confirmação do pagamento, para confirmar se está retornando 200 ou falhando.

3: pediria/faria uma query que mostre pagamentos confirmados sem pedido associado nas últimas 48h.

4: com esses dados, simularia uma falha em staging para validar o comportamento e propor o fix.
