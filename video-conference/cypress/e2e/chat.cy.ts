/// <reference types = "Cypress"/>

describe('Chat Box', () => { 
    const userId = 'ash';
    const userName = 'Cypress';
    it('send message and display in chat window', () => {
        cy.visit('http://localhost:3000');
        cy.get('input').type('Aashish');
        cy.get('button').click();
        cy.get('[data-testid="chat-button"]').click()
        cy.get('textarea').type('Hello Cypress');
        cy.get('[data-testid="send-chat-msg"]').click();
        cy.get('[data-testid = chat]').should('contain.text', 'Hello Cypress');
        cy.get('[data-testid = chat]').should('contain.text', 'You');
        cy.task('connect');
        cy.url().then((url) => {
            const roomId = url.split('/').reverse()[0];
            cy.log(`Extracted Room ID: ${roomId}`);
            
            // Ensure roomId is not undefined before proceeding
            if (roomId) {
                cy.task('connect');
                cy.task('joinRoom', { roomId, userId, userName });
                cy.task('chat', {event : 'send-message', roomId, eventData: {    
                    content : 'Hello User',
                    author : userId,
                    timestamp : new Date()}});
                    cy.get('[data-testid = chat]').should('contain.text', 'Hello User');
                    cy.get('[data-testid = chat]').should('contain.text', userName);
            } else {
                throw new Error('roomId is undefined');
            }
        });
    })
})
