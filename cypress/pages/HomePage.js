class HomePage {
  getBotaoVerTodos() {
    return cy.get("a.btn-view-all").first();
  }

  clickVerTodos() {
    this.getBotaoVerTodos().click();
  }
}

export default new HomePage();
