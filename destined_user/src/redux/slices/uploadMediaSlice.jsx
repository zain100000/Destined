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

export const fileUpload = createAsyncThunk(
  'file/uploadMedia',
  async ({mediaImages = [], mediaVideos = []}, {rejectWithValue}) => {
    try {
      console.log('Starting file upload...');
      const formData = new FormData();

      // Add media images to FormData
      mediaImages.forEach((image, index) => {
        console.log(`Appending image ${index}:`, image);
        formData.append('mediaImage', {
          uri: image.uri,
          name: `image_${index}.jpg`, // You might want to extract the actual filename
          type: 'image/jpeg', // You might want to detect the actual type
        });
      });

      // Add media videos to FormData
      mediaVideos.forEach((video, index) => {
        console.log(`Appending video ${index}:`, video);
        formData.append('mediaVideo', {
          uri: video.uri,
          name: video.name || `video_${index}.mp4`,
          type: video.type || 'video/mp4',
        });
      });

      const token = await getToken(rejectWithValue);
      console.log('Token retrieved:', token);

      const response = await axios.post(
        `${BASE_URL}/media/upload-media`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Upload response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Upload error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const uploadMediaSlice = createSlice({
  name: 'file',
  initialState: {
    uploadedFile: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fileUpload.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fileUpload.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadedFile = action.payload;
      })
      .addCase(fileUpload.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default uploadMediaSlice.reducer;
