import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '../lib/api';
import { mapMeResponseToProfile } from '../lib/adapters';
import { loginMock, loginUser, logoutMock, logoutUser, registerMock, registerUser } from './authSlice';

const createEmptyProfile = () => ({
    general: {
        id: null,
        username: 'student',
        email: '',
        university: 'University not specified',
        studyProgram: 'General Studies',
        yearOfStudy: '',
        contactInfo: '',
        bio: 'No bio yet.',
        joined: 'Joined recently'
    },
    stats: {
        requesterRating: '0.0',
        providerRating: '0.0',
        completedTasks: 0,
        completedAsRequester: 0,
        completedAsProvider: 0,
        reputation: [
            { label: 'Completed as requester', value: '0' },
            { label: 'Completed as provider', value: '0' },
            { label: 'Open posts', value: '0' },
            { label: 'In progress', value: '0' },
            { label: 'Total earned', value: '0€', valueClass: 'text-brand-secondary' }
        ],
        badges: ['QuestBoard Member']
    },
    activity: [],
    reviews: []
});

export const fetchMyProfile = createAsyncThunk('profile/fetchMyProfile', async (_, thunkAPI) => {
    try {
        const [me, reviews, activeTasks] = await Promise.all([
            apiRequest('/me'),
            apiRequest('/me/reviews'),
            apiRequest('/me/active-tasks')
        ]);
        return mapMeResponseToProfile(me, reviews, activeTasks);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const updateMyProfile = createAsyncThunk('profile/updateMyProfile', async (payload, thunkAPI) => {
    try {
        const state = thunkAPI.getState();
        const current = state.profile.general;
        const body = {};

        if (payload.username !== current.username) {
            body.username = payload.username;
        }
        if (payload.email !== current.email) {
            body.email = payload.email;
        }
        if (payload.university !== current.university) {
            body.university = payload.university;
        }
        if (payload.studyProgram !== current.studyProgram) {
            body.studyProgram = payload.studyProgram;
        }
        if (String(payload.yearOfStudy ?? '') !== String(current.yearOfStudy ?? '')) {
            body.yearOfStudy = Number(payload.yearOfStudy);
        }
        if ((payload.contactInfo || '') !== (current.contactInfo || '')) {
            body.contactInfo = payload.contactInfo;
        }
        if ((payload.bio || '') !== (current.bio || '')) {
            body.aboutMe = payload.bio;
        }

        if (Object.keys(body).length === 0) {
            return await thunkAPI.dispatch(fetchMyProfile()).unwrap();
        }

        await apiRequest('/me', {
            method: 'PATCH',
            body
        });

        return await thunkAPI.dispatch(fetchMyProfile()).unwrap();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const initialProfile = createEmptyProfile();
const initialState = {
    currentUserEmail: '',
    general: initialProfile.general,
    stats: initialProfile.stats,
    activity: initialProfile.activity,
    reviews: initialProfile.reviews,
    status: 'idle',
    error: ''
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        updateProfileGeneral(state, action) {
            state.general = {
                ...state.general,
                ...action.payload
            };
            state.currentUserEmail = action.payload.email || state.currentUserEmail;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyProfile.pending, (state) => {
                state.status = 'loading';
                state.error = '';
            })
            .addCase(fetchMyProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = '';
                state.general = action.payload.general;
                state.stats = action.payload.stats;
                state.activity = action.payload.activity;
                state.reviews = action.payload.reviews;
                state.currentUserEmail = action.payload.general.email;
            })
            .addCase(fetchMyProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to load profile.';
            })
            .addCase(updateMyProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = '';
                state.general = action.payload.general;
                state.stats = action.payload.stats;
                state.activity = action.payload.activity;
                state.reviews = action.payload.reviews;
                state.currentUserEmail = action.payload.general.email;
            })
            .addCase(loginMock, (state, action) => {
                state.currentUserEmail = action.payload.email || state.currentUserEmail;
            })
            .addCase(registerMock, (state, action) => {
                state.currentUserEmail = action.payload.email || state.currentUserEmail;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.currentUserEmail = action.payload.user?.email || state.currentUserEmail;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.currentUserEmail = action.payload.user?.email || state.currentUserEmail;
            })
            .addCase(logoutMock, (state) => {
                const empty = createEmptyProfile();
                state.currentUserEmail = '';
                state.general = empty.general;
                state.stats = empty.stats;
                state.activity = empty.activity;
                state.reviews = empty.reviews;
            })
            .addCase(logoutUser, (state) => {
                const empty = createEmptyProfile();
                state.currentUserEmail = '';
                state.general = empty.general;
                state.stats = empty.stats;
                state.activity = empty.activity;
                state.reviews = empty.reviews;
            });
    }
});

export const { updateProfileGeneral } = profileSlice.actions;
export default profileSlice.reducer;
