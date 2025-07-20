import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'spinner' | 'dots' | 'pulse';
    text?: string;
    className?: string;
}

const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
};

const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    variant = 'spinner',
    text,
    className = '',
}) => {
    const renderSpinner = () => {
        switch (variant) {
            case 'dots':
                return (
                    <div className="flex space-x-1">
                        <div className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                        <div className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                        <div className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                    </div>
                );
            case 'pulse':
                return (
                    <div className={`${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse`}></div>
                );
            default:
                return (
                    <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-500`} />
                );
        }
    };

    return (
        <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
            {renderSpinner()}
            {text && (
                <p className={`${textSizes[size]} text-gray-600 font-medium animate-pulse`}>
                    {text}
                </p>
            )}
        </div>
    );
};

// Full page loading component
export const FullPageLoading: React.FC<{ text?: string }> = ({ text = 'Yuklanmoqda...' }) => {
    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <LoadingSpinner size="xl" text={text} />
            </div>
        </div>
    );
};

// Card loading component
export const CardLoading: React.FC<{ text?: string }> = ({ text = 'Ma\'lumotlar yuklanmoqda...' }) => {
    return (
        <div className="flex items-center justify-center min-h-[200px] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <LoadingSpinner size="lg" text={text} />
        </div>
    );
};

// Button loading component
export const ButtonLoading: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    return (
        <div className="flex items-center space-x-2">
            <LoadingSpinner size={size} variant="spinner" />
            <span>Jarayonda...</span>
        </div>
    );
};

// Table loading component
export const TableLoading: React.FC = () => {
    return (
        <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="w-20 h-8 bg-gray-200 rounded"></div>
                </div>
            ))}
        </div>
    );
};

export default LoadingSpinner; 