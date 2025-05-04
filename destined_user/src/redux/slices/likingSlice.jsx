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
  async ({userId, targetUserId}, {rejectWithValue, dispatch}) => {
    try {
      console.log('Attempting to like user:', targetUserId);
      const token = await getToken(rejectWithValue);

      dispatch(likingSlice.actions.optimisticLike(targetUserId));

      console.log('Making API call to like user...');

      const response = await axios.post(
        `${BASE_URL}/liking/${userId}/like-user`,
        {targetUserId, action: 'LIKE'},
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
      dispatch(likingSlice.actions.revertLike(targetUserId));
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const dislikeUser = createAsyncThunk(
  'liking/dislikeUser',
  async ({userId, targetUserId}, {rejectWithValue, dispatch}) => {
    try {
      console.log('Attempting to dislike user:', targetUserId);
      const token = await getToken(rejectWithValue);

      // Optimistically update the UI by removing the like
      dispatch(likingSlice.actions.optimisticDislike(targetUserId));

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

      // Revert the UI if the API call fails
      dispatch(likingSlice.actions.revertDislike(targetUserId));
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const getLikedUsers = createAsyncThunk(
  'liking/getLikedUsers',
  async (_, {rejectWithValue}) => {
    try {
      const token = await getToken(rejectWithValue);
      const response = await axios.get(`${BASE_URL}/liking/get-all-likings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.likings;
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
  reducers: {
    optimisticLike: (state, action) => {
      const targetUserId = action.payload;
      if (!state.likedUsers.some(u => u.targetUserId === targetUserId)) {
        state.likedUsers.push({
          targetUserId,
          _id: `temp-${Date.now()}`,
        });
      }
    },
    revertLike: (state, action) => {
      const targetUserId = action.payload;
      state.likedUsers = state.likedUsers.filter(
        u => u.targetUserId !== targetUserId,
      );
    },

    optimisticDislike: (state, action) => {
      const targetUserId = action.payload;
      state.likedUsers = state.likedUsers.filter(
        u => u.targetUserId !== targetUserId,
      );
    },
    revertDislike: (state, action) => {
      const targetUserId = action.payload;
      // Re-add the like if the API call failed
      if (!state.likedUsers.some(u => u.targetUserId === targetUserId)) {
        state.likedUsers.push({
          targetUserId,
          _id: `temp-${Date.now()}`, // Temporary ID
        });
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(likeUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(likeUser.fulfilled, (state, action) => {
        const targetUserId =
          action.payload.targetUserId?._id || action.payload.targetUserId;
        if (
          targetUserId &&
          !state.likedUsers.some(u => u.targetUserId === targetUserId)
        ) {
          state.likedUsers.push({
            targetUserId,
            _id: action.payload._id,
          });
        }
        state.loading = false;
      })
      .addCase(likeUser.rejected, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(dislikeUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(dislikeUser.fulfilled, (state, action) => {
        const targetUserId =
          action.payload.targetUserId?._id || action.payload.targetUserId;
        if (
          targetUserId &&
          !state.dislikeUser.some(u => u.targetUserId === targetUserId)
        ) {
          state.dislikeUser.push({
            targetUserId,
            _id: action.payload._id,
          });
        }
        state.loading = false;
      })
      .addCase(dislikeUser.rejected, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getLikedUsers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLikedUsers.fulfilled, (state, action) => {
        const normalizedLikes = action.payload.map(like => ({
          _id: like._id,
          targetUserId:
            typeof like.targetUserId === 'object'
              ? like.targetUserId._id
              : like.targetUserId,
        }));
        state.likedUsers = normalizedLikes;
        state.loading = false;
      })
      .addCase(getLikedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default likingSlice.reducer;
