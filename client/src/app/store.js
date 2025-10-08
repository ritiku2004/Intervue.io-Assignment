import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import pollReducer from '../features/poll/pollSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    poll: pollReducer,
  },
});