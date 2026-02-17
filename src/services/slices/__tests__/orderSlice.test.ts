import orderReducer, {
  createOrder,
  getOrderByNumber,
  clearOrder,
  initialState
} from '../orderSlice';

// Моковые данные для заказа
const mockOrder = {
  _id: 'order-1',
  number: 12345,
  name: 'Space бургер',
  status: 'done',
  ingredients: ['ingredient-1', 'ingredient-2'],
  createdAt: '2025-01-01T12:00:00.000Z',
  updatedAt: '2025-01-01T12:00:00.000Z'
};

const mockOrderResponse = {
  success: true,
  order: mockOrder,
  name: mockOrder.name
};

// Мок для getState
const mockStateWithBunAndIngredients = {
  constructor: {
    bun: { _id: 'bun-1', name: 'Булка' },
    ingredients: [{ _id: 'ing-1' }, { _id: 'ing-2' }]
  }
};

const mockStateWithoutBun = {
  constructor: {
    bun: null,
    ingredients: [{ _id: 'ing-1' }]
  }
};

const mockStateWithoutIngredients = {
  constructor: {
    bun: { _id: 'bun-1', name: 'Булка' },
    ingredients: []
  }
};

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
      expect(state.orderNumber).toBe(mockOrder.number);
      expect(state.error).toBeNull();
    });

    it('должен устанавливать ошибку и isLoading в false при rejected', () => {
      // Сначала pending
      let state = orderReducer(initialState, { type: createOrder.pending.type });
      
      // Затем rejected
      const errorMessage = 'Не удалось создать заказ';
      const rejectedAction = {
        type: createOrder.rejected.type,
        error: { message: errorMessage }
      };
      state = orderReducer(state, rejectedAction);
      
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
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
      const errorMessage = 'Ошибка загрузки';
      const rejectedAction = {
        type: getOrderByNumber.rejected.type,
        error: { message: errorMessage }
      };
      state = orderReducer(state, rejectedAction);
      
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.currentOrder).toBeNull();
      expect(state.orderNumber).toBeNull();
    });

    it('должен обрабатывать стандартное сообщение об ошибке при отсутствии error.message', () => {
      const rejectedAction = {
        type: getOrderByNumber.rejected.type,
        error: {} // нет message
      };
      const state = orderReducer(initialState, rejectedAction);
      
      expect(state.error).toBe('Ошибка загрузки'); // значение по умолчанию
    });
  });

  describe('Валидация в createOrder', () => {
    it('должен выбрасывать ошибку при отсутствии булки', async () => {
      const thunk = createOrder(['ing-1']);
      
      try {
        await thunk(
          () => {},
          () => mockStateWithoutBun,
          {}
        );
      } catch (error: any) {
        expect(error.message).toBe('Выберите булку для заказа');
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
        expect(error.message).toBe('Добавьте начинку для заказа');
      }
    });
  });

  describe('clearOrder', () => {
    it('должен очищать currentOrder, orderNumber и error', () => {
      const stateWithData = {
        currentOrder: mockOrder,
        orderNumber: mockOrder.number,
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
        orderNumber: mockOrder.number,
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
