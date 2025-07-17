import React, { useRef } from 'react';

const UploadButton = ({
    onFileSelect,
    acceptedTypes = '.pdf,.txt,.doc,.docx',
    isLoading = false,
    disabled = false,
    className = '',
    children,
    maxSizeInMB = 10
}) => {
    const fileInputRef = useRef(null);

    const handleClick = () => {
        if (!disabled && !isLoading) {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check file size
            const fileSizeInMB = file.size / (1024 * 1024);
            if (fileSizeInMB > maxSizeInMB) {
                alert(`File size must be less than ${maxSizeInMB}MB`);
                return;
            }

            // Check file type
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            const acceptedExtensions = acceptedTypes.split(',').map(type => type.trim().toLowerCase());

            if (!acceptedExtensions.includes(fileExtension)) {
                alert(`Please select a valid file type: ${acceptedTypes}`);
                return;
            }

            onFileSelect(file);
        }

        // Reset the input so the same file can be selected again if needed
        event.target.value = '';
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={acceptedTypes}
                className="hidden"
            />

            <button
                type="button"
                onClick={handleClick}
                disabled={disabled || isLoading}
                className={`
          relative overflow-hidden
          inline-flex items-center justify-center
          px-6 py-3 border-2 border-dashed border-blue-300
          rounded-lg font-medium
          transition-all duration-200
          ${disabled || isLoading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-400 hover:shadow-md cursor-pointer'
                    }
          ${className}
        `}
            >
                {isLoading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Uploading...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {children || 'Choose File'}
                    </>
                )}
            </button>
        </>
    );
};

export default UploadButton; 