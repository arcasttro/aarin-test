class CheckoutPage {
  getNome() {
    return cy.get("#billing_first_name");
  }
  getSobrenome() {
    return cy.get("#billing_last_name");
  }
  getEmpresa() {
    return cy.get("#billing_company");
  }
  getPais() {
    return cy.get("#billing_country");
  }
  getEndereco() {
    return cy.get("#billing_address_1");
  }
  getEndereco2() {
    return cy.get("#billing_address_2");
  }
  getCidade() {
    return cy.get("#billing_city");
  }
  getEstado() {
    return cy.get("#billing_state");
  }
  getCEP() {
    return cy.get("#billing_postcode");
  }
  getTelefone() {
    return cy.get("#billing_phone");
  }
  getEmail() {
    return cy.get("#billing_email");
  }

  getNomeProdutoPedido() {
    return cy.get("td.product-name");
  }

  getSubtotalPedido() {
    return cy.get("tr.cart-subtotal .woocommerce-Price-amount");
  }

  getTotalPedido() {
    return cy.get("tr.order-total .woocommerce-Price-amount");
  }

  getFormaPagamento(metodo) {
    // values: ['bacs','cheque','cod']
    return cy.get(`input[name="payment_method"][value="${metodo}"]`);
  }

  getCheckboxTermos() {
    return cy.get("#terms");
  }
  getBotaoFinalizarCompra() {
    return cy.get("#place_order");
  }

  getErrosValidacao() {
    return cy.get(".woocommerce-error li");
  }

  typeNome(value) {
    this.getNome().clear().type(value);
  }
  typeSobrenome(value) {
    this.getSobrenome().clear().type(value);
  }
  typeEndereco(value) {
    this.getEndereco().clear().type(value);
  }
  typeCidade(value) {
    this.getCidade().clear().type(value);
  }
  typeCEP(value) {
    this.getCEP().clear().type(value);
  }
  typeTelefone(value) {
    this.getTelefone().clear().type(value);
  }
  typeEmail(value) {
    this.getEmail().clear().type(value);
  }

  selectPais(value) {
    this.getPais().select(value);
  }
  selectEstado(value) {
    this.getEstado().select(value, { force: true });
  }

  selectFormaPagamento(metodo) {
    // values: ['bacs','cheque','cod']
    this.getFormaPagamento(metodo).check();
  }

  aceitarTermos() {
    this.getCheckboxTermos().check();
  }

  clickFinalizarCompra() {
    this.getBotaoFinalizarCompra().should("be.visible").click();
  }
  preencherDadosFaturamento({
    nome,
    sobrenome,
    endereco,
    cidade,
    estado,
    cep,
    telefone,
    email,
  }) {
    this.typeNome(nome);
    this.typeSobrenome(sobrenome);
    this.typeEndereco(endereco);
    this.typeCidade(cidade);
    this.selectEstado(estado);
    this.typeCEP(cep);
    this.typeTelefone(telefone);
    this.typeEmail(email);
  }
}

export default new CheckoutPage();
