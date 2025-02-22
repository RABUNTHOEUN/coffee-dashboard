"use client"
import { LoaderIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Loading() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Only runs on the client
  }, []);

  if (!isClient) return null; // Prevent mismatch during SSR

  return (
    <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
      <div className="flex items-center space-x-2">
        {/* Loader Icon with Spin Animation */}
        <LoaderIcon className="animate-spin text-gray-600 dark:text-gray-300" size={24} />
        {/* Loading Text */}
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  );
}
