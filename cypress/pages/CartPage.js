class CartPage {
  getNomeProduto() {
    return cy.get("td.product-name a");
  }

  getPrecoUnitarioProduto() {
    return cy.get("td.product-price .woocommerce-Price-amount");
  }
  getQuantidade() {
    return cy.get("input.qty");
  }
  getBotaoMais() {
    return cy.get("input.plus");
  }
  getBotaoMenos() {
    return cy.get("input.minus");
  }
  getPrecoTotalProduto() {
    return cy.get("td.product-subtotal .woocommerce-Price-amount");
  }
  getTotalCarrinho() {
    return cy.get("tr.order-total .woocommerce-Price-amount");
  }
  getBotaoRemover() {
    return cy.get("td.product-remove a.remove");
  }
  getBotaoConcluirCompra() {
    return cy.get("a.checkout-button");
  }

  getMensagemAlerta() {
    return cy.get('div[role="alert"]');
  }

  typeQuantidade(value) {
    this.getQuantidade()
      .scrollIntoView()
      .should("be.visible")
      .clear()
      .type(value)
      .blur();
  }

  clickConcluirCompra() {
    this.getBotaoConcluirCompra().scrollIntoView().should("be.visible").click();
  }

  clickRemover() {
    this.getBotaoRemover().scrollIntoView().should("be.visible").click();
  }
}

export default new CartPage();
