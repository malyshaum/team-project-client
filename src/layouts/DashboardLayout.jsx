import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ToastStack from '../components/ToastStack';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <Header />
            <ToastStack />
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default DashboardLayout;
