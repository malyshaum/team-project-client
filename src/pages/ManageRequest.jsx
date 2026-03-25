import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { choosePerformer, deleteRequest, setRequestStatus } from '../store/tasksSlice';
import { showToast } from '../store/uiSlice';

const ManageRequest = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const requestId = Number(id);

    const request = useSelector((state) => state.tasks.myRequests.find((item) => item.id === requestId));
    const applicants = useSelector((state) => state.tasks.applicantsByRequestId[requestId] || []);

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex items-start gap-4">
                <button
                    onClick={() => navigate('/my-requests')}
                    className="mt-1 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </button>
                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-4xl font-bold text-gray-900">{request?.title || 'Post'}</h1>
                        <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-600">{request?.status || 'Open'}</span>
                    </div>
                    <p className="text-gray-500">Manage your {request?.type === 'service' ? 'service advertisement' : 'quest advertisement'} #{id}</p>
                </div>
            </div>

            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => {
                            dispatch(showToast({ title: 'Edit mode is mocked. Open the create form and re-save with new data.', variant: 'info' }));
                            navigate(request?.type === 'service' ? '/create-service' : '/create-quest');
                        }}
                        className="inline-flex items-center rounded-xl border border-gray-300 px-4 py-2.5 text-xl font-medium text-gray-800 hover:bg-gray-50"
                    >
                        <span className="mr-2">✎</span>
                        Edit Post
                    </button>
                    <button
                        onClick={() => {
                            dispatch(setRequestStatus({ requestId, status: 'Cancelled' }));
                            dispatch(showToast({ title: 'Post status changed to Cancelled.', variant: 'warning' }));
                        }}
                        className="inline-flex items-center rounded-xl border border-yellow-300 px-4 py-2.5 text-xl font-medium text-yellow-600 hover:bg-yellow-50"
                    >
                        <span className="mr-2">⊗</span>
                        Cancel Post
                    </button>
                    <button
                        onClick={() => {
                            dispatch(deleteRequest({ requestId }));
                            dispatch(showToast({ title: 'Post deleted from mock store.', variant: 'error' }));
                            navigate('/my-requests');
                        }}
                        className="inline-flex items-center rounded-xl border border-red-300 px-4 py-2.5 text-xl font-medium text-red-500 hover:bg-red-50"
                    >
                        <span className="mr-2">🗑</span>
                        Delete Post
                    </button>
                </div>
            </div>

            <h2 className="mb-4 text-4xl font-bold text-gray-900">Applicants ({applicants.length})</h2>

            <div className="space-y-4">
                {applicants.map((applicant) => (
                    <article key={applicant.id} className="rounded-2xl border border-gray-200 bg-white p-5">
                        <div className="mb-3 flex items-start justify-between gap-4">
                            <div className="flex gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg font-medium text-brand-secondary">
                                    {applicant.initials}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold text-gray-900">{applicant.name}</h3>
                                    <p className="text-gray-500">{applicant.major}</p>
                                    <p className="mt-1 text-gray-700">⭐ {applicant.rating} <span className="text-gray-500">({applicant.reviews} reviews)</span></p>
                                </div>
                            </div>
                            <p className="text-gray-500">{applicant.time}</p>
                        </div>

                        <p className="text-gray-600">{applicant.message}</p>

                        <div className="mt-4 rounded-xl bg-gray-50 p-4">
                            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">About Me</p>
                            <p className="mt-2 text-gray-700">{applicant.aboutMe}</p>
                            <p className="mt-3 text-sm text-gray-500">Contact info: {applicant.contactInfo}</p>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <button
                                onClick={() => {
                                    dispatch(choosePerformer({ requestId, applicantId: applicant.id }));
                                    dispatch(showToast({ title: `${applicant.name} selected as performer.`, variant: 'success' }));
                                    navigate('/my-requests');
                                }}
                                className="inline-flex items-center rounded-xl bg-gradient-to-r from-btn-start to-btn-end px-5 py-2.5 text-xl font-medium text-white"
                            >
                                <span className="mr-2">⚯</span>
                                Choose as Performer
                            </button>
                            <button
                                onClick={() => dispatch(showToast({ title: applicant.aboutMe, variant: 'info' }))}
                                className="rounded-xl border border-gray-300 px-5 py-2.5 text-xl font-medium text-gray-800 hover:bg-gray-50"
                            >
                                About Me
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default ManageRequest;
