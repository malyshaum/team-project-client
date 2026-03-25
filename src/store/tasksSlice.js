import { createSlice } from '@reduxjs/toolkit';
import { loginMock, logoutMock, registerMock } from './authSlice';
import { updateProfileGeneral } from './profileSlice';

const makeReward = (value, description) => ({ value, description });

const makeAuthorMeta = (studyProgram = 'General Studies', yearOfStudy = '1') => `${studyProgram} · Year ${yearOfStudy}`;
const makeInitials = (username = 'user') => username.slice(0, 2).toUpperCase();

const createPostDetails = ({
    id,
    type = 'quest',
    title,
    description,
    tags,
    postedTime,
    status = 'Open',
    deadline,
    primaryReward,
    alternativeReward,
    author,
    initials,
    authorMeta,
    aboutMe,
    contactInfo,
    requesterRating,
    providerRating,
    reviews,
    recentPosts = []
}) => ({
    id,
    type,
    title,
    status,
    postedTime: `Posted ${postedTime}`,
    deadline,
    description,
    tags,
    rewards: {
        primary: makeReward(primaryReward, type === 'service' ? 'Main service reward.' : 'Main reward offered for finishing the task.'),
        alternative: makeReward(alternativeReward || 'Optional alternative reward', 'Optional alternative reward offered by the author.')
    },
    author: {
        name: author,
        initials,
        meta: authorMeta,
        aboutMe,
        contactInfo,
        requesterRating,
        providerRating,
        reviews,
        recentPosts
    }
});

const publicQuests = [
    {
        id: 1,
        type: 'quest',
        initials: 'AM',
        color: 'indigo',
        author: 'alexm',
        authorMeta: 'Computer Science · Year 2',
        requesterRating: 4.8,
        providerRating: 4.6,
        reviews: 12,
        title: 'Fix my Java Application',
        description: 'I have a project due tomorrow. The logic works mostly, but it crashes when I input negative values. Need help debugging.',
        tags: ['Coding', 'Homework', 'Urgent'],
        postedTime: '2h ago',
        deadline: 'Tomorrow',
        applicants: 3,
        reward: '5.00€',
        alternativeReward: 'Coffee and handwritten notes',
        status: 'Open'
    },
    {
        id: 2,
        type: 'quest',
        initials: 'LK',
        color: 'amber',
        author: 'lisak',
        authorMeta: 'Mathematics · Year 1',
        requesterRating: 4.5,
        providerRating: 4.4,
        reviews: 7,
        title: 'Need calc notes for midterms',
        description: 'Looking for someone with good Calculus II notes. Happy to pay or trade for my Linear Algebra notes.',
        tags: ['Tutoring'],
        postedTime: '2d ago',
        deadline: 'Dec 15',
        applicants: 1,
        reward: '10.00€',
        alternativeReward: 'Linear Algebra summary sheet',
        status: 'Open'
    },
    {
        id: 3,
        type: 'quest',
        initials: 'EW',
        color: 'blue',
        author: 'emmaw',
        authorMeta: 'Architecture · Year 3',
        requesterRating: 4.9,
        providerRating: 4.8,
        reviews: 15,
        title: 'Move sofa to 3rd floor',
        description: 'I need help carrying a sofa from ground floor to 3rd floor in my dorm. Should take about 30 mins.',
        tags: ['Errands', 'Moving'],
        postedTime: '5h ago',
        deadline: 'This weekend',
        applicants: 2,
        reward: '20.00€',
        alternativeReward: 'Dinner at the campus cafe',
        status: 'Open'
    },
    {
        id: 105,
        type: 'quest',
        initials: 'AM',
        color: 'indigo',
        author: 'alexm',
        authorMeta: 'Computer Science · Year 2',
        requesterRating: 4.8,
        providerRating: 4.6,
        reviews: 12,
        title: 'Need UI feedback for portfolio landing page',
        description: 'Looking for concise frontend feedback on spacing, hierarchy, and CTA clarity.',
        tags: ['Design', 'Coding'],
        postedTime: '3h ago',
        deadline: 'This week',
        applicants: 2,
        reward: '8.00€',
        alternativeReward: 'Code review exchange',
        status: 'Open'
    }
];

