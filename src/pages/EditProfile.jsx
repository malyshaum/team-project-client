import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import Button from '../components/Button';
import { updateMyProfile } from '../store/profileSlice';
import { logoutUser } from '../store/authSlice';
import { showToast } from '../store/uiSlice';

const EditProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const general = useSelector((state) => state.profile.general);
    const [generalForm, setGeneralForm] = useState(general);

    const handleSave = async () => {
        try {
            await dispatch(updateMyProfile(generalForm)).unwrap();
            dispatch(showToast({ title: 'Profile updated.', variant: 'success' }));
            navigate('/profile');
        } catch (error) {
            dispatch(showToast({ title: error || 'Failed to update profile.', variant: 'error' }));
        }
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
    };

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
                    <p className="text-sm text-gray-500">Only the fields that are actually used across task views are kept here.</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <h2 className="mb-1 text-lg font-semibold text-gray-900">Public Info Inside Posts</h2>
                    <p className="mb-6 text-sm text-gray-500">This is what other users see on your quest and service posts.</p>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Input
                            label="Username"
                            value={generalForm.username}
                            onChange={(e) => setGeneralForm({ ...generalForm, username: e.target.value })}
                        />
                        <Input
                            label="University Email"
                            type="email"
                            value={generalForm.email}
                            onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
                        />
                        <Input
                            label="University"
                            value={generalForm.university}
                            onChange={(e) => setGeneralForm({ ...generalForm, university: e.target.value })}
                        />
                        <Input
                            label="Study Program"
                            value={generalForm.studyProgram}
                            onChange={(e) => setGeneralForm({ ...generalForm, studyProgram: e.target.value })}
                        />
                        <Input
                            label="Year of Study"
                            value={generalForm.yearOfStudy}
                            onChange={(e) => setGeneralForm({ ...generalForm, yearOfStudy: e.target.value })}
                        />
                        <Input
                            label="Contact Info"
                            value={generalForm.contactInfo}
                            onChange={(e) => setGeneralForm({ ...generalForm, contactInfo: e.target.value })}
                            placeholder="Telegram, email, phone, Instagram link..."
                        />
                    </div>

                    <div className="mt-4">
                        <TextArea
                            label="About Me"
                            value={generalForm.bio}
                            onChange={(e) => setGeneralForm({ ...generalForm, bio: e.target.value })}
                            rows={5}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4 pb-8">
                    <button
                        onClick={handleLogout}
                        className="flex items-center rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                        Log out
                    </button>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={() => navigate(-1)} className="w-auto px-6">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} className="w-auto px-6">
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
