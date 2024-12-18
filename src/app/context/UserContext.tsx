"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        // Check local storage or session for login state
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            setIsAuthenticated(true);
        }
    }, []);

    const login = () => {
        // Set user as authenticated (you can replace with your own logic)
        localStorage.setItem('user', JSON.stringify({ username: 'user' }));
        setIsAuthenticated(true);
    };

    const logout = () => {
        // Remove user from storage and set to false
        localStorage.removeItem('user');
        setIsAuthenticated(false);
    };

    return (
        <UserContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = React.useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};
