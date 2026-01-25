import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import userReducer from './slices/userSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import { burgerReducer } from './slices/constructorSlice';
import feedReducer from './slices/feedSlice';
import orderReducer from './slices/orderSlice';
import userOrdersReducer from './slices/userOrdersSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructor: burgerReducer,
  order: orderReducer,
  user: userReducer,
  feed: feedReducer,
  userOrders: userOrdersReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => dispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
