import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import CONFIG from '../config/Config';

const {BASE_URL} = CONFIG;

const getToken = async rejectWithValue => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('User is not authenticated.');
    return token;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch token.');
  }
};

export const getProfileMatch = createAsyncThunk(
  'profileMatch/getProfileMatch',
  async (userId, {rejectWithValue}) => {
    try {
      const token = await getToken(rejectWithValue);
      const response = await axios.get(
        `${BASE_URL}/profile-match/${userId}/get-profile-matches`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      return response.data.profileMatches;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const profileMatchSlice = createSlice({
  name: 'profileMatch',
  initialState: {
    profileMatch: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getProfileMatch.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfileMatch.fulfilled, (state, action) => {
        state.loading = false;
        state.profileMatch = action.payload;
      })
      .addCase(getProfileMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileMatchSlice.reducer;
