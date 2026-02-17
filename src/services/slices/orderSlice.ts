import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import { RootState } from '../store';

interface OrderState {
  currentOrder: TOrder | null;
  orderNumber: number | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  currentOrder: null,
  orderNumber: null,
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[], { getState }) => {
    const state = getState() as RootState;
    const { bun, ingredients: constructorIngredients } = state.constructor;

    if (!bun) {
      throw new Error('Выберите булку для заказа');
    }

    if (constructorIngredients.length === 0) {
      throw new Error('Добавьте начинку для заказа');
    }

    const data = await orderBurgerApi(ingredients);

    if (!data.success) {
      throw new Error('Не удалось создать заказ');
    }

    return data;
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (orderNumber: number) => {
    const data = await getOrderByNumberApi(orderNumber);

    if (!data.success) {
      throw new Error('Ошибка загрузки');
    }

    return data.orders[0];
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
      state.orderNumber = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.order;
        state.orderNumber = action.payload.order.number;
      })

      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось создать заказ';
      })

      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки';
      })

      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export { initialState };
export default orderSlice.reducer;
