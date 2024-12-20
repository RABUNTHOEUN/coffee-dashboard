// context/loadingContext.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the context type
interface LoadingContextType {
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

// Create the context
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Create a provider component
export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

// Custom hook to use the loading context
export const useLoading = (): LoadingContextType => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};
