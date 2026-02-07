import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import { authApi } from './apis/authApi';
import { cmsApi } from './apis/cmsApi';
import { productApi } from './apis/productApi';

export const store = configureStore({
  reducer: {
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [cmsApi.reducerPath]: cmsApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, cmsApi.middleware, productApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
