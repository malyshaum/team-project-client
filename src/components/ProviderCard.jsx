import React from 'react';
import { Link } from 'react-router-dom';

const colorMap = {
    indigo: '#6366f1',
    amber: '#f59e0b',
    blue: '#3b82f6',
    rose: '#f43f5e'
};

const ProviderCard = ({ provider }) => {
    return (
        <Link to={`/requests/${provider.id}`} className="block h-full">
            <div className="flex h-full flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
                <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: colorMap[provider.color] || colorMap.indigo }}>
                            {provider.initials}
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">{provider.name}</h3>
                            <p className="text-xs text-gray-500">{provider.authorMeta}</p>
                            <div className="flex items-center text-xs text-gray-500">
                                <span>Provider ⭐ {provider.providerRating}</span>
                            </div>
                        </div>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${provider.status === 'Open' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'}`}>
                        {provider.status === 'Open' ? 'Service' : provider.status}
                    </span>
                </div>

                <div className="flex-grow">
                    <h4 className="mb-1 text-base font-bold text-gray-900">{provider.title}</h4>
                    <p className="mb-3 line-clamp-3 text-sm text-gray-600">{provider.description}</p>
                    <div className="mb-4 flex flex-wrap gap-2">
                        {provider.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
                    <div>
                        <span className="mb-0.5 block text-xs text-gray-500">Primary Reward</span>
                        <span className="text-base font-bold text-brand-primary">{provider.reward}</span>
                        <span className="mt-1 block text-[11px] uppercase tracking-wide text-gray-400">Alternative reward</span>
                        <span className="block text-xs text-gray-500">{provider.alternativeReward}</span>
                    </div>
                    <span className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700">
                        View Post
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default ProviderCard;
