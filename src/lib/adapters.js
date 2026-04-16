const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

const FALLBACK_COLOR = 'indigo';

const getInitials = (value = 'user') =>
    value
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase() || 'US';

const formatYear = (value) => (value ? `Year ${value}` : 'Year n/a');

const formatAuthorMeta = (studyProgram, yearOfStudy) =>
    [studyProgram || 'General Studies', formatYear(yearOfStudy)].filter(Boolean).join(' · ');

const formatCurrencyLike = (value) => value || 'Not specified';

const normalizeStatus = (value, fallback = 'Open') => {
    if (!value) {
        return fallback;
    }

    const normalized = String(value).trim().toLowerCase();
    const statusMap = {
        active: 'Open',
        open: 'Open',
        in_progress: 'In Progress',
        'in progress': 'In Progress',
        completed: 'Completed',
        archived: 'Cancelled',
        cancelled: 'Cancelled',
        canceled: 'Cancelled'
    };

    return statusMap[normalized] || value;
};

const hasExplicitTime = (iso) => {
    if (!iso || typeof iso !== 'string') {
        return false;
    }

    return /T\d{2}:\d{2}/.test(iso);
};

export const formatDateTimeLabel = (iso, prefix = '') => {
    if (!iso) {
        return 'Flexible';
    }

    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
        return iso;
    }

    const options = hasExplicitTime(iso)
        ? {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
        : {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        };

    return `${prefix}${date.toLocaleString('en-GB', options)}`.trim();
};

export const formatDateTimeLocalValue = (iso) => {
    if (!iso) {
        return '';
    }

    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
};

const formatDateLabel = (iso, prefix = '') => formatDateTimeLabel(iso, prefix);

const formatRelative = (iso, fallback = 'just now') => {
    if (!iso) {
        return fallback;
    }

    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
        return fallback;
    }

    const diffMs = date.getTime() - Date.now();
    const diffMinutes = Math.round(diffMs / 60000);

    if (Math.abs(diffMinutes) < 60) {
        return relativeFormatter.format(diffMinutes, 'minute');
    }

    const diffHours = Math.round(diffMinutes / 60);
    if (Math.abs(diffHours) < 24) {
        return relativeFormatter.format(diffHours, 'hour');
    }

    const diffDays = Math.round(diffHours / 24);
    return relativeFormatter.format(diffDays, 'day');
};

export const mapPostListItemToCard = (post) => {
    const authorName = post.author?.username || 'student';
    const status = normalizeStatus(post.status);
    const deadline = formatDateLabel(post.deadline, 'Due ');
    const isOverdue = Boolean(post.deadline && new Date(post.deadline).getTime() < Date.now() && status === 'Open');
    return {
        id: post.id,
        type: post.type,
        initials: getInitials(authorName),
        color: FALLBACK_COLOR,
        author: authorName,
        name: authorName,
        authorMeta: formatAuthorMeta(post.author?.studyProgram, post.author?.yearOfStudy),
        requesterRating: Number(post.ratings?.asRequester || 0).toFixed(1),
        providerRating: Number(post.ratings?.asProvider || 0).toFixed(1),
        reviews: post.reviewsCount || 0,
        title: post.title,
        description: post.description,
        tags: post.tags || [],
        postedTime: formatRelative(post.postedAt, 'just now'),
        deadline,
        applicants: post.applicantsCount || 0,
        reward: formatCurrencyLike(post.primaryReward),
        alternativeReward: post.alternativeReward || 'Optional reward',
        status,
        rawStatus: post.status,
        isOverdue
    };
};

export const mapPostDetailToQuest = (post) => {
    const authorName = post.author?.username || 'student';
    const status = normalizeStatus(post.status);
    const isOverdue = Boolean(post.deadline && new Date(post.deadline).getTime() < Date.now() && status === 'Open');
    return {
        id: post.id,
        type: post.type,
        title: post.title,
        status,
        rawStatus: post.status,
        postedTime: `Posted ${formatRelative(post.postedAt, 'recently')}`,
        deadline: formatDateLabel(post.deadline, 'Due '),
        description: post.description,
        tags: post.tags || [],
        images: post.images || [],
        rewards: {
            primary: {
                value: formatCurrencyLike(post.primaryReward?.value),
                description: post.primaryReward?.label || 'Primary reward',
                images: post.primaryReward?.images || []
            },
            alternative: {
                value: formatCurrencyLike(post.alternativeReward?.value),
                description: post.alternativeReward?.label || 'Alternative reward',
                images: post.alternativeReward?.images || []
            }
        },
        author: {
            id: post.author?.id,
            name: authorName,
            initials: getInitials(authorName),
            meta: formatAuthorMeta(post.author?.studyProgram, post.author?.yearOfStudy),
            aboutMe: post.author?.aboutMe || 'No bio provided yet.',
            contactInfo: post.author?.contactInfo || 'Contact info is hidden.',
            requesterRating: Number(post.ratings?.asRequester || 0).toFixed(1),
            providerRating: Number(post.ratings?.asProvider || 0).toFixed(1),
            reviews: post.reviewsCount || 0,
            recentPosts: []
        },
        isOverdue
    };
};

