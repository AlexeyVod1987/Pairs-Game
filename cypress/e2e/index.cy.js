/// <reference types="cypress" />
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('Игра в пары', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('В начальном состоянии игра должна иметь поле четыре на четыре клетки, в каждой клетке цифра должна быть невидима', () => {
    cy.contains('Начать игру').click();
    cy.get('.container').find('.card').should('have.length.greaterThan', 15);
    cy.get('.container').find('.card').should('have.not.class', 'flip');
  });

  it('Нажать на одну произвольную карточку. Убедиться, что она осталась открытой', () => {
    cy.contains('Начать игру').click();
    cy.get('.card').eq(7).click();
    cy.get('.card').eq(7).should('have.class', 'flip');
  });

  it('Нажать на левую верхнюю карточку, затем на следующую. Если это не пара, то повторять со следующей карточкой, пока не будет найдена пара. Проверить, что найденная пара карточек осталась видимой', () => {
    cy.contains('Начать игру').click();
    cy.wait(1500);
    let counter = 1;

    function clickCards(cards) {
      cy.get(cards[0]).click();
      cy.get(cards[counter]).click();
      if (cards[0].dataset.number === cards[counter].dataset.number) {
        cy.get(cards[0]).should('have.class', 'flip');
        cy.get(cards[counter]).should('have.class', 'flip');
      } else {
        counter++;
        cy.wait(1000);
        clickCards(cards);
      }
    }
    cy.get('.card').then(($cards) => {
      clickCards($cards);
    })
  });

  it('Нажать на левую верхнюю карточку, затем на следующую. Если это пара, то повторять со следующими двумя карточками, пока не найдутся непарные карточки. Проверить, что после нажатия на вторую карточку обе становятся невидимыми', () => {
    cy.contains('Начать игру').click();
    cy.wait(1500);
    let arr = []

    cy.get('ul>li').each((el) => {
      let value;
      cy.wait(500);
      cy.wrap(el).click().invoke('attr', 'data-number').then(attr => {
        value = attr;
        arr.push(value);

        if (arr.length >= 2) {
          if (arr[0] !== arr[1]) {
            cy.get('.container').should('have.not.class', 'flip').and('have.length.gte', 1);
            return false;
          }
          arr.splice(0, 2);
        }
      });
    })
  });
});