const providers = [
    {
        id: 101,
        type: 'service',
        initials: 'AS',
        color: 'indigo',
        name: 'annas',
        authorMeta: 'Software Engineering · Year 3',
        requesterRating: 4.7,
        providerRating: 4.9,
        reviews: 24,
        title: 'Java Programming Help',
        description: 'Stuck on your CS 101 assignment? I can help debug your code or explain object-oriented concepts clearly.',
        tags: ['Coding', 'Tutoring'],
        postedTime: '1d ago',
        reward: '€5.00 / hour',
        alternativeReward: 'Exchange for design feedback'
    },
    {
        id: 102,
        type: 'service',
        initials: 'TB',
        color: 'blue',
        name: 'tomb',
        authorMeta: 'Civil Engineering · Year 4',
        requesterRating: 4.8,
        providerRating: 5,
        reviews: 12,
        title: 'Moving Assistance',
        description: 'I have a van and muscles, I can help you move boxes to your new dorm for 2 hours this weekend.',
        tags: ['Errands', 'Moving'],
        postedTime: '6h ago',
        reward: '1 crate',
        alternativeReward: '€15.00'
    },
    {
        id: 103,
        type: 'service',
        initials: 'SJ',
        color: 'rose',
        name: 'sarahj',
        authorMeta: 'Media Design · Year 2',
        requesterRating: 4.6,
        providerRating: 4.8,
        reviews: 8,
        title: 'Logo & Flyer Design',
        description: 'Need a flyer for your event? I can design modern logos and posters using Adobe Illustrator.',
        tags: ['Design'],
        postedTime: '3d ago',
        reward: '€15.00',
        alternativeReward: 'Photo editing exchange'
    },
    {
        id: 104,
        type: 'service',
        initials: 'AM',
        color: 'indigo',
        name: 'alexm',
        authorMeta: 'Computer Science · Year 2',
        requesterRating: 4.8,
        providerRating: 4.6,
        reviews: 12,
        title: 'Frontend UI Polish Sessions',
        description: 'I review student pages and suggest practical UI cleanups with quick implementation notes.',
        tags: ['Coding', 'Design'],
        postedTime: '3h ago',
        reward: '€12.00 / session',
        alternativeReward: 'Code review exchange'
    }
];

