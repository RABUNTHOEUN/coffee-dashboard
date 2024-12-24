"use client"
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Loading() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Only runs on the client
  }, []);

  if (!isClient) return null; // Prevent mismatch during SSR

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin h-16 w-16 text-blue-500 dark:text-blue-300" />
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  );
}
