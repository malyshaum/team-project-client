import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dismissToast } from '../store/uiSlice';

const variantStyles = {
    info: 'border-blue-200 bg-blue-50 text-blue-800',
    success: 'border-green-200 bg-green-50 text-green-800',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    error: 'border-red-200 bg-red-50 text-red-800'
};

const ToastStack = () => {
    const dispatch = useDispatch();
    const toasts = useSelector((state) => state.ui.toasts);

    React.useEffect(() => {
        if (!toasts.length) return undefined;
        const timers = toasts.map((toast) =>
            setTimeout(() => dispatch(dismissToast({ id: toast.id })), 2600)
        );
        return () => timers.forEach((timer) => clearTimeout(timer));
    }, [toasts, dispatch]);

    if (!toasts.length) return null;

    return (
        <div className="pointer-events-none fixed right-4 top-20 z-[100] space-y-2">
            {toasts.slice(-4).map((toast) => (
                <div
                    key={toast.id}
                    className={`pointer-events-auto min-w-[240px] rounded-lg border px-3 py-2 text-sm font-medium shadow ${variantStyles[toast.variant] || variantStyles.info}`}
                >
                    {toast.title}
                </div>
            ))}
        </div>
    );
};

export default ToastStack;
