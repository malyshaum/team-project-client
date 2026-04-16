import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const TABS = ['Activity', 'Reviews'];

const statusClasses = {
    Completed: 'bg-green-50 text-green-600 border border-green-200',
    'In Progress': 'bg-amber-50 text-amber-600 border border-amber-200',
    Open: 'bg-blue-50 text-blue-600 border border-blue-200'
};

const StatCard = ({ title, children }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        {children}
    </div>
);

const Profile = () => {
    const [activeTab, setActiveTab] = useState('Activity');
    const { general, stats, activity, reviews } = useSelector((state) => state.profile);
    const initials = (general.username || 'US').slice(0, 2).toUpperCase();
    const averageRating = useMemo(() => {
        const total = reviews.reduce((sum, item) => sum + item.rating, 0);
        return reviews.length ? (total / reviews.length).toFixed(1) : '0.0';
    }, [reviews]);
    const requesterRating = Number(stats.completedAsRequester || 0) > 0 ? `⭐ ${stats.requesterRating}` : 'N/A';
    const providerRating = Number(stats.completedAsProvider || 0) > 0 ? `⭐ ${stats.providerRating}` : 'N/A';

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[310px_1fr]">
            <div className="space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <div className="relative mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-indigo-100 text-5xl font-medium text-brand-secondary">
                        {initials}
                    </div>
                    <h2 className="text-center text-3xl font-semibold text-gray-900">{general.username}</h2>
                    <p className="text-center text-brand-secondary">{general.studyProgram} · Year {general.yearOfStudy}</p>
                    <p className="mt-1 text-center text-gray-500">{general.university}</p>
                    <p className="mt-1 text-center text-gray-500">{general.joined}</p>
                    <p className="mt-5 text-center text-gray-600">{general.bio}</p>

                    <div className="mt-5 rounded-xl bg-gray-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Contact Info</p>
                        <p className="mt-2 text-sm text-gray-700">{general.contactInfo}</p>
                    </div>

                    <div className="mt-6">
                        <Link
                            to="/profile/edit"
                            className="inline-flex w-full items-center justify-center rounded-xl border border-gray-300 px-4 py-2.5 font-medium text-gray-800 transition-colors hover:bg-gray-50"
                        >
                            Edit Profile
                        </Link>
                    </div>
                </div>

                <StatCard title="Ratings">
                    <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">As requester</span>
                            <span className="text-xl font-bold text-gray-900">{requesterRating}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">As provider</span>
                            <span className="text-xl font-bold text-gray-900">{providerRating}</span>
                        </div>
                    </div>
                </StatCard>

                <StatCard title="Reputation">
                    <div className="mt-4 space-y-3">
                        {stats.reputation.map((item) => (
                            <div key={item.label} className="flex items-center justify-between">
                                <span className="text-gray-500">{item.label}</span>
                                <span className={`font-semibold text-gray-900 ${item.valueClass || ''}`}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </StatCard>
            </div>

            <div>
                <div className="rounded-2xl border border-gray-200 bg-white p-1">
                    <div className="grid grid-cols-2 gap-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`rounded-xl py-2.5 text-sm font-medium transition-colors ${
                                    activeTab === tab ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-800'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === 'Activity' && (
                    <section className="mt-6">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <h3 className="text-2xl font-semibold text-gray-900">Recent Activity</h3>
                            <Link to="/active" className="text-sm font-medium text-brand-secondary">Open Active Tasks</Link>
                        </div>
                        <div className="space-y-4">
                            {activity.map((item) => (
                                <article key={item.title} className="rounded-2xl border border-gray-200 bg-white p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-xl font-semibold text-gray-900">{item.title}</p>
                                            <p className="mt-1 text-gray-500">{item.details}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusClasses[item.status]}`}>{item.status}</span>
                                            <p className="mt-2 font-semibold text-brand-secondary">{item.price}</p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {activeTab === 'Reviews' && (
                    <section className="mt-6">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <h3 className="text-2xl font-semibold text-gray-900">Reviews ({reviews.length})</h3>
                            <div className="text-xl font-semibold text-gray-800">⭐ {averageRating} <span className="text-base font-normal text-gray-500">average</span></div>
                        </div>
                        <p className="mb-4 text-sm text-gray-500">Reviews are left only after a task is finished.</p>
                        <div className="space-y-4">
                            {reviews.map((item) => (
                                <article key={`${item.name}-${item.time}`} className="rounded-2xl border border-gray-200 bg-white p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-white ${item.color}`}>
                                                {item.initials}
                                            </div>
                                            <div>
                                                <p className="text-2xl font-semibold text-gray-900">{item.name}</p>
                                                <p className="text-gray-500">{item.time} · {item.role}</p>
                                            </div>
                                        </div>
                                        <p className="text-2xl tracking-wide text-amber-400">{'★'.repeat(item.rating)}<span className="text-gray-200">{'★'.repeat(5 - item.rating)}</span></p>
                                    </div>
                                    <p className="mt-3 text-gray-600">{item.text}</p>
                                </article>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default Profile;
