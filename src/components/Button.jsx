import React from 'react';

const Button = ({ children, variant = 'primary', className = '', icon: Icon, ...props }) => {
    const baseStyles = "w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200";

    const variants = {
        primary: "text-white bg-gradient-to-r from-btn-start to-btn-end hover:opacity-90 shadow-lg shadow-indigo-500/30 border-none",
        outline: "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-brand-primary",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {Icon && <Icon className="mr-2 h-5 w-5" />}
            {children}
        </button>
    );
};

export default Button;
