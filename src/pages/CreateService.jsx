import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import FileUpload from '../components/FileUpload';
import TagSelector from '../components/TagSelector';
import Button from '../components/Button';
import { showToast } from '../store/uiSlice';
import { apiFormRequest, apiRequest } from '../lib/api';

const UploadCard = ({ title, children }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="mb-1 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mb-4 text-sm text-gray-500">Optional images</p>
        {children}
    </div>
);

const CreateService = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const editPostId = location.state?.editPostId || null;
    const [availableTags, setAvailableTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [form, setForm] = useState({
        title: '',
        description: '',
        reward: '',
        alternativeReward: ''
    });
    const [files, setFiles] = useState({
        description: null,
        reward1: null,
        reward2: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    React.useEffect(() => {
        let active = true;

        const loadInitialData = async () => {
            try {
                const [tagsResponse, postResponse] = await Promise.all([
                    apiRequest('/tags'),
                    editPostId ? apiRequest(`/posts/${editPostId}`) : Promise.resolve(null)
                ]);

                if (!active) {
                    return;
                }

                setAvailableTags((tagsResponse || []).map((item) => item.tagName));

                if (postResponse) {
                    setForm({
                        title: postResponse.title || '',
                        description: postResponse.description || '',
                        reward: postResponse.primaryReward?.value || '',
                        alternativeReward: postResponse.alternativeReward?.value || ''
                    });
                    setSelectedTags(postResponse.tags || []);
                }
            } catch (error) {
                dispatch(showToast({ title: error.message || 'Failed to load form data.', variant: 'error' }));
            }
        };

        loadInitialData();
        return () => {
            active = false;
        };
    }, [dispatch, editPostId]);

    const uploadSelectedImages = async (postId) => {
        const uploads = [
            { section: 'DESCRIPTION', file: files.description },
            { section: 'REWARD1', file: files.reward1 },
            { section: 'REWARD2', file: files.reward2 }
        ].filter((item) => item.file);

        for (const { section, file } of uploads) {
            const formData = new FormData();
            formData.append('file', file);
            await apiFormRequest(`/posts/${postId}/images?section=${section}`, {
                method: 'POST',
                formData
            });
        }
    };

    const handlePublish = async () => {
        if (isSubmitting) {
            return;
        }

        if (!form.title.trim() || !form.description.trim() || !form.reward.trim()) {
            dispatch(showToast({ title: 'Fill title, description, and main reward before publishing.', variant: 'warning' }));
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await apiRequest(editPostId ? `/posts/${editPostId}` : '/posts/services', {
                method: editPostId ? 'PATCH' : 'POST',
                body: {
                    type: 'service',
                    title: form.title,
                    description: form.description,
                    primaryReward: form.reward,
                    alternativeReward: form.alternativeReward || undefined,
                    tags: selectedTags
                }
            });
            await uploadSelectedImages(response.id);
            navigate('/provider');
            dispatch(showToast({ title: editPostId ? 'Service updated.' : 'Service post published.', variant: 'success' }));
        } catch (error) {
            dispatch(showToast({ title: error.message || 'Failed to publish service.', variant: 'error' }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
                <button onClick={() => navigate('/provider')} className="mb-4 flex items-center text-sm text-gray-500 hover:text-gray-900">← Back</button>
                <h1 className="text-2xl font-bold text-gray-900">Create Service Advertisement</h1>
                <p className="mt-1 text-gray-500">Same structure as quests: tags, two rewards, optional images.</p>
            </div>

            <div className="space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-8">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">Service Details</h2>
                    <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Java Programming Help" />
                    <TextArea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-8">
                    <h2 className="mb-1 text-lg font-semibold text-gray-900">Tags</h2>
                    <p className="mb-4 text-sm text-gray-500">{selectedTags.length ? `${selectedTags.length} tag(s) selected` : 'Pick tags so the post appears in board filters.'}</p>
                    <TagSelector
                        options={availableTags}
                        selectedTags={selectedTags}
                        onToggle={(tag) => setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]))}
                    />
                </div>

                {/* Temporarily hidden until image uploads are stable in production.
                <UploadCard title="Description Images">
                    <FileUpload
                        className="h-32 w-full p-4"
                        fileName={files.description?.name || ''}
                        onChange={(e) => setFiles((current) => ({ ...current, description: e.target.files?.[0] || null }))}
                    />
                </UploadCard>
                */}

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-gray-200 bg-white p-8">
                        <h2 className="mb-1 text-lg font-semibold text-gray-900">Primary Reward</h2>
                        <Input label="Reward" value={form.reward} onChange={(e) => setForm({ ...form, reward: e.target.value })} placeholder='e.g. "5.00€/hour"' />
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-8">
                        <h2 className="mb-1 text-lg font-semibold text-gray-900">Alternative Reward</h2>
                        <Input label="Alternative reward (optional)" value={form.alternativeReward} onChange={(e) => setForm({ ...form, alternativeReward: e.target.value })} placeholder="e.g. barter for notes" />
                    </div>
                </div>

                {/* Temporarily hidden until image uploads are stable in production.
                <div className="grid gap-6 md:grid-cols-2">
                    <UploadCard title="Primary Reward Images">
                        <FileUpload
                            className="h-32 w-full p-4"
                            fileName={files.reward1?.name || ''}
                            onChange={(e) => setFiles((current) => ({ ...current, reward1: e.target.files?.[0] || null }))}
                        />
                    </UploadCard>
                    <UploadCard title="Alternative Reward Images">
                        <FileUpload
                            className="h-32 w-full p-4"
                            fileName={files.reward2?.name || ''}
                            onChange={(e) => setFiles((current) => ({ ...current, reward2: e.target.files?.[0] || null }))}
                        />
                    </UploadCard>
                </div>
                */}

                <div className="flex justify-end gap-4 pt-4">
                    <Button variant="outline" onClick={() => navigate('/provider')} className="w-auto px-6">Cancel</Button>
                    <Button disabled={isSubmitting} onClick={handlePublish} className="w-auto px-8 py-2.5 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Publishing...' : editPostId ? 'Save Service' : 'Publish Service'}</Button>
                </div>
            </div>
        </div>
    );
};

export default CreateService;
