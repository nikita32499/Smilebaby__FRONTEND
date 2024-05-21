import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { UserApi } from './api/users.api';
import { ViewApi } from './api/view.api';
import { itemsSlice } from './reducers/items.slice';

const rootReducers = combineReducers({
  itemsSlice: itemsSlice.reducer,
  [UserApi.reducerPath]: UserApi.reducer,
  [ViewApi.reducerPath]: ViewApi.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([UserApi.middleware, ViewApi.middleware]),
  });
};

export type RootState = ReturnType<typeof rootReducers>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
