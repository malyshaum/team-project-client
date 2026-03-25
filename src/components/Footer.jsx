import React from 'react';

const Footer = () => {
    return (
        <footer className="mt-auto border-t border-gray-200 bg-white py-6">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-sm text-gray-500 sm:px-6 lg:flex-row lg:px-8">
                <p>QuestBoard is task-focused: quests, services, ratings, and reviews only.</p>
                <p>No messaging or notification center in this version.</p>
            </div>
        </footer>
    );
};

export default Footer;
