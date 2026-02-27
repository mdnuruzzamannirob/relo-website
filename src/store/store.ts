import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import chatReducer from './slices/chatSlice';
import { authApi } from './apis/authApi';
import { cmsApi } from './apis/cmsApi';
import { productApi } from './apis/productApi';
import { offerApi } from './apis/offerApi';
import { orderApi } from './apis/orderApi';
import { dashboardApi } from './apis/dashboardApi';

export const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    [authApi.reducerPath]: authApi.reducer,
    [cmsApi.reducerPath]: cmsApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [offerApi.reducerPath]: offerApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      cmsApi.middleware,
      productApi.middleware,
      offerApi.middleware,
      orderApi.middleware,
      dashboardApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
