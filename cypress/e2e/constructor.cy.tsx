describe('проверяем страницу конструктора бургера', function () {
  beforeEach(() => {
    cy.setupInterceptors();
    cy.setupAuth();
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  describe('проверяем конструктор бургера', () => {
    // Проверяет добавление булки в конструктор и корректное отображение 
    // верхней и нижней частей булки
    it('проверяем добавление булки из списка в конструктор', () => {
      cy.clickIngredientItem(0);
      
      cy.getByTestId('noBunTop-message').should('not.exist');
      cy.getByTestId('noBunBottom-message').should('not.exist');
      cy.getByTestId('constructor-bunTop').should('exist');
      cy.getByTestId('constructor-bunBottom').should('exist');
    });

    // Проверяет добавление начинки в конструктор и
    // корректное отображение добавленного элемента
    it('проверяем добавление начинки из списка в конструктор', () => {
      cy.clickIngredientItem(1);
      
      cy.getByTestId('no-filling-message').should('not.exist');
      cy.getByTestId('constructor-filling-item').should('exist');
    });

    // Проверяет добавление соуса в конструктор и
    // корректное отображение добавленного элемента
    it('проверяем добавление соуса из списка в конструктор', () => {
      cy.clickIngredientItem(2);
      
      cy.getByTestId('no-filling-message').should('not.exist');
      cy.getByTestId('constructor-filling-item').should('exist');
    });
  });

  describe('проверяем работу модального окна', () => {
    beforeEach(() => {
      cy.getByTestId('ingredient-item').eq(0).click();
    });

    // Проверяет корректность отображения данных ингредиента
    // в модальном окне (изображение, название, пищевая ценность)
    it('проверяем открытие модального окна именно того ингредиента, по которому произошел клик', () => {
      cy.checkModalIsVisible();
      
      cy.getByTestId('ingredient-image')
        .should('be.visible')
        .and('have.attr', 'src')
        .should('include', 'bun-01-large.png');
        
      cy.getByTestId('ingredient-title').should(
        'contain',
        'Флюоресцентная булка R2-D3'
      );
      
      cy.getByTestId('ingredient-details').within(() => {
        cy.contains('Калории, ккал').next().should('contain', '643');
        cy.contains('Белки, г').next().should('contain', '44');
        cy.contains('Жиры, г').next().should('contain', '26');
        cy.contains('Углеводы, г').next().should('contain', '85');
      });
    });

    // Проверяет закрытие модального окна при клике на кнопку закрытия
    it('проверяем закрытие модального окна', () => {
      cy.getByTestId('modal-close-button').click();
      cy.checkModalIsNotVisible();
    });

    // При клике на оверлей
    it('проверяем закрытие модального окна при клике на оверлей', () => {
      cy.getByTestId('modal-overlay').click({ force: true });
      cy.checkModalIsNotVisible();
    });

    // При нажатии клавиши Esc
    it('проверяем закрытие модального окна клавишей Esc', () => {
      cy.get('body').type('{esc}');
      cy.checkModalIsNotVisible();
    });
  });

  describe('проверяем создание заказа', () => {
    beforeEach(() => {
      cy.addIngredientsToConstructor();
    });

    // Проверяет корректность сборки бургера в конструкторе,
    // наличие всех необходимых компонентов
    it('проверяем, что бургер собирается', () => {
      cy.getByTestId('constructor-bunTop').should('exist');
      cy.getByTestId('constructor-bunBottom').should('exist');
      cy.getByTestId('constructor-filling-item').should('exist');
      cy.getByTestId('constructor-filling-item').should('have.length', 2);
    });

    // Проверяет успешное оформление заказа:
    // открытие модального окна с корректным номером заказа
    it('проверяем, что при клике по кнопке «Оформить заказ» открывается модальное окно с верным номером заказа', () => {
      cy.getByTestId('order-button').click();
      cy.wait('@createOrder');
      cy.checkModalIsVisible();
      cy.getByTestId('order-number').should('contain', '96383');
    });


    // Проверяет очистку конструктора бургера
    // после закрытия модального окна с подтверждением заказа
    it('проверяем, что при закрытии модального окна очищается конструктор', () => {
      cy.getByTestId('order-button').click();
      cy.wait('@createOrder');
      cy.getByTestId('modal-close-button').click();
      cy.checkModalIsNotVisible();
      cy.getByTestId('noBunTop-message').should('be.visible');
      cy.getByTestId('no-filling-message').should('be.visible');
      cy.getByTestId('noBunBottom-message').should('be.visible');
    });
  });
});
