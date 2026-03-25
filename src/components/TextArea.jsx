import React from 'react';

const TextArea = ({ label, id, error, className = '', ...props }) => {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label htmlFor={id} className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <textarea
                id={id}
                className={`px-4 py-3 rounded-xl border bg-gray-50 text-gray-900 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all resize-none min-h-[120px] ${error ? 'border-red-500' : 'border-gray-200'
                    }`}
                {...props}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};

export default TextArea;
