import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Button from '../components/Button';
import ProviderCard from '../components/ProviderCard';
import { apiRequest } from '../lib/api';
import { mapPostListItemToCard } from '../lib/adapters';
import { showToast } from '../store/uiSlice';

const FILTERS = ['All', 'Coding', 'Writing', 'Errands', 'Design', 'Tutoring', 'Moving'];
const SORTS = ['Newest', 'Lowest Reward', 'Highest Rated'];

const parsePrice = (value = '') => Number(value.replace(/[^\d.]/g, '')) || 0;

const ProviderBoard = () => {
    const dispatch = useDispatch();
    const [providers, setProviders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const [sort, setSort] = useState('Newest');
    const [search, setSearch] = useState('');

    React.useEffect(() => {
        let active = true;

        const loadProviders = async () => {
            setLoading(true);
            try {
                const response = await apiRequest('/posts?type=service&limit=100&offset=0');
                if (active) {
                    setProviders((response.items || []).map(mapPostListItemToCard));
                }
            } catch (error) {
                dispatch(showToast({ title: error.message || 'Failed to load services.', variant: 'error' }));
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadProviders();
        return () => {
            active = false;
        };
    }, [dispatch]);

    const filtered = useMemo(() => {
        let list = [...providers];
        if (activeFilter !== 'All') {
            list = list.filter((provider) => provider.tags.includes(activeFilter));
        }
        if (search.trim()) {
            const query = search.toLowerCase();
            list = list.filter((provider) =>
                provider.title.toLowerCase().includes(query) ||
                provider.description.toLowerCase().includes(query) ||
                provider.name.toLowerCase().includes(query) ||
                provider.tags.join(' ').toLowerCase().includes(query)
            );
        }

        if (sort === 'Lowest Reward') {
            list.sort((a, b) => {
                const left = parsePrice(a.reward);
                const right = parsePrice(b.reward);
                if (!left && !right) {
                    return b.id - a.id;
                }
                if (!left) {
                    return 1;
                }
                if (!right) {
                    return -1;
                }
                return left - right;
            });
        } else if (sort === 'Highest Rated') {
            list.sort((a, b) => b.providerRating - a.providerRating);
        } else {
            list.sort((a, b) => b.id - a.id);
        }
        return list;
    }, [providers, activeFilter, search, sort]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Provider Board</h1>
                    <p className="text-gray-500">Find service posts from other students.</p>
                </div>
                <Link to="/create-service">
                    <Button className="w-full px-6 sm:w-auto">Offer a Service</Button>
                </Link>
            </div>

            <div className="space-y-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm placeholder-gray-400 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                    placeholder="Find coding help, tutors, errands..."
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2">
                        {FILTERS.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                                    activeFilter === filter ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600'
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
                                className={`rounded-lg border px-4 py-1.5 text-sm font-medium ${
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
                        No services found.
                    </div>
                )}
                {filtered.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} />
                ))}
            </div>
        </div>
    );
};

export default ProviderBoard;
