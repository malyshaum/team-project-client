import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profileSlice';
import tasksReducer from './tasksSlice';
import authReducer from './authSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        tasks: tasksReducer,
        ui: uiReducer
    }
});
