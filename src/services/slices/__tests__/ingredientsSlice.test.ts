import ingredientsReducer, {
  getIngredients,
  initialState,
  clearConstructorError
} from '../ingredientsSlice';

// Моковые данные (убрал __v, так как его нет в TIngredient)
const mockIngredients = [
  {
    _id: '1',
    name: 'Краторная булка',
    type: 'bun',
    price: 1255,
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    image: '',
    image_mobile: '',
    image_large: ''
  },
  {
    _id: '2',
    name: 'Биокотлета',
    type: 'main',
    price: 424,
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    image: '',
    image_mobile: '',
    image_large: ''
  }
];

describe('ingredientsSlice', () => {
  // 1. Начальное состояние
  it('должен возвращать начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  // 2. Обработка pending
  it('должен обрабатывать getIngredients.pending', () => {
    const state = ingredientsReducer(initialState, getIngredients.pending(''));
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  // 3. Обработка fulfilled
  it('должен обрабатывать getIngredients.fulfilled', () => {
    const state = ingredientsReducer(
      initialState,
      getIngredients.fulfilled(mockIngredients, '')
    );
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBe(null);
  });

  // 4. Обработка rejected
  it('должен обрабатывать getIngredients.rejected', () => {
    const errorAction = {
      type: getIngredients.rejected.type,
      error: { message: 'Ошибка загрузки' }
    };
    const state = ingredientsReducer(initialState, errorAction);
    
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
    expect(state.ingredients).toEqual([]);
  });

  // 5. ТЕСТ ДЛЯ clearConstructorError (покрывает строки 27-28)
  it('должен очищать ошибку через clearConstructorError', () => {
    // Сначала создаём состояние с ошибкой
    const errorAction = {
      type: getIngredients.rejected.type,
      error: { message: 'Ошибка загрузки' }
    };
    const stateWithError = ingredientsReducer(initialState, errorAction);
    
    expect(stateWithError.error).toBe('Ошибка загрузки');
    
    // Вызываем экшен очистки
    const newState = ingredientsReducer(stateWithError, clearConstructorError());
    
    expect(newState.error).toBeNull();
    expect(newState.ingredients).toEqual([]);
    expect(newState.isLoading).toBe(false);
  });
});
