import React from 'react';
import { Link } from 'react-router-dom';

const colorMap = {
    indigo: '#6366f1',
    amber: '#f59e0b',
    blue: '#3b82f6',
    rose: '#f43f5e'
};

const QuestCard = ({ quest }) => {
    return (
        <Link to={`/quests/${quest.id}`} className="group block h-full">
            <div className="flex h-full cursor-pointer flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
                <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: colorMap[quest.color] || colorMap.indigo }}>
                            {quest.initials}
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-brand-primary">{quest.author}</h3>
                            <p className="text-xs text-gray-500">{quest.authorMeta}</p>
                            <div className="flex items-center text-xs text-gray-500">
                                <span className="font-medium text-gray-900">Requester ⭐ {quest.requesterRating}</span>
                                <span className="ml-2">Provider ⭐ {quest.providerRating}</span>
                            </div>
                        </div>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        {quest.status}
                    </span>
                </div>

                <div className="flex-grow">
                    <h4 className="mb-1 text-base font-bold text-gray-900 transition-colors group-hover:text-brand-primary">{quest.title}</h4>
                    <p className="mb-3 line-clamp-2 text-sm text-gray-600">{quest.description}</p>
                    <div className="mb-4 flex flex-wrap gap-2">
                        {quest.tags.map((tag) => (
                            <span key={tag} className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                        <span>{quest.postedTime}</span>
                        <span>{quest.deadline}</span>
                        {quest.applicants > 0 && <span>{quest.applicants} applied</span>}
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-bold text-brand-primary">{quest.reward}</div>
                        <div>{quest.alternativeReward}</div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default QuestCard;
