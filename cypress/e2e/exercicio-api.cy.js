/// <reference types="cypress" />

const { faker } = require('@faker-js/faker');

import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

     let token

     before(() => {
          cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
     });

it('Deve validar contrato de usuários', () => {
      cy.request('usuarios').then(response=>{
      return contrato.validateAsync(response.body)
      })

     });

it('Deve listar usuários cadastrados', () => {
      cy.request({
          method: 'GET',
          url: 'usuarios'
      }).then((response) => {
          expect(response.status).to.equal(200)
          expect(response.body).to.have.property('usuarios')
          })
});

it('Deve cadastrar um usuário com sucesso', () => {
    let usuario = `${faker.person.fullName}`
    let email = `${faker.internet.email(usuario)}`
      cy.request({
        method: 'POST',
        url: 'usuarios',
        headers: { authorization: token },
        body: {
          "nome": usuario,
          "email": email,
          "password": "teste",
          "administrador": "true"
        }
          }).then((response) => {
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
               expect(response.status).to.equal(201)
          })
});

it('Deve validar um usuário com email inválido', () => {
    cy.request({
      method: 'POST',
      url: 'usuarios',
      headers: { authorization: token },
      body: {
        "nome": 'Thiago Iorc',
        "email": 'iorc.com',
        "password": "teste",
        "administrador": "true"
      },
      failOnStatusCode: false
      }).then((response) => {
          expect(response.status).to.equal(400)
          expect(response.body.email).to.equal('email deve ser um email válido')    
          })
});

it('Deve editar um usuário previamente cadastrado', () => {
    cy.request({
      method: 'POST',
      url: 'usuarios',
      headers: { authorization: token },
      body: {
        "nome": 'Valesca Ticiane',
        "email": 'valescaticiane@gmail.com.br',
        "password": "teste",
        "administrador": "true"
      },
      failOnStatusCode: false
      }).then((response) =>{
         expect(response.status).to.equal(400)
          expect(response.body.message).to.equal('Este email já está sendo usado')
          })
});

it('Deve deletar um usuário previamente cadastrado', () => {
    let nome = `Carlinhos Maia${Math.floor(Math.random()*1000)}`
    let email = `girassol${Math.floor(Math.random() * 10000)}@email.com`
        cy.cadastrarUsuario(token, nome, email, "teste","true")
          .then((response) =>{
               let id = response.body._id
               cy.request({
                    method:"DELETE",
                    url: `usuarios/${id}`,
                    headers: {authorization: token}
               }).then(response =>{
                    expect(response.status).to.equal(200)
                    expect(response.body.message).to.equal('Registro excluído com sucesso')
               })
})
});

})