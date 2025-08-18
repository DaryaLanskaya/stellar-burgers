import { selectors } from './../constants/constants';

// Тестирование работы оформления заказа
describe('Тестирование работы оформления заказа', () => {
  const orderNumber = 86594; // Номер заказа
  const orderName = 'Краторный био-марсианский антарианский бургер'; // Название заказа

  const testIngredients = {
    main: [
      {
        _id: '643d69a5c3f7b9001cfa0941',
        name: 'Биокотлета из марсианской Магнолии'
      }
    ],
    bun: [{ _id: '643d69a5c3f7b9001cfa093c', name: 'Краторная булка N-200i' }],

    sauce: [
      {
        _id: '643d69a5c3f7b9001cfa0945',
        name: 'Соус с шипами Антарианского плоскоходца'
      }
    ]
  };

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

    // 3. Перехватываем запрос данных пользователя
    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // 4. Перехватываем запрос данных заказа
    cy.intercept('POST', '/api/orders', {
      statusCode: 200,
      body: {
        success: true,
        name: orderName,
        order: { number: orderNumber }
      }
    }).as('createOrder');

    // 5. Устанавливаем токен в localStorage
    window.localStorage.setItem('accessToken', 'Bearer test-access-token');
    window.localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.visit('http://localhost:4000/login');
    cy.wait(['@getIngredients', '@getUser']);

    cy.get(selectors.ingredientMain).as('mainIngredients'); // Компонент отвечающий за начинку
    cy.get(selectors.ingredientBun).as('bunIngredients'); // Компонент отвечающий за булку
    cy.get(selectors.ingredientSauce).as('sauceIngredients'); // Компонент отвечающий за соус
  });

  // Тест для добавления начинки в конструктор
  it('Должен успешно создать заказ с добавлением ингредиентов через кнопку', () => {
    // Тест для добавления начинки в конструктор
    cy.get('@mainIngredients').contains('Добавить').click();
    cy.contains(
      'p.text_type_main-default',
      'Биокотлета из марсианской Магнолии'
    ).should('exist');

    // Тест для добавления булки в конструктор
    cy.get('@bunIngredients').contains('Добавить').click();
    cy.get('@sauceIngredients').contains('Добавить').click();
    cy.contains(
      'p.text_type_main-default',
      'Соус с шипами Антарианского плоскоходца'
    ).should('exist');

    // Тест для добавления соуса в конструктор
    cy.get('@sauceIngredients').contains('Добавить').click();
    cy.contains(
      'p.text_type_main-default',
      'Соус с шипами Антарианского плоскоходца'
    ).should('exist');

    // 4. Проверяем что конструктор не пустой
    cy.get(selectors.burgerConstructor).should('not.be.empty');

    // 5. Кликаем на кнопку оформления заказа
    cy.get(selectors.buttonOrder).should('not.be.disabled').click();

    // 6. Проверяем запрос на создание заказа
    cy.wait('@createOrder')
      .its('request.body')
      .should('have.property', 'ingredients') // Проверка отдельных свойств
      .and('be.an', 'array')
      .and('include', testIngredients.bun[0]._id)
      .and('include', testIngredients.main[0]._id)
      .and('include', testIngredients.sauce[0]._id);

    // 7. Проверяем модальное окно
    cy.get(selectors.modal).should('be.visible');
    cy.contains(selectors.ingredientNumber, orderNumber).should('exist');

    // 8. Тест для закрытия модального окна по клику на крестик
    cy.get(selectors.modal).should('be.visible'); // Проверяем что модальное окно открыто
    cy.get(selectors.modalClose).click(); // Компонент отвечающий за кнопку закрытие
    cy.get(selectors.modal).should('not.exist'); // Смотрим что модалка закрыта

    // 9. Проверяем очистку конструктора
    cy.contains(selectors.burgerConstructor, 'Выберите булки').should('exist');
    cy.contains(selectors.burgerConstructor, 'Выберите начинку').should(
      'exist'
    );
  });
});
