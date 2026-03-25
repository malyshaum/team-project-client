import React from 'react';
import { Outlet } from 'react-router-dom';
import SocialProof from '../components/SocialProof';
import ToastStack from '../components/ToastStack';

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex">
            <ToastStack />
            {/* Left Side - Brand & Hero */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-hero-start to-hero-end relative overflow-hidden flex-col justify-between p-12 text-white">
                {/* Decorative Circle */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-500/20 blur-3xl"></div>
                </div>

                {/* Brand */}
                <div className="relative z-10 flex items-center space-x-2">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight">QuestBoard</span>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-lg mb-12">
                    <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                        Connect with fellow students to get things done.
                    </h1>
                    <p className="text-indigo-100 text-lg mb-8">
                        Post tasks, earn rewards, and build your campus community.
                    </p>
                    <SocialProof />
                </div>

                {/* Footer */}
                <div className="relative z-10 text-indigo-200 text-sm">
                    Trusted by students at 50+ universities
                </div>
            </div>

            {/* Right Side - Form Content */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
                <div className="max-w-md w-full">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
