import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

// Get token from localStorage
const token = localStorage.getItem('token');

const initialState = {
  user: null,
  token: token || null,
  isAuthenticated: !!token,
  isLoading: false,
  error: null,
};

// Async Thunk for logging in
export const loginUser = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const response = await api.post('/auth/login', userData);
    localStorage.setItem('token', response.data.data.token);
    return response.data.data.token;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.error.message);
  }
});

// Async Thunk for registration
export const registerUser = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await api.post('/teachers/create', userData);
    localStorage.setItem('token', response.data.data.token);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.error.message);
  }
});


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add cases for registerUser as well
      .addCase(registerUser.fulfilled, (state, action) => {
         state.isLoading = false;
         state.isAuthenticated = true;
         state.token = action.payload.token;
         state.user = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;