import ingredientsReducer, {
  getIngredients,
  initialState,
  clearConstructorError
} from '../ingredientsSlice';

// Константы для ингредиентов
const BUN_ID = '1';
const BUN_NAME = 'Краторная булка';
const BUN_TYPE = 'bun';
const BUN_PRICE = 1255;
const BUN_PROTEINS = 80;
const BUN_FAT = 24;
const BUN_CARBS = 53;
const BUN_CALORIES = 420;

const MAIN_ID = '2';
const MAIN_NAME = 'Биокотлета';
const MAIN_TYPE = 'main';
const MAIN_PRICE = 424;
const MAIN_PROTEINS = 420;
const MAIN_FAT = 142;
const MAIN_CARBS = 242;
const MAIN_CALORIES = 4242;

// Моковые данные
const mockIngredients = [
  {
    _id: BUN_ID,
    name: BUN_NAME,
    type: BUN_TYPE,
    price: BUN_PRICE,
    proteins: BUN_PROTEINS,
    fat: BUN_FAT,
    carbohydrates: BUN_CARBS,
    calories: BUN_CALORIES,
    image: '',
    image_mobile: '',
    image_large: ''
  },
  {
    _id: MAIN_ID,
    name: MAIN_NAME,
    type: MAIN_TYPE,
    price: MAIN_PRICE,
    proteins: MAIN_PROTEINS,
    fat: MAIN_FAT,
    carbohydrates: MAIN_CARBS,
    calories: MAIN_CALORIES,
    image: '',
    image_mobile: '',
    image_large: ''
  }
];

// Константы для сообщений
const ERROR_MESSAGE = 'Ошибка загрузки';

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
      error: { message: ERROR_MESSAGE }
    };
    const state = ingredientsReducer(initialState, errorAction);
    
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(ERROR_MESSAGE);
    expect(state.ingredients).toEqual([]);
  });

  // 5. ТЕСТ ДЛЯ clearConstructorError (покрывает строки 27-28)
  it('должен очищать ошибку через clearConstructorError', () => {
    // Сначала создаём состояние с ошибкой
    const errorAction = {
      type: getIngredients.rejected.type,
      error: { message: ERROR_MESSAGE }
    };
    const stateWithError = ingredientsReducer(initialState, errorAction);
    
    expect(stateWithError.error).toBe(ERROR_MESSAGE);
    
    // Вызываем экшен очистки
    const newState = ingredientsReducer(stateWithError, clearConstructorError());
    
    expect(newState.error).toBeNull();
    expect(newState.ingredients).toEqual([]);
    expect(newState.isLoading).toBe(false);
  });
});
