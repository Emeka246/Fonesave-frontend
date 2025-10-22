import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import appReducer from './slices/app.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
    // Add other reducers here as your application grows
  },
  // Add middleware or other store enhancers here if needed
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;