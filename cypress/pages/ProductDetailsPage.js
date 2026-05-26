class ProductDetailsPage {
  getTitulo() {
    return cy.get("h1.product_title");
  }
  getPreco() {
    return cy.get("p.price .woocommerce-Price-amount");
  }

  // ancorado no data-value no li, mais estável que classe CSS
  getSizeOption(size) {
    return cy.get(`li.button-variable-item[data-value="${size}"]`);
  }

  getColorOption(color) {
    return cy.get(`li.button-variable-item[data-value="${color}"]`);
  }

  getQuantidade() {
    return cy.get("input.qty");
  }
  getBotaoAdicionar() {
    return cy.get("input.plus");
  }
  getBotaoSubtrair() {
    return cy.get("input.minus");
  }

  getBotaoComprar() {
    return cy.get("button.single_add_to_cart_button");
  }


  selectSize(size) {
    this.getSizeOption(size).scrollIntoView()
    .should('be.visible')
    .click()
  }

  selectColor(color) {
    this.getColorOption(color).scrollIntoView()
    .should('be.visible')
    .click()
  }

  // Seleciona size e color e valida que o botão habilitou
  selectSizeAndColor(size, color) {
    this.selectSize(size);
    this.selectColor(color);
  }

  clickComprar() {
    this.getBotaoComprar().should("not.have.class", "disabled").click();
  }
} 

export default new ProductDetailsPage();
