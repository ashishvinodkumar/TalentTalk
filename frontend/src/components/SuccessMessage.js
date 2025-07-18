import React from 'react';

const SuccessMessage = ({ message, onDismiss, autoHide = true }) => {
    React.useEffect(() => {
        if (autoHide && message) {
            const timer = setTimeout(() => {
                if (onDismiss) onDismiss();
            }, 5000); // Auto-hide after 5 seconds

            return () => clearTimeout(timer);
        }
    }, [message, autoHide, onDismiss]);

    if (!message) return null;

    return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 animate-fade-in">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-green-800">Success</h3>
                    <div className="mt-1 text-sm text-green-700">
                        {message}
                    </div>
                </div>
                {onDismiss && (
                    <div className="ml-4 flex-shrink-0">
                        <button
                            type="button"
                            className="bg-green-100 rounded-md p-1.5 text-green-500 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                            onClick={onDismiss}
                        >
                            <span className="sr-only">Dismiss</span>
                            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuccessMessage; 