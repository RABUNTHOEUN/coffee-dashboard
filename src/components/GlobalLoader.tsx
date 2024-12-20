// src/components/GlobalLoader.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const GlobalLoader = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleStart = () => setLoading(true);
        const handleStop = () => setLoading(false);

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleStop);
        router.events.on('routeChangeError', handleStop);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleStop);
            router.events.off('routeChangeError', handleStop);
        };
    }, [router]);

    if (!loading) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-50 dark:bg-gray-900 opacity-70 flex justify-center items-center z-50">
            <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-t-blue-500 dark:border-t-indigo-500 border-solid" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};

export default GlobalLoader;
