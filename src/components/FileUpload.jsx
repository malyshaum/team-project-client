import React, { useRef } from 'react';

const FileUpload = ({ label, id, onChange, accept = "image/*", className = "", fileName = '', hint = '', ...props }) => {
    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        if (onChange) {
            onChange(e);
        }
    };

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={id} className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <div
                onClick={handleClick}
                className={`border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors ${className}`}
            >
                <input
                    type="file"
                    id={id}
                    ref={fileInputRef}
                    className="hidden"
                    accept={accept}
                    onChange={handleFileChange}
                    {...props}
                />
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-2 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                </div>
                <span className="text-sm text-gray-500 font-medium">Upload Image</span>
                {fileName ? (
                    <span className="mt-2 max-w-full truncate px-4 text-center text-xs font-medium text-gray-700">{fileName}</span>
                ) : (
                    <span className="mt-2 px-4 text-center text-xs text-gray-400">{hint || 'One image per section'}</span>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