const questsById = {
    1: createPostDetails({
        id: 1,
        type: 'quest',
        title: 'Fix my Java Application',
        description: `I have a project due tomorrow. The logic works mostly, but it crashes specifically when I input negative numbers in the calculation module. I suspect it's an unhandled exception or a logic error in the while-loop.

Need someone to debug my code, explain where I went wrong, and maybe add a comment so I understand for next time.`,
        tags: ['Java', 'Homework', 'Urgent'],
        postedTime: '2h ago',
        status: 'Open',
        deadline: 'Tomorrow',
        primaryReward: '5.00€',
        alternativeReward: 'Coffee and handwritten notes',
        author: 'alexm',
        initials: 'AM',
        authorMeta: 'Computer Science · Year 2',
        aboutMe: 'I usually post coding and study-related quests. I prefer a practical explanation together with the fix.',
        contactInfo: 'Telegram: @alexm, email: alex.martinez@university.edu',
        requesterRating: 4.8,
        providerRating: 4.6,
        reviews: 12,
        recentPosts: [
            { title: 'Need UI feedback for portfolio landing page', timeAgo: 'Posted 3h ago' },
            { title: 'Frontend UI Polish Sessions', timeAgo: 'Posted 3h ago' }
        ]
    }),
    2: createPostDetails({
        id: 2,
        type: 'quest',
        title: 'Need calc notes for midterms',
        description: 'Looking for someone with clear Calculus II notes before midterms. PDF or paper notes both work.',
        tags: ['Tutoring'],
        postedTime: '2d ago',
        status: 'Open',
        deadline: 'Dec 15',
        primaryReward: '10.00€',
        alternativeReward: 'Linear Algebra summary sheet',
        author: 'lisak',
        initials: 'LK',
        authorMeta: 'Mathematics · Year 1',
        aboutMe: 'I usually swap notes and summaries with other first-year students.',
        contactInfo: 'Instagram: @lisak.notes',
        requesterRating: 4.5,
        providerRating: 4.4,
        reviews: 7
    }),
    3: createPostDetails({
        id: 3,
        type: 'quest',
        title: 'Move sofa to 3rd floor',
        description: 'Need one strong person for 30 minutes this weekend. The building has no elevator.',
        tags: ['Errands', 'Moving'],
        postedTime: '5h ago',
        status: 'Open',
        deadline: 'This weekend',
        primaryReward: '20.00€',
        alternativeReward: 'Dinner at the campus cafe',
        author: 'emmaw',
        initials: 'EW',
        authorMeta: 'Architecture · Year 3',
        aboutMe: 'I am moving rooms this week, so this is a one-off help request.',
        contactInfo: 'WhatsApp: +49 170 000 0000',
        requesterRating: 4.9,
        providerRating: 4.8,
        reviews: 15
    }),
    101: createPostDetails({
        id: 101,
        type: 'service',
        title: 'Java Programming Help',
        description: 'I can help debug assignments, explain OOP basics, and review small Java projects.',
        tags: ['Coding', 'Tutoring'],
        postedTime: '1d ago',
        status: 'Open',
        deadline: 'Flexible',
        primaryReward: '€5.00 / hour',
        alternativeReward: 'Exchange for design feedback',
        author: 'annas',
        initials: 'AS',
        authorMeta: 'Software Engineering · Year 3',
        aboutMe: 'I enjoy teaching and can explain bugs step by step instead of just fixing them.',
        contactInfo: 'Telegram: @annas_code',
        requesterRating: 4.7,
        providerRating: 4.9,
        reviews: 24
    }),
    102: createPostDetails({
        id: 102,
        type: 'service',
        title: 'Moving Assistance',
        description: 'I can help move boxes, shelves, and small furniture on weekends.',
        tags: ['Errands', 'Moving'],
        postedTime: '6h ago',
        status: 'Open',
        deadline: 'Flexible',
        primaryReward: '1 crate',
        alternativeReward: '€15.00',
        author: 'tomb',
        initials: 'TB',
        authorMeta: 'Civil Engineering · Year 4',
        aboutMe: 'I help with small moving tasks around campus and dorms.',
        contactInfo: 'Phone: +49 151 555 7788',
        requesterRating: 4.8,
        providerRating: 5,
        reviews: 12
    }),
    103: createPostDetails({
        id: 103,
        type: 'service',
        title: 'Logo & Flyer Design',
        description: 'I create quick event posters and clean logo drafts for student projects.',
        tags: ['Design'],
        postedTime: '3d ago',
        status: 'Open',
        deadline: 'Flexible',
        primaryReward: '€15.00',
        alternativeReward: 'Photo editing exchange',
        author: 'sarahj',
        initials: 'SJ',
        authorMeta: 'Media Design · Year 2',
        aboutMe: 'Design-focused, fast turnaround for simple promo materials.',
        contactInfo: 'Email: sarahj.design@university.edu',
        requesterRating: 4.6,
        providerRating: 4.8,
        reviews: 8
    }),
    104: createPostDetails({
        id: 104,
        type: 'service',
        title: 'Frontend UI Polish Sessions',
        description: 'I review student pages and suggest practical UI cleanups with quick implementation notes.',
        tags: ['Coding', 'Design'],
        postedTime: '3h ago',
        status: 'Open',
        deadline: 'Flexible',
        primaryReward: '€12.00 / session',
        alternativeReward: 'Code review exchange',
        author: 'alexm',
        initials: 'AM',
        authorMeta: 'Computer Science · Year 2',
        aboutMe: 'I focus on frontend cleanup, UX wording, and shipping practical changes fast.',
        contactInfo: 'Telegram: @alexm, email: alex.martinez@university.edu',
        requesterRating: 4.8,
        providerRating: 4.6,
        reviews: 12
    }),
    105: createPostDetails({
        id: 105,
        type: 'quest',
        title: 'Need UI feedback for portfolio landing page',
        description: 'Looking for concise frontend feedback on spacing, hierarchy, and CTA clarity.',
        tags: ['Design', 'Coding'],
        postedTime: '3h ago',
        status: 'Open',
        deadline: 'This week',
        primaryReward: '8.00€',
        alternativeReward: 'Code review exchange',
        author: 'alexm',
        initials: 'AM',
        authorMeta: 'Computer Science · Year 2',
        aboutMe: 'I focus on frontend cleanup, UX wording, and shipping practical changes fast.',
        contactInfo: 'Telegram: @alexm, email: alex.martinez@university.edu',
        requesterRating: 4.8,
        providerRating: 4.6,
        reviews: 12
    })
};

const createDashboard = () => ({
    myRequests: [],
    activeTasks: {
        accepted: [],
        requested: []
    }
});

