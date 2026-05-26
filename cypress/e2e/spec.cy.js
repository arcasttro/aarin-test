import {
  HomePage,
  ProductsPage,
  ProductDetailsPage,
  CartPage,
  CheckoutPage,
} from "../pages";
import { CheckoutFactory } from "../fixtures/CheckoutFactory";
import ProductHelpers from "../support/ProductHelpers";

const RANDOM_DATA_CHECKOUT = CheckoutFactory.create();

describe("Fluxo de compra — EBAC Shop", () => {
  beforeEach(() => {
    cy.intercept("POST", "/?wc-ajax=get_refreshed_fragments").as(
      "cartFragment",
    );
    cy.intercept("POST", "/?wc-ajax=checkout").as("checkout");
    cy.intercept("POST", "/wp-admin/admin-ajax.php").as("wp-admin");
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/')
    HomePage.clickVerTodos()
  });
  describe("Fluxo completo de compra", () => {
    it("CT-01 | deve navegar da vitrine até o produto e exibir informações corretas", () => {
      ProductHelpers.escolherProduto();
      cy.get("@nomeProduto").then((nome) => {
        cy.get("@precoProduto").then((preco) => {
          ProductDetailsPage.getTitulo().should("contain", nome);
          ProductDetailsPage.getPreco().should("contain", preco);
        });
      });
    });

    it("CT-02 | deve adicionar produto ao carrinho com sucesso", () => {
      ProductHelpers.adicionarProdutoAoCarrinho();

      cy.validarCartFragment()

      cy.visit("/carrinho");

      cy.get("@nomeProduto").then((nome) => {
        cy.get("@sizeEscolhido").then((size) => {
          cy.get("@colorEscolhido").then((color) => {
            CartPage.getNomeProduto()
              .should("contain", nome)
              .and("contain", size)
              .and("contain", color);
          });
        });
      });
      CartPage.getQuantidade().should("have.value", "1");
    });

    it("CT-03 | deve alterar a quantidade do item no carrinho", () => {
      ProductHelpers.adicionarProdutoAoCarrinho();

      cy.validarCartFragment()

      cy.visit("/carrinho");

      cy.get("@nomeProduto").then((nome) => {
        cy.get("@precoProduto").then((preco) => {
          const QTY = 3;
          const NUM_PRECO = parseInt(preco.replace("R$", "").trim());
          const TOTAL = NUM_PRECO * QTY;
          CartPage.typeQuantidade(QTY);
          CartPage.getQuantidade().should("have.value", QTY);
          CartPage.getPrecoTotalProduto().should("contain", TOTAL);
          CartPage.getTotalCarrinho().should("contain", TOTAL);
          CartPage.getNomeProduto().should("contain", nome);
        });
      });
    });
  });

  describe("Comportamentos do carrinho", () => {
    beforeEach(() => {
      ProductHelpers.adicionarProdutoAoCarrinho();

      cy.validarCartFragment()

      cy.visit("/carrinho");
    });

    it("CT-04 | deve navegar para o checkout ao clicar em concluir compra", () => {
      CartPage.getBotaoConcluirCompra().should("be.visible");
      CartPage.clickConcluirCompra();

      cy.url().should("include", "/checkout/");
    });

    it("CT-05 | deve remover produto do carrinho", () => {
      CartPage.clickRemover();

      cy.contains("Seu carrinho está vazio").should("be.visible");
    });

    it("CT-06 | deve manter quantidade mínima de 1", () => {
      CartPage.typeQuantidade(0);

      cy.url().should("include", "/carrinho/");
    });

    it("CT-07 | [EXPECT_ERROR] deve respeitar quantidade máxima em estoque", () => {
      //Comportamento esperado: ao adicionar uma quantidade maior que o estoque, o usuário deve receber o erro a partir do elemento .woocommerce-notices-wrapper, respeitando o padrão da tela
      //Comportamenteo alternativo: não permitir avançar no checkout com um valor acima do estoque
      //Comportamento atual: a conferencia é realizada a partir da configuração nativa do HTML5 e o usuário pode avançar para o fluxo de checkout, mas com o máximo permitido por estoque.
      cy.get("@estoqueProduto").then((estoque) => {
        const NUM_STOCK = parseInt(estoque.split(" ")[0]);
        const overstock = NUM_STOCK + 1;
        CartPage.typeQuantidade(overstock);
        cy.get(".woocommerce-notices-wrapper").should("be.visible");
      });
    });

    it("CT-07.2 | deve respeitar quantidade máxima em estoque", () => {
      //Cobertura de teste do comportamento atual.
      cy.get("@estoqueProduto").then((estoque) => {
        const NUM_STOCK = parseInt(estoque.split(" ")[0]);
        const overstock = NUM_STOCK + 1;
        CartPage.typeQuantidade(overstock);
        CartPage.getBotaoConcluirCompra().should("be.visible");
        CartPage.clickConcluirCompra();
        cy.url().should("include", "/checkout/");

        CheckoutPage.getNomeProdutoPedido()
          .children()
          .invoke("text")
          .then((value) => {
            const intValue = parseInt(value.replace("×", "").trim());
            expect(intValue).to.be.lte(NUM_STOCK);
          });
      });
    });

    it("CT-08 | deve exibir total correto após alteração de quantidade", () => {
      cy.get("@precoProduto").then((preco) => {
        const NUM_PRECO = parseInt(preco.replace("R$", "").trim());
        const QTY = 2;
        const TOTAL = QTY * NUM_PRECO;

        CartPage.typeQuantidade(QTY);

        CartPage.getPrecoTotalProduto().should("contain", TOTAL);
        CartPage.getTotalCarrinho().should("contain", TOTAL);
      });
    });
  });

  describe("Comportamento do Checkout", () => {
    beforeEach(() => {
      ProductHelpers.adicionarProdutoAoCarrinho();

      cy.validarCartFragment()

      cy.visit("/carrinho");
      CartPage.getBotaoConcluirCompra().should("be.visible");
      CartPage.clickConcluirCompra();

      cy.url().should("include", "/checkout/");
    });

    it("CT-09 | preencher todos os campos obrigatorios e finalizar compra", () => {
      CheckoutPage.preencherDadosFaturamento(RANDOM_DATA_CHECKOUT);
      CheckoutPage.selectFormaPagamento("cod");
      CheckoutPage.aceitarTermos();
      CheckoutPage.clickFinalizarCompra();
      cy.wait("@checkout").its("response.statusCode").should("eq", 200);
      cy.url().should("include", "/checkout/order-received");
    });

    it("CT-10 | deve exibir erros ao finalizar sem preencher campos obrigatórios", () => {
      CheckoutPage.aceitarTermos();
      CheckoutPage.clickFinalizarCompra();
      CheckoutPage.getErrosValidacao().should("have.length.greaterThan", 0);
    });

    it("CT-11 | deve exibir erro ao finalizar sem aceitar os termos", () => {
      CheckoutPage.preencherDadosFaturamento(RANDOM_DATA_CHECKOUT);
      CheckoutPage.selectFormaPagamento("bacs");
      CheckoutPage.clickFinalizarCompra();
      CheckoutPage.getErrosValidacao()
        .should("be.visible")
        .invoke("text")
        .and("contain", "termos");
    });

    it("CT-12 | deve exibir erro com email inválido", () => {
      CheckoutPage.preencherDadosFaturamento({
        ...RANDOM_DATA_CHECKOUT,
        email: "emailinvalido",
      });
      CheckoutPage.selectFormaPagamento("bacs");
      CheckoutPage.aceitarTermos();
      CheckoutPage.clickFinalizarCompra();
      CheckoutPage.getErrosValidacao()
        .should("be.visible")
        .invoke("text")
        .and("contain", "E-mail");
    });

    it("CT-13 | deve exibir resumo do pedido consistente com o carrinho", () => {
      cy.get("@nomeProduto").then((nome) => {
        cy.get("@precoProduto").then((preco) => {
          cy.get("@sizeEscolhido").then((size) => {
            cy.get("@colorEscolhido").then((color) => {
              CheckoutPage.getNomeProdutoPedido()
                .should("be.visible")
                .and("contain", nome)
                .and("contain", size)
                .and("contain", color);
              CheckoutPage.getTotalPedido()
                .children()
                .invoke("text")
                .should("contain", preco);
            });
          });
        });
      });
    });
  });
});
