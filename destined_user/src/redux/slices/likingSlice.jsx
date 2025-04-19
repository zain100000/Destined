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

export const likeUser = createAsyncThunk(
  'liking/likeUser',
  async ({userId, targetUserId}, {rejectWithValue}) => {
    try {
      console.log('Attempting to like user:', targetUserId);
      const token = await getToken(rejectWithValue);

      console.log('Making API call to like user...');
      const response = await axios.post(
        `${BASE_URL}/liking/${userId}/like-user`,
        {
          targetUserId,
          action: 'LIKE',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Like API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Like user error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const dislikeUser = createAsyncThunk(
  'liking/dislikeUser',
  async ({userId, targetUserId}, {rejectWithValue}) => {
    try {
      console.log('Attempting to dislike user:', targetUserId);
      const token = await getToken(rejectWithValue);

      console.log('Making API call to dislike user...');
      const response = await axios.post(
        `${BASE_URL}/liking/${userId}/dislike-user`,
        {
          targetUserId,
          action: 'DISLIKE',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Dislike API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Dislike user error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const getLikedUsers = createAsyncThunk(
  'liking/getLikedUsers',
  async (_, {rejectWithValue}) => {
    try {
      const token = await getToken(rejectWithValue);
      const response = await axios.get(`${BASE_URL}/liking/liked-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const likingSlice = createSlice({
  name: 'liking',
  initialState: {
    likedUsers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(likeUser.pending, state => {
        console.log('Like action pending...');
        state.loading = true;
        state.error = null;
      })
      .addCase(likeUser.fulfilled, (state, action) => {
        console.log('Like action fulfilled:', action.payload);
        state.loading = false;
        state.likedUsers.push(action.payload);
      })
      .addCase(likeUser.rejected, (state, action) => {
        console.log('Like action rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(dislikeUser.pending, state => {
        console.log('Dislike action pending...');
        state.loading = true;
        state.error = null;
      })
      .addCase(dislikeUser.fulfilled, (state, action) => {
        console.log('Dislike action fulfilled:', action.payload);
        state.loading = false;
        state.likedUsers = state.likedUsers.filter(
          user => user._id !== action.payload.targetUserId,
        );
      })
      .addCase(dislikeUser.rejected, (state, action) => {
        console.log('Dislike action rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default likingSlice.reducer;
