import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import FileUpload from '../components/FileUpload';
import TagSelector from '../components/TagSelector';
import Button from '../components/Button';
import { addService } from '../store/tasksSlice';
import { showToast } from '../store/uiSlice';

const PROPOSED_TAGS = ['Coding', 'Writing', 'Errands', 'Design', 'Tutoring', 'Moving', 'Cleaning', 'Repairs'];

const UploadCard = ({ title }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="mb-1 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mb-4 text-sm text-gray-500">Optional images</p>
        <FileUpload className="h-32 w-full p-4" />
    </div>
);

const CreateService = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const profile = useSelector((state) => state.profile.general);
    const [selectedTags, setSelectedTags] = useState([]);
    const [form, setForm] = useState({
        title: '',
        description: '',
        reward: '',
        alternativeReward: ''
    });

    const handlePublish = () => {
        if (!form.title.trim() || !form.description.trim() || !form.reward.trim()) {
            dispatch(showToast({ title: 'Fill title, description, and main reward before publishing.', variant: 'warning' }));
            return;
        }
        dispatch(
            addService({
                title: form.title,
                description: form.description,
                reward: form.reward,
                alternativeReward: form.alternativeReward || 'Optional reward',
                tags: selectedTags,
                username: profile.username,
                studyProgram: profile.studyProgram,
                yearOfStudy: profile.yearOfStudy,
                aboutMe: profile.bio,
                contactInfo: profile.contactInfo
            })
        );
        navigate('/my-requests');
        dispatch(showToast({ title: 'Service post published to mock store.', variant: 'success' }));
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
                    <TagSelector
                        options={PROPOSED_TAGS}
                        selectedTags={selectedTags}
                        onToggle={(tag) => setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]))}
                    />
                </div>

                <UploadCard title="Description Images" />

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

                <div className="grid gap-6 md:grid-cols-2">
                    <UploadCard title="Primary Reward Images" />
                    <UploadCard title="Alternative Reward Images" />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <Button variant="outline" onClick={() => navigate('/provider')} className="w-auto px-6">Cancel</Button>
                    <Button onClick={handlePublish} className="w-auto px-8 py-2.5">Publish Service</Button>
                </div>
            </div>
        </div>
    );
};

export default CreateService;
