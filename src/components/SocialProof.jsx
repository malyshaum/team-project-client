import React from 'react';

const SocialProof = () => {
    return (
        <div className="flex items-center space-x-4">
            <div className="flex -space-x-2 overflow-hidden">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`inline-block h-10 w-10 rounded-full ring-2 ring-brand-primary bg-indigo-${i * 100 + 200} flex items-center justify-center text-xs font-bold text-white relative z-${10 - i}`}>
                        <img
                            src={`https://i.pravatar.cc/100?img=${i + 10}`}
                            alt="User"
                            className="h-full w-full rounded-full object-cover"
                        />
                    </div>
                ))}
            </div>
            <div className="text-white">
                <p className="text-sm font-medium">2,500+ students already joined</p>
            </div>
        </div>
    );
};

export default SocialProof;
