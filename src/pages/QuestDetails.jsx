import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import SafetyTipCard from '../components/SafetyTipCard';
import { showToast } from '../store/uiSlice';
import { apiRequest } from '../lib/api';
import { mapPostDetailToQuest } from '../lib/adapters';

const rewardLabels = {
    primary: 'Primary Reward',
    alternative: 'Alternative Reward'
};

const ImageGrid = ({ images, altPrefix }) => {
    if (!images?.length) {
        return null;
    }

    return (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {images.map((image, index) => (
                <img
                    key={`${altPrefix}-${index}`}
                    src={image}
                    alt={`${altPrefix} ${index + 1}`}
                    className="h-40 w-full rounded-2xl border border-gray-200 bg-gray-50 object-cover"
                />
            ))}
        </div>
    );
};

const QuestDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [contactOpen, setContactOpen] = useState(false);
    const [quest, setQuest] = useState(null);
    const [selectedReward, setSelectedReward] = useState('primary');
    const [authorReviews, setAuthorReviews] = useState([]);

    React.useEffect(() => {
        let active = true;

        const loadPost = async () => {
            try {
                const response = await apiRequest(`/posts/${id}`);
                if (active) {
                    setQuest(mapPostDetailToQuest(response));
                }
            } catch (error) {
                dispatch(showToast({ title: error.message || 'Failed to load post details.', variant: 'error' }));
            }
        };

        loadPost();
        return () => {
            active = false;
        };
    }, [dispatch, id]);

    if (!quest) {
        return <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">Loading post...</div>;
    }

    return (
        <div className="mx-auto max-w-6xl">
            <div className="mb-5 flex items-center gap-2 text-sm text-gray-500">
                <Link to={quest.type === 'service' ? '/provider' : '/quests'} className="hover:text-gray-800">
                    {quest.type === 'service' ? 'Provider Board' : 'Quest Board'}
                </Link>
                <span>/</span>
                <span>{quest.type === 'service' ? 'Service Post' : 'Quest Post'}</span>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
                <div>
                    <h1 className="text-5xl font-bold text-gray-900">{quest.title}</h1>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-gray-500">
                        <span>{quest.postedTime}</span>
                        <span>•</span>
                        <span>{quest.deadline}</span>
                        <span>•</span>
                        <span className="text-green-600">{quest.status}</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {quest.tags.map((tag) => (
                            <span
                                key={tag}
                                className={`rounded-full px-3 py-1 text-xl ${
                                    tag === 'Urgent' ? 'border border-red-300 bg-red-50 text-red-500' : 'border border-gray-200 bg-gray-100 text-gray-700'
                                }`}
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
                        <p className="whitespace-pre-line text-2xl leading-relaxed text-gray-600">{quest.description}</p>
                        <ImageGrid images={quest.images} altPrefix="Post image" />
                    </div>

                    <div className="mt-6">
                        <h2 className="mb-3 text-3xl font-semibold text-gray-900">Select Reward</h2>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {Object.entries(quest.rewards).map(([key, reward]) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedReward(key)}
                                    className={`rounded-2xl border p-5 text-left ${
                                        selectedReward === key ? 'border-brand-secondary ring-1 ring-brand-secondary' : 'border-gray-200 bg-white'
                                    }`}
                                >
                                    <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">{rewardLabels[key]}</p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900">{reward.value}</p>
                                    <p className="mt-1 text-gray-500">{reward.description}</p>
                                    {reward.images?.length > 0 ? (
                                        <div className="mt-4 grid gap-2">
                                            {reward.images.map((image, index) => (
                                                <img
                                                    key={`${key}-${index}`}
                                                    src={image}
                                                    alt={`${rewardLabels[key]} ${index + 1}`}
                                                    className="h-24 w-full rounded-xl border border-gray-200 bg-gray-50 object-cover"
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="mt-4 text-xs text-gray-400">No reward images attached.</p>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                        <button
                            onClick={async () => {
                                try {
                                    await apiRequest(`/posts/${quest.id}/claim`, { method: 'POST' });
                                    dispatch(showToast({ title: quest.type === 'service' ? 'Service booked.' : 'Task claimed.', variant: 'success' }));
                                } catch (error) {
                                    dispatch(showToast({ title: error.message || 'Failed to claim post.', variant: 'error' }));
                                }
                            }}
                            className="rounded-xl bg-gradient-to-r from-btn-start to-btn-end px-5 py-3 text-xl font-semibold text-white"
                        >
                            {quest.type === 'service' ? 'Book Service' : 'Claim Task'}
                        </button>
                        <button
                            onClick={async () => {
                                try {
                                    const response = await apiRequest(`/posts/${quest.id}/contact`, { method: 'POST' });
                                    setQuest((current) => ({
                                        ...current,
                                        author: {
                                            ...current.author,
                                            contactInfo: response.contactInfo || current.author.contactInfo
                                        }
                                    }));
                                    setContactOpen((current) => !current);
                                } catch (error) {
                                    dispatch(showToast({ title: error.message || 'Failed to reveal contact info.', variant: 'error' }));
                                }
                            }}
                            className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-xl font-semibold text-gray-800 hover:bg-gray-50"
                        >
                            Contact Info
                        </button>
                    </div>

                    {contactOpen && (
                        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5">
                            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Preferred contact</p>
                            <p className="mt-2 text-lg text-gray-800">{quest.author.contactInfo}</p>
                        </div>
                    )}
                </div>

                <aside className="space-y-4">
                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-medium text-brand-secondary">
                                {quest.author.initials}
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-gray-900">{quest.author.name}</p>
                                <p className="text-brand-secondary">{quest.author.meta}</p>
                            </div>
                        </div>

                        <div className="mb-4 grid gap-3">
                            <div className="rounded-xl border border-gray-200 px-3 py-2">
                                <p className="flex items-center justify-between text-gray-600">
                                    <span>Rating as requester</span>
                                    <span className="font-semibold text-gray-900">⭐ {quest.author.requesterRating}</span>
                                </p>
                            </div>
                            <div className="rounded-xl border border-gray-200 px-3 py-2">
                                <p className="flex items-center justify-between text-gray-600">
                                    <span>Rating as provider</span>
                                    <span className="font-semibold text-gray-900">⭐ {quest.author.providerRating}</span>
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                            <div className="mb-2 flex items-center justify-between">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500">About Me</h4>
                                <button
                                    onClick={async () => {
                                        try {
                                            const response = await apiRequest(`/users/${quest.author.id}/reviews`, { token: '' });
                                            setAuthorReviews(response || []);
                                        } catch (error) {
                                            dispatch(showToast({ title: error.message || 'Failed to load reviews.', variant: 'error' }));
                                        }
                                    }}
                                    className="text-sm font-medium text-brand-secondary"
                                >
                                    Reviews ({quest.author.reviews})
                                </button>
                            </div>
                            <p className="text-sm leading-6 text-gray-700">{quest.author.aboutMe}</p>
                            {authorReviews.length > 0 && (
                                <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
                                    {authorReviews.slice(0, 3).map((review) => (
                                        <div key={review.ratingId} className="rounded-lg bg-white p-3">
                                            <p className="text-sm font-medium text-gray-900">{review.raterNickname} · {'★'.repeat(review.stars || 0)}</p>
                                            <p className="mt-1 text-sm text-gray-600">{review.comment || 'No comment left.'}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {quest.author.recentPosts?.length > 0 && (
                            <>
                                <h4 className="mb-2 mt-4 text-sm font-bold uppercase tracking-wider text-gray-500">Recent Posts</h4>
                                <div className="space-y-2">
                                    {quest.author.recentPosts.map((item) => (
                                        <div key={item.title}>
                                            <p className="font-medium text-gray-800">{item.title}</p>
                                            <p className="text-sm text-green-600">{item.timeAgo}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    <SafetyTipCard />
                </aside>
            </div>
        </div>
    );
};

export default QuestDetails;
