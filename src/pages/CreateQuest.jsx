import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import FileUpload from '../components/FileUpload';
import TagSelector from '../components/TagSelector';
import { addQuest } from '../store/tasksSlice';
import { showToast } from '../store/uiSlice';

const TAGS = ['Coding', 'Writing', 'Errands', 'Design', 'Tutoring', 'Homework', 'Moving', 'Urgent'];

const UploadCard = ({ title }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="mb-1 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mb-4 text-sm text-gray-500">Optional images</p>
        <FileUpload className="h-32 w-full p-4" />
    </div>
);

const CreateQuest = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const profile = useSelector((state) => state.profile.general);
    const [form, setForm] = useState({
        title: '',
        description: '',
        dueDate: '',
        reward: '',
        alternativeReward: ''
    });
    const [selectedTags, setSelectedTags] = useState([]);

    const handlePublish = () => {
        if (!form.title.trim() || !form.description.trim() || !form.reward.trim()) {
            dispatch(showToast({ title: 'Fill title, description, and main reward before publishing.', variant: 'warning' }));
            return;
        }
        dispatch(
            addQuest({
                title: form.title,
                description: form.description,
                dueDate: form.dueDate,
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
        dispatch(showToast({ title: 'Quest post published to mock store.', variant: 'success' }));
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
                    <Input label="Due Date" type="text" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} placeholder="Tomorrow / Dec 15 / Flexible" />
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-8">
                    <h2 className="mb-1 text-lg font-semibold text-gray-900">Tags</h2>
                    <TagSelector
                        options={TAGS}
                        selectedTags={selectedTags}
                        onToggle={(tag) => setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]))}
                    />
                </div>

                <UploadCard title="Description Images" />

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

                <div className="grid gap-6 md:grid-cols-2">
                    <UploadCard title="Primary Reward Images" />
                    <UploadCard title="Alternative Reward Images" />
                </div>

                <div className="flex items-center justify-end gap-4 rounded-2xl border border-gray-200 bg-white p-6">
                    <button onClick={() => navigate('/quests')} className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700">Cancel</button>
                    <button onClick={handlePublish} className="rounded-lg bg-brand-primary px-6 py-2.5 text-sm font-medium text-white">Publish Quest</button>
                </div>
            </div>
        </div>
    );
};

export default CreateQuest;