const alexDashboard = {
    myRequests: [
        {
            id: 1,
            type: 'quest',
            title: 'Fix my Java Application',
            status: 'Open',
            postedDate: '2h ago',
            dueDate: 'Tomorrow',
            applicants: 3,
            price: '5.00€',
            alternativeReward: 'Coffee and notes',
            tags: ['Coding', 'Homework']
        },
        {
            id: 104,
            type: 'service',
            title: 'Frontend UI Polish Sessions',
            status: 'Open',
            postedDate: '3h ago',
            dueDate: 'Flexible',
            applicants: 2,
            price: '€12.00 / session',
            alternativeReward: 'Code review exchange',
            tags: ['Coding', 'Design']
        },
        {
            id: 105,
            type: 'quest',
            title: 'Need UI feedback for portfolio landing page',
            status: 'In Progress',
            postedDate: '3h ago',
            dueDate: 'This week',
            applicants: 2,
            price: '8.00€',
            alternativeReward: 'Code review exchange',
            tags: ['Design', 'Coding'],
            performer: 'kirar'
        }
    ],
    activeTasks: {
        accepted: [
            {
                id: 201,
                initials: 'MT',
                title: 'Debug React useEffect hook',
                subtitle: 'For miket',
                rating: 4.6,
                status: 'In Progress',
                amount: '15.00€',
                dateLine: 'Started 2 days ago'
            }
        ],
        requested: [
            {
                id: 202,
                initials: 'KR',
                title: 'Need UI feedback for portfolio landing page',
                subtitle: 'Performer kirar',
                rating: 4.9,
                status: 'In Progress',
                amount: '8.00€',
                dateLine: 'Started today'
            }
        ]
    }
};

const applicantsByRequestId = {
    1: [
        {
            id: 1,
            initials: 'SJ',
            name: 'sarahj',
            major: 'Computer Science · Year 2',
            rating: 4.8,
            reviews: 8,
            aboutMe: 'I like debugging messy homework tasks and writing clear explanations after fixing them.',
            contactInfo: 'Telegram: @sarahj',
            message: 'I have strong Java skills and experience with debugging complex logic. I can fix this tonight and walk you through the solution.',
            time: '30m ago'
        },
        {
            id: 2,
            initials: 'MR',
            name: 'miker',
            major: 'Software Engineering · Year 4',
            rating: 5,
            reviews: 32,
            aboutMe: 'Mostly focused on backend and debugging. Fast response in the evenings.',
            contactInfo: 'Email: mike.r@university.edu',
            message: 'Java is my specialty. I can debug your while-loop issue and help you understand exception handling patterns.',
            time: '1h ago'
        }
    ],
    105: [
        {
            id: 3,
            initials: 'KR',
            name: 'kirar',
            major: 'Design Informatics · Year 3',
            rating: 4.9,
            reviews: 10,
            aboutMe: 'I usually review landing pages and simplify visual hierarchy.',
            contactInfo: 'Telegram: @kirar_ui',
            message: 'I can review the hero block, CTA flow, and spacing issues today.',
            time: '20m ago'
        }
    ]
};

const initialState = {
    currentUserEmail: '',
    publicQuests,
    providers,
    myRequests: alexDashboard.myRequests,
    activeTasks: alexDashboard.activeTasks,
    dashboardsByEmail: {
        'alex.martinez@university.edu': alexDashboard
    },
    ownedPostIdsByEmail: {
        'alex.martinez@university.edu': [1, 104, 105]
    },
    applicantsByRequestId,
    questsById,
    selectedRewardByQuestId: {
        1: 'primary'
    }
};

const getDashboard = (state, email) => state.dashboardsByEmail[email] || createDashboard();

const setCurrentDashboard = (state, email) => {
    const dashboard = getDashboard(state, email);
    state.dashboardsByEmail[email] = dashboard;
    state.currentUserEmail = email;
    state.myRequests = dashboard.myRequests;
    state.activeTasks = dashboard.activeTasks;
};

const syncDashboard = (state) => {
    if (!state.currentUserEmail) return;
    state.dashboardsByEmail[state.currentUserEmail] = {
        myRequests: state.myRequests,
        activeTasks: state.activeTasks
    };
};

