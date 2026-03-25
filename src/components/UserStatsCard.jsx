import React from 'react';
import Button from './Button';

const UserStatsCard = ({ user }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white ${user.color || 'bg-indigo-500'}`}>
                    {user.initials}
                </div>
                <div>
                    <h3 className="text-base font-bold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-brand-primary">{user.title}</p>
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* Stats */}
            <div className="space-y-3">
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="text-sm text-gray-500">Trust Score</span>
                    <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-bold text-gray-900">{user.trustScore}</span>
                        <span className="text-xs text-gray-400">({user.tasksCount} tasks)</span>
                    </div>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="text-sm text-gray-500">Completed</span>
                    <span className="text-sm font-bold text-gray-900">{user.completed}</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="text-sm text-gray-500">Accepted</span>
                    <span className="text-sm font-bold text-gray-900">{user.accepted}</span>
                </div>
            </div>

            <Button variant="outline" className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Show Contact Info
            </Button>

            {/* Recent Requests */}
            <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Recent Requests</h4>
                <div className="space-y-3">
                    {user.recentRequests && user.recentRequests.map((req, index) => (
                        <div key={index} className="group cursor-pointer">
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 group-hover:text-brand-primary transition-colors">{req.title}</p>
                                    <p className="text-xs text-gray-500">Completed {req.timeAgo}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserStatsCard;
