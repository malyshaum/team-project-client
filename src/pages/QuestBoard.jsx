import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Button from '../components/Button';
import QuestCard from '../components/QuestCard';
import { apiRequest } from '../lib/api';
import { mapPostListItemToCard } from '../lib/adapters';
import { showToast } from '../store/uiSlice';

const FILTERS = ['All', 'Coding', 'Writing', 'Errands', 'Design', 'Tutoring', 'Homework', 'Moving', 'Urgent'];
const SORTS = ['Newest', 'Most Applied', 'Highest Reward'];

const parseReward = (value = '') => Number(value.replace(/[^\d.]/g, '')) || 0;

const QuestBoard = () => {
    const dispatch = useDispatch();
    const [quests, setQuests] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const [sort, setSort] = useState('Newest');
    const [search, setSearch] = useState('');

    React.useEffect(() => {
        let active = true;

        const loadQuests = async () => {
            setLoading(true);
            try {
                const response = await apiRequest('/posts?type=quest&limit=100&offset=0');
                if (active) {
                    setQuests((response.items || []).map(mapPostListItemToCard));
                }
            } catch (error) {
                dispatch(showToast({ title: error.message || 'Failed to load quests.', variant: 'error' }));
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadQuests();
        return () => {
            active = false;
        };
    }, [dispatch]);

    const filtered = useMemo(() => {
        let list = quests.filter((quest) => quest.status === 'Open');
        if (activeFilter !== 'All') {
            list = list.filter((quest) => quest.tags.includes(activeFilter));
        }
        if (search.trim()) {
            const query = search.toLowerCase();
            list = list.filter((quest) =>
                quest.title.toLowerCase().includes(query) ||
                quest.description.toLowerCase().includes(query) ||
                quest.tags.join(' ').toLowerCase().includes(query)
            );
        }

        if (sort === 'Most Applied') {
            list.sort((a, b) => b.applicants - a.applicants);
        } else if (sort === 'Highest Reward') {
            list.sort((a, b) => parseReward(b.reward) - parseReward(a.reward));
        } else {
            list.sort((a, b) => b.id - a.id);
        }

        return list;
    }, [quests, activeFilter, search, sort]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quest Board</h1>
                    <p className="text-gray-500">Explore and apply for tasks given by other students.</p>
                </div>
                <Link to="/create-quest">
                    <Button className="w-full px-6 sm:w-auto">Post a new Task</Button>
                </Link>
            </div>

            <div className="space-y-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm placeholder-gray-400 shadow-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                    placeholder="Search quests by title, description, or tag..."
                />

                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                        {FILTERS.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                                    activeFilter === filter ? 'bg-brand-primary text-white' : 'bg-white text-gray-600'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {SORTS.map((item) => (
                            <button
                                key={item}
                                onClick={() => setSort(item)}
                                className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                                    sort === item ? 'border-brand-primary bg-brand-primary text-white' : 'border-gray-200 bg-white text-gray-700'
                                }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {!loading && filtered.length === 0 && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
                        No quests found.
                    </div>
                )}
                {filtered.map((quest) => (
                    <QuestCard key={quest.id} quest={quest} />
                ))}
            </div>
        </div>
    );
};

export default QuestBoard;
