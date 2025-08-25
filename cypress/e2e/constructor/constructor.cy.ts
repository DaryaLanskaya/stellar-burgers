import { selectors } from '../constants/constants';

describe('Проверяем добавление ингредиента в конструктор', () => {
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

  it('Добавление булки в конструктор', () => {
    // Кликаем по первой кнопке "Добавить" в секции булок (в списке ингредиентов)
    cy.get(selectors.ingredientBun).first().find('button').click();

    // Проверяем, что булка появилась в конструкторе (в верхней части)
    cy.get(selectors.burgerConstructor)
      .contains('.constructor-element__text', 'Краторная булка N-200i (верх)')
      .should('exist');

    // А также проверяем нижнюю часть булки
    cy.get(selectors.burgerConstructor)
      .contains('.constructor-element__text', 'Краторная булка N-200i (низ)')
      .should('exist');
  });

  it('Добавление начинки в конструктор', () => {
    // Кликаем по первой кнопке "Добавить" в секции начинок (в списке ингредиентов)
    cy.get(selectors.ingredientMain).first().find('button').click();

    // Проверяем, что начинка появилась в конструкторе
    cy.get(selectors.burgerConstructor)
      .contains(
        '.constructor-element__text',
        'Биокотлета из марсианской Магнолии'
      )
      .should('exist');
  });

  it('Добавление соуса в конструктор', () => {
    // Кликаем по первой кнопке "Добавить" в секции соусов (в списке ингредиентов)
    cy.get(selectors.ingredientSauce).first().find('button').click();

    // Проверяем, что соус появился в конструкторе
    cy.get(selectors.burgerConstructor)
      .contains(
        '.constructor-element__text',
        'Соус с шипами Антарианского плоскоходца'
      )
      .should('exist');
  });
});
