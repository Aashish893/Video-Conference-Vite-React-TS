/// <reference types = "Cypress"/>

describe('Video Chat', () => { 
    const userId = 'ash';
    const userName = 'Cypress';
    it('checking for user video streams', () => {
        cy.visit('http://localhost:3000');
        cy.get('input').type('Aashish');
        cy.get('button').click();
        cy.get('[data-testid="user-video"]').should("have.length", 1);
        cy.log('Success');
    })

    it("checking for other user's video streams", () => {
        cy.visit('http://localhost:3000');
        cy.get('input').type('Another User');
        cy.get('button').click();

        cy.window().then((win) => {
            if (win.Peer) {
                // @ts-ignore
                win.Peer.prototype.call = cy.stub().returns({
                    on: (_, callback) => {
                        navigator.mediaDevices
                            .getUserMedia({ video: true, audio: true })
                            .then((stream) => {
                                callback(stream);
                            });
                    },
                });
            } else {
                throw new Error('Peer is not defined on window');
            }
        });

        cy.task('connect');
        cy.url().should('include', '/room/');
        cy.url().then((url) => {
            const roomId = url.split('/').reverse()[0];
            cy.task('joinRoom', { roomId, userId, userName });            
        });

        cy.get('[data-testid="user-video"]').should("have.length", 2);
    })
})
