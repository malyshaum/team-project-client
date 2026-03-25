import { createSlice } from '@reduxjs/toolkit';

const initialUsers = [
    {
        id: 1,
        username: 'alexm',
        email: 'alex.martinez@university.edu',
        password: 'password123!',
        studyProgram: 'Computer Science',
        yearOfStudy: '2'
    }
];

const initialState = {
    users: initialUsers,
    isAuthenticated: false,
    user: null,
    error: ''
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginMock(state, action) {
            const { email, password } = action.payload;
            const user = state.users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
            if (!user) {
                state.error = 'Invalid email or password.';
                state.isAuthenticated = false;
                state.user = null;
                return;
            }
            state.error = '';
            state.isAuthenticated = true;
            state.user = { ...user, password: undefined };
        },
        registerMock(state, action) {
            const { username, email, password, studyProgram, yearOfStudy } = action.payload;
            const exists = state.users.some((item) => item.email.toLowerCase() === email.toLowerCase());
            if (exists) {
                state.error = 'User with this email already exists.';
                state.isAuthenticated = false;
                state.user = null;
                return;
            }

            const newUser = {
                id: Date.now(),
                username: username.trim() || 'student',
                email,
                password,
                studyProgram,
                yearOfStudy
            };

            state.users.push(newUser);
            state.error = '';
            state.isAuthenticated = true;
            state.user = { ...newUser, password: undefined };
        },
        logoutMock(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.error = '';
        },
        clearAuthError(state) {
            state.error = '';
        }
    }
});

export const { loginMock, registerMock, logoutMock, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
