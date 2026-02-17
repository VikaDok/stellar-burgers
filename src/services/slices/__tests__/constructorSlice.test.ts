import {
  burgerReducer,
  addBun,
  addIngredient,
  deleteIngredient,
  moveIngredient,
  clearConstructor,
  initialState
} from '../constructorSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

// Моковые данные (без id, он генерируется в тесте)
const mockBun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка',
  type: 'bun',
  price: 1255,
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  image: '',
  image_large: '',
  image_mobile: ''
};

const mockMain: TIngredient = {
  _id: 'main-1',
  name: 'Говяжий метеорит',
  type: 'main',
  price: 424,
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  image: '',
  image_large: '',
  image_mobile: ''
};

const mockSauce: TIngredient = {
  _id: 'sauce-1',
  name: 'Соус с шипами',
  type: 'sauce',
  price: 150,
  proteins: 10,
  fat: 20,
  carbohydrates: 5,
  calories: 200,
  image: '',
  image_large: '',
  image_mobile: ''
};

// Вспомогательная функция для создания ингредиента конструктора
const toConstructorIngredient = (ingredient: TIngredient): TConstructorIngredient => ({
  ...ingredient,
  id: `${ingredient._id}-${Date.now()}-${Math.random()}`
});

describe('constructorSlice', () => {
  it('должен возвращать начальное состояние', () => {
    expect(burgerReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('addBun', () => {
    it('должен добавлять булку', () => {
      const bun = toConstructorIngredient(mockBun);
      const newState = burgerReducer(initialState, addBun(bun));

      expect(newState.bun).toEqual(bun);
      expect(newState.ingredients).toEqual([]);
    });

    it('должен заменять старую булку новой', () => {
      const bun1 = toConstructorIngredient(mockBun);
      const bun2 = toConstructorIngredient({ ...mockBun, _id: 'bun-2', name: 'Флюоресцентная булка' });

      let state = burgerReducer(initialState, addBun(bun1));
      state = burgerReducer(state, addBun(bun2));

      expect(state.bun).toEqual(bun2);
    });
  });

  describe('addIngredient', () => {
    it('должен добавлять начинку в список', () => {
      const ingredient = toConstructorIngredient(mockMain);
      const newState = burgerReducer(initialState, addIngredient(ingredient));

      expect(newState.bun).toBeNull();
      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]).toEqual(ingredient);
    });

    it('должен добавлять несколько ингредиентов подряд', () => {
      const ing1 = toConstructorIngredient(mockMain);
      const ing2 = toConstructorIngredient(mockSauce);

      let state = burgerReducer(initialState, addIngredient(ing1));
      state = burgerReducer(state, addIngredient(ing2));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0]).toEqual(ing1);
      expect(state.ingredients[1]).toEqual(ing2);
    });
  });

  describe('deleteIngredient', () => {
    it('должен удалять ингредиент по id', () => {
      const ing1 = toConstructorIngredient(mockMain);
      const ing2 = toConstructorIngredient(mockSauce);

      let state = burgerReducer(initialState, addIngredient(ing1));
      state = burgerReducer(state, addIngredient(ing2));

      expect(state.ingredients).toHaveLength(2);

      state = burgerReducer(state, deleteIngredient(ing1.id));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].id).toBe(ing2.id);
    });

    it('не должен ничего удалять при неверном id', () => {
      const ing = toConstructorIngredient(mockMain);
      let state = burgerReducer(initialState, addIngredient(ing));

      const before = state.ingredients.length;
      state = burgerReducer(state, deleteIngredient('wrong-id'));

      expect(state.ingredients).toHaveLength(before);
    });
  });

  describe('moveIngredient', () => {
    it('должен перемещать ингредиент с 0 на 2 позицию', () => {
      const ing1 = toConstructorIngredient(mockMain);
      const ing2 = toConstructorIngredient(mockSauce);
      const ing3 = toConstructorIngredient({ ...mockMain, _id: 'main-2', name: 'Биокотлета' });

      let state = burgerReducer(initialState, addIngredient(ing1));
      state = burgerReducer(state, addIngredient(ing2));
      state = burgerReducer(state, addIngredient(ing3));

      expect(state.ingredients.map(i => i._id)).toEqual(['main-1', 'sauce-1', 'main-2']);

      state = burgerReducer(state, moveIngredient({ fromIndex: 0, toIndex: 2 }));

      expect(state.ingredients.map(i => i._id)).toEqual(['sauce-1', 'main-2', 'main-1']);
    });

    it('не должен изменять порядок при выходе индексов за границы', () => {
      const ing1 = toConstructorIngredient(mockMain);
      const ing2 = toConstructorIngredient(mockSauce);

      let state = burgerReducer(initialState, addIngredient(ing1));
      state = burgerReducer(state, addIngredient(ing2));

      const before = state.ingredients.map(i => i._id);
      state = burgerReducer(state, moveIngredient({ fromIndex: 0, toIndex: 5 }));

      expect(state.ingredients.map(i => i._id)).toEqual(before);
    });
  });

  describe('clearConstructor', () => {
    it('должен очищать всё состояние', () => {
      const bun = toConstructorIngredient(mockBun);
      const ing = toConstructorIngredient(mockMain);

      let state = burgerReducer(initialState, addBun(bun));
      state = burgerReducer(state, addIngredient(ing));

      expect(state.bun).not.toBeNull();
      expect(state.ingredients).not.toHaveLength(0);

      state = burgerReducer(state, clearConstructor());

      expect(state).toEqual(initialState);
    });
  });
});
