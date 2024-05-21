import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { ItemsApi } from './api/users.api';
import { itemsSlice } from './reducers/items.slice';

const rootReducers = combineReducers({
  itemsSlice: itemsSlice.reducer,
  [ItemsApi.reducerPath]: ItemsApi.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([ItemsApi.middleware]),
  });
};

export type RootState = ReturnType<typeof rootReducers>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
