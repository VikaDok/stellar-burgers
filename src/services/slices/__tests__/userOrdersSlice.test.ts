import userOrdersReducer, {
  fetchUserOrders,
  clearUserOrdersError,
  clearUserOrders,
  initialState
} from '../userOrdersSlice';

// Моковые данные для заказов
const mockOrders = [
  {
    _id: 'order-1',
    number: 12345,
    name: 'Бургер 1',
    status: 'done',
    ingredients: ['ingredient-1', 'ingredient-2'],
    createdAt: '2025-01-01T12:00:00.000Z',
    updatedAt: '2025-01-01T12:00:00.000Z'
  },
  {
    _id: 'order-2',
    number: 12346,
    name: 'Бургер 2',
    status: 'pending',
    ingredients: ['ingredient-3', 'ingredient-4'],
    createdAt: '2025-01-01T13:00:00.000Z',
    updatedAt: '2025-01-01T13:00:00.000Z'
  }
];

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
      const errorMessage = 'Ошибка загрузки';
      const rejectedAction = {
        type: fetchUserOrders.rejected.type,
        payload: errorMessage // rejectWithValue передаёт payload
      };
      state = userOrdersReducer(state, rejectedAction);
      
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.orders).toEqual([]);
    });

    it('должен обрабатывать стандартное сообщение об ошибке при отсутствии payload', () => {
      const rejectedAction = {
        type: fetchUserOrders.rejected.type,
        payload: undefined
      };
      const state = userOrdersReducer(initialState, rejectedAction);
      
      expect(state.error).toBe('Ошибка загрузки');
    });
  });

  describe('Синхронные экшены', () => {
    it('должен очищать ошибку через clearUserOrdersError', () => {
      // Создаём состояние с ошибкой
      const stateWithError = {
        ...initialState,
        error: 'Some error'
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
        error: 'Some error'
      };
      
      const newState = userOrdersReducer(stateWithData, clearUserOrders());
      
      expect(newState.orders).toEqual([]);
      expect(newState.error).toBeNull();
      expect(newState.isLoading).toBe(true);
    });
  });
});
