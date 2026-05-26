import { ProductsPage, ProductDetailsPage } from "../pages";

class ProductHelpers {
  escolherProduto() {
    cy.visit("/produtos/");

    ProductsPage.getProdutosEmEstoque()
      .first()
      .then(($produto) => {
        const nome = $produto.find("h3.name a").text().trim();
        const preco = $produto.find(".woocommerce-Price-amount").text().trim();
        cy.wrap(nome).as("nomeProduto");
        cy.wrap(preco).as("precoProduto");
      });

    ProductsPage.getProdutosEmEstoque().first().find("h3.name a").click();
    cy.url().should("include", "/product/");
  }

  adicionarProdutoAoCarrinho() {
    this.escolherProduto();

    cy.get(".variations_form").then(($form) => {
      const variations = JSON.parse($form.attr("data-product_variations"));

      const disponivel = variations.find((v) => v.is_in_stock === true);

      if (!disponivel) {
        throw new Error("Nenhuma variação disponível em estoque");
      }

      const size = disponivel.attributes.attribute_size;
      const color = disponivel.attributes.attribute_color;
      const estoque = disponivel.max_qty;

      cy.wrap(size).as("sizeEscolhido");
      cy.wrap(color).as("colorEscolhido");
      cy.wrap(String(estoque)).as("estoqueProduto");

      cy.get(
        `ul[data-attribute_name="attribute_size"] li[data-value="${size}"]`,
      ).click();
      cy.get(
        `ul[data-attribute_name="attribute_color"] li[data-value="${color}"]`,
      ).click();

      ProductDetailsPage.getBotaoComprar().should("not.have.class", "disabled");
      ProductDetailsPage.clickComprar();
    });
  }
}

export default new ProductHelpers();
