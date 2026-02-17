import userOrdersReducer, {
  fetchUserOrders,
  clearUserOrdersError,
  clearUserOrders,
  initialState
} from '../userOrdersSlice';

// Константы для заказов
const ORDER_1_ID = 'order-1';
const ORDER_1_NUMBER = 12345;
const ORDER_1_NAME = 'Бургер 1';
const ORDER_1_STATUS = 'done';
const ORDER_1_INGREDIENTS = ['ingredient-1', 'ingredient-2'];
const ORDER_1_CREATED_AT = '2025-01-01T12:00:00.000Z';
const ORDER_1_UPDATED_AT = '2025-01-01T12:00:00.000Z';

const ORDER_2_ID = 'order-2';
const ORDER_2_NUMBER = 12346;
const ORDER_2_NAME = 'Бургер 2';
const ORDER_2_STATUS = 'pending';
const ORDER_2_INGREDIENTS = ['ingredient-3', 'ingredient-4'];
const ORDER_2_CREATED_AT = '2025-01-01T13:00:00.000Z';
const ORDER_2_UPDATED_AT = '2025-01-01T13:00:00.000Z';

// Моковые данные для заказов
const mockOrders = [
  {
    _id: ORDER_1_ID,
    number: ORDER_1_NUMBER,
    name: ORDER_1_NAME,
    status: ORDER_1_STATUS,
    ingredients: ORDER_1_INGREDIENTS,
    createdAt: ORDER_1_CREATED_AT,
    updatedAt: ORDER_1_UPDATED_AT
  },
  {
    _id: ORDER_2_ID,
    number: ORDER_2_NUMBER,
    name: ORDER_2_NAME,
    status: ORDER_2_STATUS,
    ingredients: ORDER_2_INGREDIENTS,
    createdAt: ORDER_2_CREATED_AT,
    updatedAt: ORDER_2_UPDATED_AT
  }
];

// Константы для сообщений
const ERROR_LOADING = 'Ошибка загрузки';
const DEFAULT_ERROR = 'Some error';

describe('userOrdersSlice', () => {
  // 1. Начальное состояние
  it('должен возвращать начальное состояние', () => {
    expect(userOrdersReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('Асинхронный экшен fetchUserOrders', () => {
    it('должен устанавливать isLoading в true при pending', () => {
      const action = { type: fetchUserOrders.pending.type };
      const state = userOrdersReducer(initialState, action);
      
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.orders).toEqual([]);
    });

    it('должен устанавливать orders и isLoading в false при fulfilled', () => {
      // Сначала pending
      let state = userOrdersReducer(initialState, { type: fetchUserOrders.pending.type });
      
      // Затем fulfilled
      const fulfilledAction = {
        type: fetchUserOrders.fulfilled.type,
        payload: mockOrders
      };
      state = userOrdersReducer(state, fulfilledAction);
      
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
      expect(state.error).toBeNull();
    });

    it('должен устанавливать error и isLoading в false при rejected', () => {
      // Сначала pending
      let state = userOrdersReducer(initialState, { type: fetchUserOrders.pending.type });
      
      // Затем rejected
      const rejectedAction = {
        type: fetchUserOrders.rejected.type,
        payload: ERROR_LOADING // rejectWithValue передаёт payload
      };
      state = userOrdersReducer(state, rejectedAction);
      
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(ERROR_LOADING);
      expect(state.orders).toEqual([]);
    });

    it('должен обрабатывать стандартное сообщение об ошибке при отсутствии payload', () => {
      const rejectedAction = {
        type: fetchUserOrders.rejected.type,
        payload: undefined
      };
      const state = userOrdersReducer(initialState, rejectedAction);
      
      expect(state.error).toBe(ERROR_LOADING);
    });
  });

  describe('Синхронные экшены', () => {
    it('должен очищать ошибку через clearUserOrdersError', () => {
      // Создаём состояние с ошибкой
      const stateWithError = {
        ...initialState,
        error: DEFAULT_ERROR
      };
      
      const newState = userOrdersReducer(stateWithError, clearUserOrdersError());
      
      expect(newState.error).toBeNull();
      expect(newState.orders).toEqual([]);
      expect(newState.isLoading).toBe(false);
    });

    it('должен полностью очищать состояние через clearUserOrders', () => {
      // Создаём состояние с данными
      const stateWithData = {
        orders: mockOrders,
        isLoading: true,
        error: DEFAULT_ERROR
      };
      
      const newState = userOrdersReducer(stateWithData, clearUserOrders());
      
      expect(newState.orders).toEqual([]);
      expect(newState.error).toBeNull();
      expect(newState.isLoading).toBe(true);
    });
  });
});
