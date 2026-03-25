import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    toasts: []
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        showToast(state, action) {
            const { title, variant = 'info' } = action.payload;
            state.toasts.push({
                id: Date.now() + Math.random(),
                title,
                variant
            });
        },
        dismissToast(state, action) {
            const { id } = action.payload;
            state.toasts = state.toasts.filter((toast) => toast.id !== id);
        }
    }
});

export const { showToast, dismissToast } = uiSlice.actions;
export default uiSlice.reducer;