const updateBoardCard = (item, profile) => {
    if (!item) return;
    const authorMeta = makeAuthorMeta(profile.studyProgram, profile.yearOfStudy);
    if ('author' in item) {
        item.author = profile.username;
        item.authorMeta = authorMeta;
    }
    if ('name' in item) {
        item.name = profile.username;
        item.authorMeta = authorMeta;
    }
    item.initials = makeInitials(profile.username);
};

const updateDetailAuthor = (detail, profile) => {
    if (!detail) return;
    detail.author.name = profile.username;
    detail.author.initials = makeInitials(profile.username);
    detail.author.meta = makeAuthorMeta(profile.studyProgram, profile.yearOfStudy);
    detail.author.aboutMe = profile.bio;
    detail.author.contactInfo = profile.contactInfo;
};

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setSelectedReward(state, action) {
            const { questId, rewardType } = action.payload;
            state.selectedRewardByQuestId[questId] = rewardType;
        },
        claimQuest(state, action) {
            const { questId } = action.payload;
            const quest = state.questsById[questId];
            if (!quest) return;
            const exists = state.activeTasks.accepted.some((task) => task.title === quest.title);
            if (!exists) {
                state.activeTasks.accepted.unshift({
                    id: Date.now(),
                    initials: quest.author.initials,
                    title: quest.title,
                    subtitle: `For ${quest.author.name}`,
                    rating: quest.author.requesterRating,
                    status: 'In Progress',
                    amount: quest.rewards.primary.value,
                    dateLine: 'Started today'
                });
                syncDashboard(state);
            }
        },
        choosePerformer(state, action) {
            const { requestId, applicantId } = action.payload;
            const applicants = state.applicantsByRequestId[requestId] || [];
            const applicant = applicants.find((item) => item.id === applicantId);
            const request = state.myRequests.find((item) => item.id === requestId);
            if (!applicant || !request) return;
            request.performer = applicant.name;
            request.status = 'In Progress';
            request.applicants = Math.max(1, request.applicants || 1);
            if (!state.activeTasks.requested.some((task) => task.title === request.title)) {
                state.activeTasks.requested.unshift({
                    id: Date.now(),
                    initials: applicant.initials,
                    title: request.title,
                    subtitle: `Performer ${applicant.name}`,
                    rating: applicant.rating,
                    status: 'In Progress',
                    amount: request.price,
                    dateLine: 'Started today'
                });
            }
            syncDashboard(state);
        },
        setRequestStatus(state, action) {
            const { requestId, status } = action.payload;
            const request = state.myRequests.find((item) => item.id === requestId);
            if (request) {
                request.status = status;
                const detailed = state.questsById[requestId];
                if (detailed) detailed.status = status;
                syncDashboard(state);
            }
        },
        deleteRequest(state, action) {
            const { requestId } = action.payload;
            const request = state.myRequests.find((item) => item.id === requestId);
            if (!request) return;
            state.myRequests = state.myRequests.filter((item) => item.id !== requestId);
            state.activeTasks.requested = state.activeTasks.requested.filter((item) => item.title !== request.title);

            if (request.type === 'service') {
                state.providers = state.providers.filter((item) => item.id !== requestId);
            } else {
                state.publicQuests = state.publicQuests.filter((item) => item.id !== requestId);
            }

            if (state.currentUserEmail) {
                state.ownedPostIdsByEmail[state.currentUserEmail] = (state.ownedPostIdsByEmail[state.currentUserEmail] || []).filter((id) => id !== requestId);
            }

            delete state.questsById[requestId];
            delete state.selectedRewardByQuestId[requestId];
            delete state.applicantsByRequestId[requestId];
            syncDashboard(state);
        },
        addQuest(state, action) {
            const { title, description, dueDate, reward, alternativeReward, tags, username, studyProgram, yearOfStudy, aboutMe, contactInfo } = action.payload;
            const nextId = Date.now();
            const initials = makeInitials(username);
            const authorMeta = makeAuthorMeta(studyProgram, yearOfStudy);

            state.publicQuests.unshift({
                id: nextId,
                type: 'quest',
                initials,
                color: 'indigo',
                author: username,
                authorMeta,
                requesterRating: 5,
                providerRating: 5,
                reviews: 0,
                title,
                description,
                tags,
                postedTime: 'just now',
                deadline: dueDate || 'Flexible',
                applicants: 0,
                reward,
                alternativeReward,
                status: 'Open'
            });

            state.myRequests.unshift({
                id: nextId,
                type: 'quest',
                title,
                status: 'Open',
                postedDate: 'just now',
                dueDate: dueDate || 'Flexible',
                applicants: 0,
                price: reward,
                alternativeReward,
                tags
            });

            state.questsById[nextId] = createPostDetails({
                id: nextId,
                type: 'quest',
                title,
                description,
                tags: tags.length ? tags : ['General'],
                postedTime: 'just now',
                status: 'Open',
                deadline: dueDate || 'Flexible',
                primaryReward: reward || '0.00€',
                alternativeReward: alternativeReward || 'Optional reward',
                author: username,
                initials,
                authorMeta,
                aboutMe,
                contactInfo,
                requesterRating: 5,
                providerRating: 5,
                reviews: 0,
                recentPosts: [{ title, timeAgo: 'Posted just now' }]
            });

            state.selectedRewardByQuestId[nextId] = 'primary';
            state.applicantsByRequestId[nextId] = [];
            if (state.currentUserEmail) {
                state.ownedPostIdsByEmail[state.currentUserEmail] = [...(state.ownedPostIdsByEmail[state.currentUserEmail] || []), nextId];
            }
            syncDashboard(state);
        },
        addService(state, action) {
            const { title, description, reward, alternativeReward, tags, username, studyProgram, yearOfStudy, aboutMe, contactInfo } = action.payload;
            const nextId = Date.now();
            const initials = makeInitials(username);
            const authorMeta = makeAuthorMeta(studyProgram, yearOfStudy);

            state.providers.unshift({
                id: nextId,
                type: 'service',
                initials,
                color: 'indigo',
                name: username,
                authorMeta,
                requesterRating: 5,
                providerRating: 5,
                reviews: 0,
                title,
                description,
                tags,
                postedTime: 'just now',
                reward,
                alternativeReward
            });

            state.myRequests.unshift({
                id: nextId,
                type: 'service',
                title,
                status: 'Open',
                postedDate: 'just now',
                dueDate: 'Flexible',
                applicants: 0,
                price: reward,
                alternativeReward,
                tags
            });

            state.questsById[nextId] = createPostDetails({
                id: nextId,
                type: 'service',
                title,
                description,
                tags: tags.length ? tags : ['General'],
                postedTime: 'just now',
                status: 'Open',
                deadline: 'Flexible',
                primaryReward: reward || '0.00€',
                alternativeReward: alternativeReward || 'Optional reward',
                author: username,
                initials,
                authorMeta,
                aboutMe,
                contactInfo,
                requesterRating: 5,
                providerRating: 5,
                reviews: 0,
                recentPosts: [{ title, timeAgo: 'Posted just now' }]
            });

            state.selectedRewardByQuestId[nextId] = 'primary';
            state.applicantsByRequestId[nextId] = [];
            if (state.currentUserEmail) {
                state.ownedPostIdsByEmail[state.currentUserEmail] = [...(state.ownedPostIdsByEmail[state.currentUserEmail] || []), nextId];
            }
            syncDashboard(state);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginMock, (state, action) => {
                if (!action.payload.username) return;
                setCurrentDashboard(state, action.payload.email);
            })
            .addCase(registerMock, (state, action) => {
                const email = action.payload.email;
                if (state.dashboardsByEmail[email]) return;
                state.dashboardsByEmail[email] = createDashboard();
                state.ownedPostIdsByEmail[email] = [];
                setCurrentDashboard(state, email);
            })
            .addCase(logoutMock, (state) => {
                state.currentUserEmail = '';
                state.myRequests = [];
                state.activeTasks = createDashboard().activeTasks;
            })
            .addCase(updateProfileGeneral, (state, action) => {
                if (!state.currentUserEmail) return;
                const profile = action.payload;
                const ownedIds = state.ownedPostIdsByEmail[state.currentUserEmail] || [];
                ownedIds.forEach((id) => {
                    const detail = state.questsById[id];
                    updateDetailAuthor(detail, profile);
                    if (detail?.type === 'service') {
                        updateBoardCard(state.providers.find((item) => item.id === id), profile);
                    } else {
                        updateBoardCard(state.publicQuests.find((item) => item.id === id), profile);
                    }
                });
            });
    }
});

export const {
    setSelectedReward,
    claimQuest,
    choosePerformer,
    setRequestStatus,
    deleteRequest,
    addQuest,
    addService
} = tasksSlice.actions;

export default tasksSlice.reducer;
