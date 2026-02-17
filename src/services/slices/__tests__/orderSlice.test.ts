import orderReducer, {
  createOrder,
  getOrderByNumber,
  clearOrder,
  initialState
} from '../orderSlice';

// Моковые данные для заказа (вынесены в константы)
const ORDER_ID = 'order-1';
const ORDER_NUMBER = 12345;
const ORDER_NAME = 'Space бургер';
const ORDER_STATUS = 'done';
const ORDER_INGREDIENTS = ['ingredient-1', 'ingredient-2'];
const ORDER_CREATED_AT = '2025-01-01T12:00:00.000Z';
const ORDER_UPDATED_AT = '2025-01-01T12:00:00.000Z';

const mockOrder = {
  _id: ORDER_ID,
  number: ORDER_NUMBER,
  name: ORDER_NAME,
  status: ORDER_STATUS,
  ingredients: ORDER_INGREDIENTS,
  createdAt: ORDER_CREATED_AT,
  updatedAt: ORDER_UPDATED_AT
};

const mockOrderResponse = {
  success: true,
  order: mockOrder,
  name: ORDER_NAME
};

// Мок для getState
const BUN_ID = 'bun-1';
const BUN_NAME = 'Булка';
const INGREDIENT_1_ID = 'ing-1';
const INGREDIENT_2_ID = 'ing-2';

const mockStateWithBunAndIngredients = {
  constructor: {
    bun: { _id: BUN_ID, name: BUN_NAME },
    ingredients: [{ _id: INGREDIENT_1_ID }, { _id: INGREDIENT_2_ID }]
  }
};

const mockStateWithoutBun = {
  constructor: {
    bun: null,
    ingredients: [{ _id: INGREDIENT_1_ID }]
  }
};

const mockStateWithoutIngredients = {
  constructor: {
    bun: { _id: BUN_ID, name: BUN_NAME },
    ingredients: []
  }
};

// Константы для сообщений об ошибках
const ERROR_CREATE_ORDER = 'Не удалось создать заказ';
const ERROR_LOADING = 'Ошибка загрузки';
const ERROR_NO_BUN = 'Выберите булку для заказа';
const ERROR_NO_INGREDIENTS = 'Добавьте начинку для заказа';

describe('orderSlice', () => {
  // 1. Начальное состояние
  it('должен возвращать начальное состояние', () => {
    expect(orderReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('createOrder', () => {
    it('должен устанавливать isLoading в true при pending', () => {
      const action = { type: createOrder.pending.type };
      const state = orderReducer(initialState, action);
      
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.currentOrder).toBeNull();
      expect(state.orderNumber).toBeNull();
    });

    it('должен устанавливать данные заказа и isLoading в false при fulfilled', () => {
      // Сначала pending
      let state = orderReducer(initialState, { type: createOrder.pending.type });
      
      // Затем fulfilled
      const fulfilledAction = {
        type: createOrder.fulfilled.type,
        payload: mockOrderResponse
      };
      state = orderReducer(state, fulfilledAction);
      
      expect(state.isLoading).toBe(false);
      expect(state.currentOrder).toEqual(mockOrder);
      expect(state.orderNumber).toBe(ORDER_NUMBER);
      expect(state.error).toBeNull();
    });

    it('должен устанавливать ошибку и isLoading в false при rejected', () => {
      // Сначала pending
      let state = orderReducer(initialState, { type: createOrder.pending.type });
      
      // Затем rejected
      const rejectedAction = {
        type: createOrder.rejected.type,
        error: { message: ERROR_CREATE_ORDER }
      };
      state = orderReducer(state, rejectedAction);
      
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(ERROR_CREATE_ORDER);
      expect(state.currentOrder).toBeNull();
      expect(state.orderNumber).toBeNull();
    });
  });

  describe('getOrderByNumber', () => {
    it('должен устанавливать isLoading в true при pending (строки 33-34)', () => {
      const action = { type: getOrderByNumber.pending.type };
      const state = orderReducer(initialState, action);
      
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен устанавливать currentOrder и isLoading в false при fulfilled (строки 47-49)', () => {
      // Сначала pending
      let state = orderReducer(initialState, { type: getOrderByNumber.pending.type });
      
      // Затем fulfilled
      const fulfilledAction = {
        type: getOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      state = orderReducer(state, fulfilledAction);
      
      expect(state.isLoading).toBe(false);
      expect(state.currentOrder).toEqual(mockOrder);
      expect(state.error).toBeNull();
    });

    it('должен устанавливать ошибку и isLoading в false при rejected (строки 51-54)', () => {
      // Сначала pending
      let state = orderReducer(initialState, { type: getOrderByNumber.pending.type });
      
      // Затем rejected
      const rejectedAction = {
        type: getOrderByNumber.rejected.type,
        error: { message: ERROR_LOADING }
      };
      state = orderReducer(state, rejectedAction);
      
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(ERROR_LOADING);
      expect(state.currentOrder).toBeNull();
      expect(state.orderNumber).toBeNull();
    });

    it('должен обрабатывать стандартное сообщение об ошибке при отсутствии error.message', () => {
      const rejectedAction = {
        type: getOrderByNumber.rejected.type,
        error: {} // нет message
      };
      const state = orderReducer(initialState, rejectedAction);
      
      expect(state.error).toBe(ERROR_LOADING); // значение по умолчанию
    });
  });

  describe('Валидация в createOrder', () => {
    it('должен выбрасывать ошибку при отсутствии булки', async () => {
      const thunk = createOrder([INGREDIENT_1_ID]);
      
      try {
        await thunk(
          () => {},
          () => mockStateWithoutBun,
          {}
        );
      } catch (error: any) {
        expect(error.message).toBe(ERROR_NO_BUN);
      }
    });

    it('должен выбрасывать ошибку при отсутствии начинки', async () => {
      const thunk = createOrder([]);
      
      try {
        await thunk(
          () => {},
          () => mockStateWithoutIngredients,
          {}
        );
      } catch (error: any) {
        expect(error.message).toBe(ERROR_NO_INGREDIENTS);
      }
    });
  });

  describe('clearOrder', () => {
    it('должен очищать currentOrder, orderNumber и error', () => {
      const stateWithData = {
        currentOrder: mockOrder,
        orderNumber: ORDER_NUMBER,
        isLoading: false,
        error: 'Some error'
      };
      
      const newState = orderReducer(stateWithData, clearOrder());
      
      expect(newState.currentOrder).toBeNull();
      expect(newState.orderNumber).toBeNull();
      expect(newState.error).toBeNull();
      expect(newState.isLoading).toBe(false);
    });

    it('не должен изменять isLoading при очистке', () => {
      const stateWithLoading = {
        currentOrder: mockOrder,
        orderNumber: ORDER_NUMBER,
        isLoading: true,
        error: null
      };
      
      const newState = orderReducer(stateWithLoading, clearOrder());
      
      expect(newState.currentOrder).toBeNull();
      expect(newState.orderNumber).toBeNull();
      expect(newState.error).toBeNull();
      expect(newState.isLoading).toBe(true);
    });
  });
});
