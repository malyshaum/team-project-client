import React from 'react';
import Badge from './Badge';
import Button from './Button';

const RequestListCard = ({ request, onView, onManage }) => {
    const statusColors = {
        Open: 'green',
        'In Progress': 'yellow',
        Completed: 'blue',
        Cancelled: 'red'
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${request.type === 'service' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}`}>
                            {request.type === 'service' ? 'Service' : 'Quest'}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900">{request.title}</h3>
                        <Badge variant={statusColors[request.status]}>{request.status}</Badge>
                    </div>

                    <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                        <div>Posted {request.postedDate}</div>
                        <div>{request.type === 'service' ? 'Availability' : 'Due'} {request.dueDate}</div>
                        <div>{request.applicants} applicants</div>
                    </div>

                    {request.performer && (
                        <div className="mb-3 flex items-center gap-2 text-sm text-gray-700">
                            <span className="text-gray-500">Performer:</span>
                            <span className="font-medium">{request.performer}</span>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                        {request.tags.map((tag) => (
                            <span key={tag} className="rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="min-w-[180px]">
                    <div className="text-right text-xl font-bold text-brand-primary">{request.price}</div>
                    <div className="mt-1 text-right text-sm text-gray-500">{request.alternativeReward}</div>
                    <div className="mt-4 flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={onView} className="flex-1">View</Button>
                        <Button variant="outline" size="sm" onClick={onManage} className="flex-1">Manage</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestListCard;
