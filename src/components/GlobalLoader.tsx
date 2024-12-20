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
            <div className="animate-spin inline-block w-16 h-16 border-4 border-t-4 border-gray-300 dark:border-gray-600 border-solid rounded-full">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>

    );
};

export default GlobalLoader;