export const mapMeResponseToProfile = (me, reviews = [], activeTasks = { accepted: [], requested: [] }) => {
    const accepted = activeTasks.accepted || [];
    const requested = activeTasks.requested || [];
        const activity = [...accepted, ...requested].map((item) => ({
        title: item.title,
        details: item.counterparty?.username
            ? `${accepted.includes(item) ? 'For' : 'With'} ${item.counterparty.username}`
            : 'QuestBoard activity',
        status: normalizeStatus(item.status, 'In Progress'),
        price: item.amount || 'Not specified'
    }));

    return {
        general: {
            id: me.id,
            username: me.username || me.nickname || 'student',
            email: me.email || '',
            university: me.university || me.universityName || 'University not specified',
            studyProgram: me.studyProgram || me.studyProgramName || 'General Studies',
            yearOfStudy: String(me.yearOfStudy || ''),
            contactInfo: me.contactInfo || '',
            bio: me.aboutMe || 'No bio yet.',
            joined: me.joinedAt ? `Joined ${formatDateLabel(me.joinedAt)}` : 'Joined recently'
        },
        stats: {
            requesterRating: Number(me.ratings?.asRequester || 0).toFixed(1),
            providerRating: Number(me.ratings?.asProvider || 0).toFixed(1),
            completedTasks: (me.stats?.completedAsRequester || 0) + (me.stats?.completedAsProvider || 0),
            completedAsRequester: me.stats?.completedAsRequester || 0,
            completedAsProvider: me.stats?.completedAsProvider || 0,
            reputation: [
                { label: 'Completed as requester', value: String(me.stats?.completedAsRequester || 0) },
                { label: 'Completed as provider', value: String(me.stats?.completedAsProvider || 0) },
                { label: 'Open posts', value: String(me.stats?.openPosts || 0) },
                { label: 'In progress', value: String(me.stats?.inProgress || 0) },
                { label: 'Total earned', value: `${me.stats?.totalEarned || 0}€`, valueClass: 'text-brand-secondary' }
            ],
            badges: me.badges?.length ? me.badges : ['QuestBoard Member']
        },
        activity,
        reviews: reviews.map((review, index) => ({
            initials: getInitials(review.raterNickname),
            name: review.raterNickname || 'student',
            time: formatRelative(review.createdAt, 'recently'),
            text: review.comment || 'No comment left.',
            rating: review.stars || 0,
            role: 'Review',
            color: ['bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-rose-500'][index % 4]
        }))
    };
};

export const mapMyPostItemToRequest = (post) => ({
    id: post.id,
    type: post.type,
    title: post.title,
    status: normalizeStatus(post.status),
    rawStatus: post.status,
    postedDate: formatRelative(post.postedAt, 'just now'),
    dueDate: formatDateLabel(post.deadline, ''),
    applicants: post.applicantsCount || 0,
    price: formatCurrencyLike(post.primaryReward),
    alternativeReward: post.alternativeReward || 'Optional reward',
    tags: post.tags || [],
    performer: post.selectedPerformer?.username || ''
});

export const mapApplicantToCard = (applicant) => ({
    id: applicant.id,
    initials: getInitials(applicant.user?.username),
    name: applicant.user?.username || 'student',
    major: formatAuthorMeta(applicant.user?.studyProgram, applicant.user?.yearOfStudy),
    rating: Number(applicant.ratings?.asProvider || applicant.ratings?.asRequester || 0).toFixed(1),
    reviews: applicant.reviewsCount || 0,
    aboutMe: applicant.user?.aboutMe || 'No bio yet.',
    contactInfo: applicant.user?.contactInfo || 'Hidden',
    message: applicant.message || 'No message provided.',
    time: formatRelative(applicant.createdAt, 'recently')
});

export const mapActiveTaskToCard = (task) => ({
    id: task.id,
    postId: task.postId,
    initials: getInitials(task.counterparty?.username),
    title: task.title,
    subtitle: task.counterparty?.username ? `With ${task.counterparty.username}` : 'QuestBoard task',
    rating: Number(task.counterparty?.rating || 0).toFixed(1),
    status: normalizeStatus(task.status, 'In Progress'),
    rawStatus: task.status,
    canReview: normalizeStatus(task.status, 'In Progress') === 'Completed',
    canComplete: normalizeStatus(task.status, 'In Progress') === 'In Progress',
    hasReviewed: false,
    amount: task.amount || 'Not specified',
    dateLine: task.startedAt ? `Started ${formatRelative(task.startedAt, 'recently')}` : 'Started recently'
});
