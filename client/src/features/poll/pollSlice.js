import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createNewPoll } from '../../api/pollApi';

const initialState = {
  currentPoll: null,
  isLoading: false,
  error: null,
};

export const createPoll = createAsyncThunk(
  'polls/create',
  async (pollData, thunkAPI) => {
    try {
      return await createNewPoll(pollData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error.message);
    }
  }
);

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPoll.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPoll.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPoll = action.payload;
      })
      .addCase(createPoll.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default pollSlice.reducer;