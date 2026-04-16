import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import FileUpload from '../components/FileUpload';
import TagSelector from '../components/TagSelector';
import { showToast } from '../store/uiSlice';
import { apiFormRequest, apiRequest } from '../lib/api';
import { formatDateTimeLocalValue } from '../lib/adapters';

const UploadCard = ({ title, children }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="mb-1 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mb-4 text-sm text-gray-500">Optional images</p>
        {children}
    </div>
);

const CreateQuest = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const editPostId = location.state?.editPostId || null;
    const [form, setForm] = useState({
        title: '',
        description: '',
        dueDate: '',
        reward: '',
        alternativeReward: ''
    });
    const [availableTags, setAvailableTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
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
                        dueDate: formatDateTimeLocalValue(postResponse.deadline),
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

        const parsedDeadline = form.dueDate ? new Date(form.dueDate) : null;
        if (parsedDeadline && Number.isNaN(parsedDeadline.getTime())) {
            dispatch(showToast({ title: 'Use a valid due date and time.', variant: 'warning' }));
            return;
        }

        try {
            setIsSubmitting(true);
            const payload = {
                type: 'quest',
                title: form.title,
                description: form.description,
                deadline: parsedDeadline ? parsedDeadline.toISOString() : undefined,
                primaryReward: form.reward,
                alternativeReward: form.alternativeReward || undefined,
                tags: selectedTags
            };
            const response = await apiRequest(editPostId ? `/posts/${editPostId}` : '/posts/quests', {
                method: editPostId ? 'PATCH' : 'POST',
                body: payload
            });
            await uploadSelectedImages(response.id);
            navigate('/quests');
            dispatch(showToast({ title: editPostId ? 'Quest updated.' : 'Quest post published.', variant: 'success' }));
        } catch (error) {
            dispatch(showToast({ title: error.message || 'Failed to publish quest.', variant: 'error' }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center">
                <button onClick={() => navigate('/quests')} className="mr-4 rounded-full p-2 text-gray-500 hover:bg-gray-100">←</button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Create Quest Advertisement</h1>
                    <p className="text-gray-500">No category here, tags handle discovery.</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-8">
                    <h2 className="mb-1 text-lg font-semibold text-gray-900">Quest Details</h2>
                    <p className="mb-6 text-sm text-gray-500">Describe the task and when you need it done.</p>

                    <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Fix my Java Application" />
                    <TextArea label="Task Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={6} />
                    <Input label="Due Date" type="datetime-local" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
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
                        <Input
                            label="Reward"
                            value={form.reward}
                            onChange={(e) => setForm({ ...form, reward: e.target.value })}
                            placeholder="e.g. 5.00€ or Coffee"
                        />
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-8">
                        <h2 className="mb-1 text-lg font-semibold text-gray-900">Alternative Reward</h2>
                        <Input
                            label="Alternative reward (optional)"
                            value={form.alternativeReward}
                            onChange={(e) => setForm({ ...form, alternativeReward: e.target.value })}
                            placeholder="e.g. Notes exchange"
                        />
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

                <div className="flex items-center justify-end gap-4 rounded-2xl border border-gray-200 bg-white p-6">
                    <button onClick={() => navigate('/quests')} className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700">Cancel</button>
                    <button disabled={isSubmitting} onClick={handlePublish} className="rounded-lg bg-brand-primary px-6 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Publishing...' : editPostId ? 'Save Quest' : 'Publish Quest'}</button>
                </div>
            </div>
        </div>
    );
};

export default CreateQuest;
