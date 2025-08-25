import { selectors } from '../constants/constants';

// Тестирование работы модальных окон
describe('Тестирование работы модальных окон', () => {
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

    cy.visit('/');

    cy.wait(['@getIngredients', '@getUser']);
  });

  // Тест для закрытия модального окна в ингредиенте по клику на крестик
  it('Тест для закрытия по клику на крестик с проверкой данных ингредиента', () => {
    // Получаем данные ингредиента из фикстуры
    cy.fixture('ingredients.json').then((ingredients) => {
      const testIngredient = ingredients.data[0];

      cy.get(selectors.ingredientMain).first().click();

      // Проверяем что модальное окно открыто
      cy.get(selectors.modal).should('be.visible');

      // Проверяем, что в модальном окне отображается правильное название
      cy.get(selectors.modal).within(() => {
        cy.get(selectors.modalTitle).should('contain', testIngredient.name);

        // Проверяем значения БЖУ
        cy.get(selectors.modalCalories).should(
          'contain',
          testIngredient.calories
        );
        cy.get(selectors.modalProteins).should(
          'contain',
          testIngredient.proteins
        );
        cy.get(selectors.modalFat).should('contain', testIngredient.fat);
        cy.get(selectors.modalCarbohydrates).should(
          'contain',
          testIngredient.carbohydrates
        );
      });

      // Закрываем модальное окно
      cy.get(selectors.modalClose).click();
      cy.get(selectors.modal).should('not.exist');
    });
  });

  // Тест для закрытия модального окна в ингредиенте по overlay
  it('Тест для закрытия модального окна в ингредиенте по overlay с проверкой данных', () => {
    // Получаем данные ингредиента из фикстуры

    cy.fixture('ingredients.json').then((ingredients) => {
      const testIngredient = ingredients.data[0];
      cy.get(selectors.ingredientMain).first().click();

      // Проверяем что модальное окно открыто
      cy.get(selectors.modal).should('be.visible');

      // Проверяем данные ингредиента
      cy.get(selectors.modal).within(() => {
        cy.get(selectors.modalTitle).should('contain', testIngredient.name);
        cy.get(selectors.modalCalories).should(
          'contain',
          testIngredient.calories
        );
        cy.get(selectors.modalProteins).should(
          'contain',
          testIngredient.proteins
        );
        cy.get(selectors.modalFat).should('contain', testIngredient.fat);
        cy.get(selectors.modalCarbohydrates).should(
          'contain',
          testIngredient.carbohydrates
        );
      });
    });
    //Закрываем через overlay
    cy.get(selectors.modalOverlay).click({ force: true });
    cy.get(selectors.modal).should('not.exist');
  });
});
