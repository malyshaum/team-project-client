import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../store/uiSlice';

const tabs = ['Quests I Accepted', 'Help I Requested'];

const statusClasses = {
    Completed: 'border border-green-200 bg-green-50 text-green-600',
    'In Progress': 'border border-yellow-200 bg-yellow-50 text-yellow-600'
};

const ActiveTasks = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const items = useSelector((state) =>
        activeTab === tabs[0] ? state.tasks.activeTasks.accepted : state.tasks.activeTasks.requested
    );

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
                            {task.canReview && (
                                <button
                                    onClick={() => dispatch(showToast({ title: `Review modal for "${task.title}" opened (mock).`, variant: 'info' }))}
                                    className="inline-flex items-center rounded-xl border border-gray-300 px-4 py-2.5 font-medium text-gray-800 hover:bg-gray-50"
                                >
                                    <span className="mr-2">☆</span>
                                    Leave Review
                                </button>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default ActiveTasks;
