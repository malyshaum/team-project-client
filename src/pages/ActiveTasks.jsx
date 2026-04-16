import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { apiRequest } from '../lib/api';
import { mapActiveTaskToCard } from '../lib/adapters';
import { showToast } from '../store/uiSlice';

const tabs = ['Quests I Accepted', 'Help I Requested'];

const statusClasses = {
    Completed: 'border border-green-200 bg-green-50 text-green-600',
    'In Progress': 'border border-yellow-200 bg-yellow-50 text-yellow-600'
};

const StarPicker = ({ value, onChange }) => (
    <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((stars) => (
            <button
                key={stars}
                type="button"
                onClick={() => onChange(stars)}
                className={`text-2xl ${stars <= value ? 'text-amber-400' : 'text-gray-300'}`}
            >
                ★
            </button>
        ))}
    </div>
);

const ActiveTasks = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [tasks, setTasks] = React.useState({ accepted: [], requested: [] });
    const [busyTaskId, setBusyTaskId] = React.useState(null);
    const [reviewDrafts, setReviewDrafts] = React.useState({});

    React.useEffect(() => {
        let active = true;

        const loadActiveTasks = async () => {
            try {
                const response = await apiRequest('/me/active-tasks');
                if (active) {
                    setTasks({
                        accepted: (response.accepted || []).map(mapActiveTaskToCard),
                        requested: (response.requested || []).map(mapActiveTaskToCard)
                    });
                }
            } catch (error) {
                dispatch(showToast({ title: error.message || 'Failed to load active tasks.', variant: 'error' }));
            }
        };

        loadActiveTasks();
        return () => {
            active = false;
        };
    }, [dispatch]);

    const items = activeTab === tabs[0] ? tasks.accepted : tasks.requested;

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900">Active Tasks</h1>
                <p className="text-gray-500">Track tasks you are working on or help you requested</p>
            </div>

            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-1">
                <div className="grid grid-cols-2 gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`rounded-xl px-3 py-3 text-lg font-medium transition-colors ${
                                activeTab === tab ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {items.length === 0 && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
                        No active tasks found.
                    </div>
                )}
                {items.map((task) => (
                    <article key={task.id} className="rounded-2xl border border-gray-200 bg-white p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg font-medium text-brand-secondary">
                                    {task.initials}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold text-gray-900">{task.title}</h3>
                                    <p className="text-gray-500">{task.subtitle}</p>
                                    <p className="mt-1 text-lg text-gray-700">⭐ {task.rating}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusClasses[task.status]}`}>{task.status}</span>
                                <p className="mt-2 text-3xl font-semibold text-brand-secondary">{task.amount}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-3">
                            <p className="text-gray-500">{task.dateLine}</p>
                            <div className="flex flex-wrap items-center gap-2">
                                {activeTab === tabs[1] && task.canComplete && (
                                    <button
                                        onClick={async () => {
                                            try {
                                                setBusyTaskId(task.id);
                                                await apiRequest(`/interactions/${task.id}/complete`, {
                                                    method: 'POST'
                                                });
                                                setTasks((current) => ({
                                                    ...current,
                                                    requested: current.requested.map((item) => (
                                                        item.id === task.id
                                                            ? { ...item, status: 'Completed', canComplete: false, canReview: true, dateLine: 'Completed just now' }
                                                            : item
                                                    ))
                                                }));
                                                dispatch(showToast({ title: 'Task marked as completed.', variant: 'success' }));
                                            } catch (error) {
                                                dispatch(showToast({ title: error.message || 'Failed to complete task.', variant: 'error' }));
                                            } finally {
                                                setBusyTaskId(null);
                                            }
                                        }}
                                        disabled={busyTaskId === task.id}
                                        className="inline-flex items-center rounded-xl bg-gradient-to-r from-btn-start to-btn-end px-4 py-2.5 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {busyTaskId === task.id ? 'Completing...' : 'Mark Completed'}
                                    </button>
                                )}
                                <button
                                    disabled={!task.canReview || busyTaskId === task.id}
                                    onClick={async () => {
                                        if (!task.canReview) {
                                            dispatch(showToast({ title: 'Reviews are available only after the task is completed.', variant: 'warning' }));
                                            return;
                                        }
                                        setReviewDrafts((current) => ({
                                            ...current,
                                            [task.id]: current[task.id] || { open: true, stars: 5, comment: '' }
                                        }));
                                    }}
                                    className="inline-flex items-center rounded-xl border border-gray-300 px-4 py-2.5 font-medium text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <span className="mr-2">☆</span>
                                    {task.hasReviewed ? 'Review Submitted' : 'Leave Review'}
                                </button>
                            </div>
                        </div>
                        {reviewDrafts[task.id]?.open && (
                            <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                <p className="text-sm font-semibold text-gray-900">Leave a review</p>
                                <p className="mt-1 text-sm text-gray-500">Select a star rating and add a short comment.</p>
                                <div className="mt-4">
                                    <StarPicker
                                        value={reviewDrafts[task.id]?.stars || 5}
                                        onChange={(stars) => setReviewDrafts((current) => ({
                                            ...current,
                                            [task.id]: { ...current[task.id], stars }
                                        }))}
                                    />
                                </div>
                                <textarea
                                    value={reviewDrafts[task.id]?.comment || ''}
                                    onChange={(event) => setReviewDrafts((current) => ({
                                        ...current,
                                        [task.id]: { ...current[task.id], comment: event.target.value }
                                    }))}
                                    rows={4}
                                    className="mt-4 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                    placeholder="Describe how the interaction went."
                                />
                                <div className="mt-4 flex flex-wrap justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setReviewDrafts((current) => {
                                            const next = { ...current };
                                            delete next[task.id];
                                            return next;
                                        })}
                                        className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        disabled={busyTaskId === task.id}
                                        onClick={async () => {
                                            try {
                                                setBusyTaskId(task.id);
                                                await apiRequest(`/active-tasks/${task.id}/reviews`, {
                                                    method: 'POST',
                                                    body: {
                                                        stars: reviewDrafts[task.id]?.stars || 5,
                                                        comment: reviewDrafts[task.id]?.comment || ''
                                                    }
                                                });
                                                setTasks((current) => ({
                                                    ...current,
                                                    [activeTab === tabs[0] ? 'accepted' : 'requested']: current[activeTab === tabs[0] ? 'accepted' : 'requested'].map((item) => (
                                                        item.id === task.id ? { ...item, hasReviewed: true, canReview: false } : item
                                                    ))
                                                }));
                                                setReviewDrafts((current) => {
                                                    const next = { ...current };
                                                    delete next[task.id];
                                                    return next;
                                                });
                                                dispatch(showToast({ title: 'Review submitted.', variant: 'success' }));
                                            } catch (error) {
                                                dispatch(showToast({ title: error.message || 'Failed to submit review.', variant: 'error' }));
                                            } finally {
                                                setBusyTaskId(null);
                                            }
                                        }}
                                        className="rounded-xl bg-gradient-to-r from-btn-start to-btn-end px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {busyTaskId === task.id ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </article>
                ))}
            </div>
        </div>
    );
};

export default ActiveTasks;
