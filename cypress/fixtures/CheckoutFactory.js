import { fakerPT_BR } from '@faker-js/faker';

export class CheckoutFactory {
  static create() {
    return {
    nome: fakerPT_BR.person.firstName(),
    sobrenome: fakerPT_BR.person.lastName(),
    endereco: fakerPT_BR.location.streetAddress(),
    cidade: fakerPT_BR.location.city(),
    estado: fakerPT_BR.location.state(),
    cep: fakerPT_BR.location.zipCode(),
    telefone: fakerPT_BR.phone.number(),
    email: fakerPT_BR.internet.email()
  };
  }
}
