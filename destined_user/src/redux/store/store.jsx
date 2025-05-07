import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from 'redux';
import authReducer from '../slices/authSlice';
import userReducer from '../slices/userSlice';
import likingReducer from '../slices/likingSlice';
import profileMatchReducer from '../slices/profileMatchSlice';
import interestReducer from '../slices/interestSlice';
import uploadMediaReducer from '../slices/uploadMediaSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'favorite'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  liking: likingReducer,
  profileMatch: profileMatchReducer,
  interest: interestReducer,
  uploadMedia: uploadMediaReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable state warnings
    }),
});

const persistor = persistStore(store);

export {store, persistor};
