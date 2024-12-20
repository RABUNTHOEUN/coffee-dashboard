// src/components/Loading.tsx
import React from 'react';

const Loading = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-50 dark:bg-gray-900 opacity-70 flex justify-center items-center z-50">
            <div className="animate-spin inline-block w-16 h-16 border-4 border-t-4 border-gray-300 dark:border-gray-600 border-solid rounded-full">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};

export default Loading;
