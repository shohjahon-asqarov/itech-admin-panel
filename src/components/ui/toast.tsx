import React from 'react';
import { toast, ToastContainer, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// Custom toast styles
const toastStyles = {
    success: {
        style: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
            border: 'none',
        },
        icon: <CheckCircle className="w-5 h-5" />,
    },
    error: {
        style: {
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
            border: 'none',
        },
        icon: <XCircle className="w-5 h-5" />,
    },
    warning: {
        style: {
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
            border: 'none',
        },
        icon: <AlertCircle className="w-5 h-5" />,
    },
    info: {
        style: {
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
            border: 'none',
        },
        icon: <Info className="w-5 h-5" />,
    },
};

// Custom toast functions
export const showToast = {
    success: (message: string, options?: ToastOptions) => {
        toast.success(message, {
            ...toastStyles.success,
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            ...options,
        });
    },
    error: (message: string, options?: ToastOptions) => {
        toast.error(message, {
            ...toastStyles.error,
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            ...options,
        });
    },
    warning: (message: string, options?: ToastOptions) => {
        toast.warning(message, {
            ...toastStyles.warning,
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            ...options,
        });
    },
    info: (message: string, options?: ToastOptions) => {
        toast.info(message, {
            ...toastStyles.info,
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            ...options,
        });
    },
};

// Custom Toast Container
export const CustomToastContainer: React.FC = () => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastClassName="!p-4 !min-h-0 !rounded-xl !shadow-lg"
            closeButton={({ closeToast }) => (
                <button
                    onClick={closeToast}
                    className="text-white hover:text-gray-200 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        />
    );
};

export default showToast; 