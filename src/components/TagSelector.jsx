import React from 'react';

const TagSelector = ({ label, options = [], selectedTags = [], onToggle }) => {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <span className="text-sm font-medium text-gray-700">
                    {label}
                </span>
            )}
            <div className="flex flex-wrap gap-2">
                {options.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => onToggle(tag)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${isSelected
                                    ? 'bg-gray-200 text-gray-800'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {isSelected && (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 mr-1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" className={isSelected ? "hidden" : "block"} />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" className="hidden" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                                </svg>
                            )}
                            {!isSelected && (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 mr-1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            )}
                            {tag}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default TagSelector;
