// Настроен перехват запроса на эндпоинт 'api/ingredients’, в ответе на который возвращаются созданные ранее моковые данные.

// Тест для добавления ингредиента из списка в конструктор.

describe('Конструктор бургеров', () => {
  beforeEach(() => {
    // 1. Перехватываем запрос ингредиентов
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // 2. Мокируем успешный ответ для проверки авторизации
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: { name: 'Test User', email: 'test@example.com' }
      }
    }).as('getUser');

    cy.visit('http://localhost:4000/');
  });

  it('Должен отображать список ингредиентов', () => {
    // Ожидаем оба запроса
    cy.wait('@getIngredients');
    cy.wait('@getUser');

    // Проверяем отображение
    cy.get('[data-testid="ingredient-item"]').should('have.length', 3);
  });
});
