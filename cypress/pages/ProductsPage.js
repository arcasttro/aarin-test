class ProductsPage {
  getListaProdutos() {
    return cy.get(".product-block.grid");
  }
  getProdutoPorNome(nome) {
    return cy.get("h3.name a").contains(nome);
  }

  getProdutosEmEstoque() {
    return cy.get(".product.instock");
  }

  clickProduto(nome) {
    this.getProdutoPorNome(nome).scrollIntoView().should("be.visible").click();
  }

  clickPrimeiroProdutoEmEstoque() {
    this.getProdutosEmEstoque().first().find("h3.name a").click();
  }
}

export default new ProductsPage();
