// Тестирование добавления ингредиента из списка в конструктор.
describe('Проверяем добавление ингредиента через кнопку "Добавить"', () => {
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

    cy.visit('http://localhost:4000/');
    cy.wait(['@getIngredients', '@getUser']);
    cy.get('[data-cy="main"]').as('mainIngredients'); // Компонент отвечающий за начинку
    cy.get('[data-cy="bun"]').as('bunIngredients'); // Компонент отвечающий за булку
    cy.get('[data-cy="sauce"]').as('sauceIngredients'); // Компонент отвечающий за соус
  });

  // Тест для добавления начинки в конструктор
  it('Добавление начинки в конструктор', () => {
    cy.get('@mainIngredients').contains('Добавить').click();
    cy.contains(
      'p.text_type_main-default',
      'Биокотлета из марсианской Магнолии'
    ).should('exist');
  });

  // Тест для добавления булки в конструктор
  it('Добавление булки в конструктор', () => {
    cy.get('@bunIngredients').contains('Добавить').click();
    cy.contains('p.text_type_main-default', 'Краторная булка N-200i').should(
      'exist'
    );
  });

  // Тест для добавления соуса в конструктор
  it('Добавление соуса в конструктор', () => {
    cy.get('@sauceIngredients').contains('Добавить').click();
    cy.contains(
      'p.text_type_main-default',
      'Соус с шипами Антарианского плоскоходца'
    ).should('exist');
  });
});
