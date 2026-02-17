import feedReducer, {
  fetchFeeds,
  clearFeedError,
  initialState
} from '../feedSlice';

// Моковые данные для заказов (вынесены в константы)
const MOCK_ORDER_1 = {
  _id: 'order-1',
  number: 12345,
  name: 'Бургер 1',
  status: 'done',
  ingredients: ['ingredient-1', 'ingredient-2'],
  createdAt: '2025-01-01T12:00:00.000Z',
  updatedAt: '2025-01-01T12:00:00.000Z'
};

const MOCK_ORDER_2 = {
  _id: 'order-2',
  number: 12346,
  name: 'Бургер 2',
  status: 'pending',
  ingredients: ['ingredient-3', 'ingredient-4'],
  createdAt: '2025-01-01T13:00:00.000Z',
  updatedAt: '2025-01-01T13:00:00.000Z'
};

// Моковые данные для ленты заказов
const mockFeedsData = {
  success: true,
  orders: [MOCK_ORDER_1, MOCK_ORDER_2],
  total: 2,
  totalToday: 1
};

describe('feedSlice', () => {
  // 1. Начальное состояние
  it('должен возвращать начальное состояние', () => {
    expect(feedReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('Асинхронный экшен fetchFeeds', () => {
    it('должен устанавливать isLoading в true при pending', () => {
      const action = { type: fetchFeeds.pending.type };
      const state = feedReducer(initialState, action);
      
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.orders).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.totalToday).toBe(0);
    });

    it('должен устанавливать данные и isLoading в false при fulfilled', () => {
      // Сначала pending
      let state = feedReducer(initialState, { type: fetchFeeds.pending.type });
      
      // Затем fulfilled
      const fulfilledAction = {
        type: fetchFeeds.fulfilled.type,
        payload: mockFeedsData
      };
      state = feedReducer(state, fulfilledAction);
      
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(mockFeedsData.orders);
      expect(state.total).toBe(mockFeedsData.total);
      expect(state.totalToday).toBe(mockFeedsData.totalToday);
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать success: false в ответе', () => {
      const mockUnsuccessfulData = {
        success: false,
        orders: [],
        total: 0,
        totalToday: 0
      };
      
      const fulfilledAction = {
        type: fetchFeeds.fulfilled.type,
        payload: mockUnsuccessfulData
      };
      const state = feedReducer(initialState, fulfilledAction);
      
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.totalToday).toBe(0);
    });

    it('должен устанавливать ошибку и isLoading в false при rejected', () => {
      // Сначала pending
      let state = feedReducer(initialState, { type: fetchFeeds.pending.type });
      
      // Затем rejected
      const errorMessage = 'Ошибка загрузки ленты';
      const rejectedAction = {
        type: fetchFeeds.rejected.type,
        error: { message: errorMessage }
      };
      state = feedReducer(state, rejectedAction);
      
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.orders).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.totalToday).toBe(0);
    });

    it('должен очищать старые данные при новой загрузке', () => {
      // Сначала загружаем данные
      let state = feedReducer(initialState, {
        type: fetchFeeds.fulfilled.type,
        payload: mockFeedsData
      });
      
      expect(state.orders).toHaveLength(2);
      
      // Начинаем новую загрузку
      state = feedReducer(state, { type: fetchFeeds.pending.type });
      
      expect(state.isLoading).toBe(true);
      expect(state.orders).toHaveLength(2); // Данные пока не очищаются при pending
      
      // Загружаем новые данные
      const newMockData = {
        success: true,
        orders: [MOCK_ORDER_1], // используем константу
        total: 1,
        totalToday: 1
      };
      state = feedReducer(state, {
        type: fetchFeeds.fulfilled.type,
        payload: newMockData
      });
      
      expect(state.isLoading).toBe(false);
      expect(state.orders).toHaveLength(1);
      expect(state.orders[0].number).toBe(12345);
      expect(state.total).toBe(1);
      expect(state.totalToday).toBe(1);
    });
  });

  describe('Синхронные экшены', () => {
    it('должен очищать состояние через clearFeedError', () => {
      // Сначала создаем состояние с ошибкой
      const stateWithError = {
        orders: mockFeedsData.orders,
        total: mockFeedsData.total,
        totalToday: mockFeedsData.totalToday,
        isLoading: false,
        error: 'Some error'
      };
      
      const newState = feedReducer(stateWithError, clearFeedError());
      
      expect(newState).toEqual(initialState);
    });

    it('должен корректно работать clearFeedError при пустом состоянии', () => {
      const newState = feedReducer(initialState, clearFeedError());
      expect(newState).toEqual(initialState);
    });
  });
});
