import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Button from '../components/Button';
import RequestListCard from '../components/RequestListCard';
import { apiRequest } from '../lib/api';
import { mapMyPostItemToRequest } from '../lib/adapters';
import { showToast } from '../store/uiSlice';

const MyRequests = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('All');
    const [requests, setRequests] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const tabs = ['All', 'Open', 'In Progress', 'Completed', 'Cancelled'];
    
    React.useEffect(() => {
        let active = true;

        const loadMyPosts = async () => {
            setLoading(true);
            try {
                const response = await apiRequest('/me/posts?limit=100&offset=0');
                if (active) {
                    setRequests((response.items || []).map(mapMyPostItemToRequest));
                }
            } catch (error) {
                dispatch(showToast({ title: error.message || 'Failed to load your posts.', variant: 'error' }));
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadMyPosts();
        return () => {
            active = false;
        };
    }, [dispatch]);

    const filteredRequests = activeTab === 'All' ? requests : requests.filter((req) => req.status === activeTab);

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 pb-24 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Posts</h1>
                    <p className="text-sm text-gray-500">Quests and service advertisements you created.</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button onClick={() => navigate('/create-quest')} className="w-full sm:w-auto">Post a Quest</Button>
                    <Button variant="outline" onClick={() => navigate('/create-service')} className="w-full sm:w-auto">Offer a Service</Button>
                </div>
            </div>

            <div className="mb-8 flex overflow-x-auto rounded-xl border border-gray-200 bg-white p-1 no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`min-w-[100px] flex-1 whitespace-nowrap rounded-lg py-2.5 text-sm font-medium transition-all duration-200 ${
                            activeTab === tab ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {!loading && filteredRequests.length === 0 && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
                        No posts found.
                    </div>
                )}
                {filteredRequests.map((request) => (
                    <RequestListCard
                        key={request.id}
                        request={request}
                        onView={() => navigate(`/requests/${request.id}`)}
                        onManage={() => navigate(`/my-requests/${request.id}/manage`)}
                    />
                ))}
            </div>
        </div>
    );
};

export default MyRequests;
