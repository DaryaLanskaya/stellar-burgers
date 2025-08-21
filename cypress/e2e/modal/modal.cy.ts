import { selectors } from './../constants/constants';

// Тестирование работы модальных окон
describe('Тестирование работы модальных окон', () => {
  beforeEach(() => {
    // 1. Перехватываем запрос ингредиентов
    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // 2. Мокируем успешный ответ для проверки авторизации
    cy.intercept('GET', '/api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: { name: 'Test User', email: 'test@example.com' }
      }
    }).as('getUser');

    cy.visit('/');
    cy.wait(['@getIngredients', '@getUser']);
  });

  // Тест для закрытия модального окна в ингредиенте по клику на крестик
  it('Тест для закрытия по клику на крестик', () => {
    cy.get(selectors.ingredientMain).first().click(); // Компонент отвечающий за начинку
    cy.get(selectors.modal).should('be.visible'); // Проверяем что модальное окно открыто
    cy.get(selectors.modalClose).click(); // Компонент отвечающий за кнопку закрытие
    cy.get(selectors.modal).should('not.exist'); // Смотрим что модалка закрыта
  });

  // Тест для закрытия модального окна в ингредиенте по overlay
  it('Тест для закрытия модального окна в ингредиенте по overlay', () => {
    cy.get(selectors.ingredientMain).first().click(); // Компонент отвечающий за начинку
    cy.get(selectors.modal).should('be.visible'); // Проверяем что модальное окно открыто
    cy.get(selectors.modalOverlay).click({ force: true }); // Компонент отвечающий за overlay
    cy.get(selectors.modal).should('not.exist'); // Смотрим что модалка закрыта
  });
});
