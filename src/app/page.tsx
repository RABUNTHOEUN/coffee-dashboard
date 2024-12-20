import React from 'react'

const page = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-t-blue-500 border-solid" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}

export default page
