import { createSlice } from '@reduxjs/toolkit';
import { loginMock, logoutMock, registerMock } from './authSlice';

const createProfile = ({
    username = 'student',
    email = '',
    university = 'Technical University',
    studyProgram = 'General Studies',
    yearOfStudy = '1',
    contactInfo = '',
    bio = 'New on QuestBoard.',
    joined = 'Joined recently'
} = {}) => ({
    general: {
        username,
        email,
        university,
        studyProgram,
        yearOfStudy,
        contactInfo,
        bio,
        joined
    },
    stats: {
        requesterRating: 5,
        providerRating: 5,
        completedTasks: 0,
        completedAsRequester: 0,
        completedAsProvider: 0,
        reputation: [
            { label: 'Completed as requester', value: '0' },
            { label: 'Completed as provider', value: '0' },
            { label: 'Open posts', value: '0' },
            { label: 'In progress', value: '0' },
            { label: 'Total earned', value: '€0', valueClass: 'text-brand-secondary' }
        ],
        badges: ['New Member']
    },
    activity: [],
    reviews: []
});

const alexProfile = {
    general: {
        username: 'alexm',
        email: 'alex.martinez@university.edu',
        university: 'Technical University',
        studyProgram: 'Computer Science',
        yearOfStudy: '2',
        contactInfo: 'Telegram: @alexm, email: alex.martinez@university.edu',
        bio: 'Passionate about coding, open to quick study exchanges, and usually available in the evening for task follow-up.',
        joined: 'Joined September 2024'
    },
    stats: {
        requesterRating: 4.8,
        providerRating: 4.6,
        completedTasks: 12,
        completedAsRequester: 7,
        completedAsProvider: 5,
        reputation: [
            { label: 'Completed as requester', value: '7' },
            { label: 'Completed as provider', value: '5' },
            { label: 'Open posts', value: '3' },
            { label: 'In progress', value: '2' },
            { label: 'Total earned', value: '€185', valueClass: 'text-brand-secondary' }
        ],
        badges: ['Quick Responder', 'Top Helper', 'Verified Student']
    },
    activity: [
        { title: 'Debug React useEffect hook', details: 'For miket · 2 days ago', status: 'Completed', price: '€15' },
        { title: 'Move sofa to 3rd floor', details: 'For emmaw · 1 week ago', status: 'Completed', price: '€20' },
        { title: 'Fix Java Application', details: 'For alexm · Started today', status: 'In Progress', price: '€5' },
        { title: 'Java Programming Help', details: 'Client annas · 1 day ago', status: 'In Progress', price: '€5' }
    ],
    reviews: [
        { initials: 'MT', name: 'miket', time: '2 days ago', text: 'Super helpful. Fixed my React bug fast and explained the root cause clearly.', rating: 5, role: 'Provider', color: 'bg-blue-500' },
        { initials: 'EW', name: 'emmaw', time: '1 week ago', text: 'Reliable and easy to coordinate with. Payment and communication were smooth.', rating: 5, role: 'Requester', color: 'bg-green-500' },
        { initials: 'SJ', name: 'sarahj', time: '2 weeks ago', text: 'Good explanation of calculus concepts. Would recommend for homework help.', rating: 4, role: 'Provider', color: 'bg-amber-500' }
    ]
};

const initialState = {
    currentUserEmail: '',
    general: alexProfile.general,
    stats: alexProfile.stats,
    activity: alexProfile.activity,
    reviews: alexProfile.reviews,
    profilesByEmail: {
        'alex.martinez@university.edu': alexProfile
    }
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        updateProfileGeneral(state, action) {
            const payload = action.payload;
            const email = payload.email || state.currentUserEmail || state.general.email;
            const existingProfile = state.profilesByEmail[email] || createProfile({ email });
            const nextProfile = {
                ...existingProfile,
                general: {
                    ...existingProfile.general,
                    ...payload
                }
            };

            if (payload.previousEmail && payload.previousEmail !== email) {
                delete state.profilesByEmail[payload.previousEmail];
            }

            state.profilesByEmail[email] = nextProfile;
            state.currentUserEmail = email;
            state.general = nextProfile.general;
            state.stats = nextProfile.stats;
            state.activity = nextProfile.activity;
            state.reviews = nextProfile.reviews;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginMock, (state, action) => {
                if (!action.payload.username) return;
                const { email, username, studyProgram, yearOfStudy } = action.payload;
                const profile = state.profilesByEmail[email] || createProfile({
                    username,
                    email,
                    studyProgram,
                    yearOfStudy,
                    contactInfo: `Email: ${email}`,
                    bio: 'New on QuestBoard.',
                    joined: 'Joined recently'
                });
                state.profilesByEmail[email] = profile;
                state.currentUserEmail = email;
                state.general = profile.general;
                state.stats = profile.stats;
                state.activity = profile.activity;
                state.reviews = profile.reviews;
            })
            .addCase(registerMock, (state, action) => {
                const { username, email, studyProgram, yearOfStudy } = action.payload;
                if (state.profilesByEmail[email]) return;
                const profile = createProfile({
                    username,
                    email,
                    studyProgram,
                    yearOfStudy,
                    contactInfo: `Email: ${email}`,
                    bio: 'Tell others what kind of quests or services you usually post.',
                    joined: 'Joined today'
                });
                state.profilesByEmail[email] = profile;
                state.currentUserEmail = email;
                state.general = profile.general;
                state.stats = profile.stats;
                state.activity = profile.activity;
                state.reviews = profile.reviews;
            })
            .addCase(logoutMock, (state) => {
                state.currentUserEmail = '';
                state.general = createProfile().general;
                state.stats = createProfile().stats;
                state.activity = [];
                state.reviews = [];
            });
    }
});

export const { updateProfileGeneral } = profileSlice.actions;
export default profileSlice.reducer;
