import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Auth/AuthSlice';
import modeldataReducer from './Modeldata/ModeldataSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    modeldata: modeldataReducer,   // add modeldata reducer here
  },
  preloadedState: {
    auth: {
      user: JSON.parse(localStorage.getItem('user')) || null,
      loading: false,
      error: null,
    },
  },
});
