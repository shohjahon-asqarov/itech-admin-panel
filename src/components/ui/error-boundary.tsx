import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // barcha console.error larni olib tashla
        this.setState({ error, errorInfo });
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
                        <CardHeader className="text-center pb-4">
                            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>
                            <CardTitle className="text-xl font-bold text-gray-900">
                                Xatolik yuz berdi
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                                Kechirasiz, biror narsa noto'g'ri ketdi. Iltimos, qaytadan urinib ko'ring.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                    <p className="text-sm font-medium text-red-800 mb-2">Xatolik ma'lumotlari:</p>
                                    <p className="text-xs text-red-600 font-mono break-all">
                                        {this.state.error.message}
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    onClick={this.handleRetry}
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Qaytadan urinish
                                </Button>
                                <Button
                                    onClick={this.handleGoHome}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    <Home className="w-4 h-4 mr-2" />
                                    Bosh sahifa
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

// Hook for functional components
export const useErrorHandler = () => {
    const handleError = (error: Error, errorInfo?: any) => {
        // You can send error to your error reporting service here
    };

    return { handleError };
};

// Error display component
export const ErrorDisplay: React.FC<{
    error: Error;
    onRetry?: () => void;
    onGoHome?: () => void;
}> = ({ error, onRetry, onGoHome }) => {
    return (
        <div className="p-6 bg-red-50 rounded-xl border border-red-200">
            <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800 mb-2">
                        Xatolik yuz berdi
                    </h3>
                    <p className="text-sm text-red-700 mb-3">
                        {error.message || 'Noma\'lum xatolik yuz berdi'}
                    </p>
                    <div className="flex space-x-2">
                        {onRetry && (
                            <Button
                                onClick={onRetry}
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                <RefreshCw className="w-3 h-3 mr-1" />
                                Qaytadan urinish
                            </Button>
                        )}
                        {onGoHome && (
                            <Button
                                onClick={onGoHome}
                                size="sm"
                                variant="outline"
                            >
                                <Home className="w-3 h-3 mr-1" />
                                Bosh sahifa
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorBoundary; 