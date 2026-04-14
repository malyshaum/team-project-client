import React from 'react';

const SafetyTipCard = () => {
    return (
        <div className="bg-brand-highlight/30 rounded-2xl p-6 border border-brand-primary/10">
            <div className="flex gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-brand-primary shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">Safety Tip</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Confirm the reward, deadline, and task details clearly before starting. QuestBoard does not process payments, so users arrange payment terms directly.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SafetyTipCard;
