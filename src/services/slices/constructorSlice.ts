import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';
type TBurgerConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};
const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: []
};
const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TConstructorIngredient>) => ({
      ...state,
      bun: action.payload
    }),
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => ({
      ...state,
      ingredients: [...(state.ingredients || []), action.payload]
    }),
    deleteIngredient: (state, action: PayloadAction<string>) => ({
      ...state,
      ingredients: (state.ingredients || []).filter(
        (item) => item.id !== action.payload
      )
    }),
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const ingredients = [...(state.ingredients || [])];

      if (
        fromIndex >= 0 &&
        fromIndex < ingredients.length &&
        toIndex >= 0 &&
        toIndex < ingredients.length
      ) {
        const [movedItem] = ingredients.splice(fromIndex, 1);
        ingredients.splice(toIndex, 0, movedItem);
      }

      return {
        ...state,
        ingredients
      };
    },
    clearConstructor: () => initialState
  }
});

export const burgerReducer = constructorSlice.reducer;
export { initialState };
export const {
  addBun,
  addIngredient,
  deleteIngredient,
  clearConstructor,
  moveIngredient
} = constructorSlice.actions;
