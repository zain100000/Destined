import axios from 'axios';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import CONFIG from '../config/Config';

const {BASE_URL} = CONFIG;

export const getInterests = createAsyncThunk(
  'interest/getInterests',
  async (_, {rejectWithValue}) => {
    try {

      const response = await axios.get(`${BASE_URL}/interest/get-all-interests`);

      return response.data.interests;
    } catch (error) {
      console.error(
        'Error fetching interests:',
        error.response?.data || error.message,
      );
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const interestSlice = createSlice({
  name: 'interest',
  initialState: {
    interest: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getInterests.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInterests.fulfilled, (state, action) => {
        state.loading = false;
        state.interest = action.payload;
      })
      .addCase(getInterests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default interestSlice.reducer;
