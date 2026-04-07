import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest, clearStoredSession, getStoredToken, getStoredUser, persistSession } from '../lib/api';

const storedToken = getStoredToken();
const storedUser = getStoredUser();

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, thunkAPI) => {
    try {
        return await apiRequest('/auth/login', {
            method: 'POST',
            token: '',
            body: credentials
        });
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (payload, thunkAPI) => {
    try {
        return await apiRequest('/auth/register', {
            method: 'POST',
            token: '',
            body: payload
        });
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const initialState = {
    users: [],
    isAuthenticated: Boolean(storedToken),
    user: storedUser,
    token: storedToken,
    error: '',
    status: 'idle'
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logoutUser(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.token = '';
            state.error = '';
            state.status = 'idle';
            clearStoredSession();
        },
        loginMock(state, action) {
            state.error = '';
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        registerMock(state, action) {
            state.error = '';
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        logoutMock(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.token = '';
            state.error = '';
        },
        clearAuthError(state) {
            state.error = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = '';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = '';
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
                persistSession(action.payload);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Login failed.';
                state.isAuthenticated = false;
                state.user = null;
                state.token = '';
            })
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.error = '';
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = '';
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
                persistSession(action.payload);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Registration failed.';
                state.isAuthenticated = false;
                state.user = null;
                state.token = '';
            });
    }
});

export const { loginMock, registerMock, logoutMock, logoutUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
