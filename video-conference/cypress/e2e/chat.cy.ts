/// <reference types = "Cypress"/>

describe('Chat Box', () => { 
    it('send message and display in chat window', () => {
        cy.visit('http://localhost:3000');
        cy.get('input').type('Aashish');
        cy.get('button').click();
        cy.get('[data-testid="chat-button"]').click()
        cy.get('textarea').type('Hello From Cypress');
        cy.get('[data-testid="send-chat-msg"]').click();
        cy.get('[data-testid = chat]').should('contain.text', 'Hello From Cypress');
        cy.get('[data-testid = chat]').should('contain.text', 'You');
        // cy.task('connect');
        // cy.task('joinRoom');
    })
})