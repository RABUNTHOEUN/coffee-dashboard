"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';  // Assuming you have a custom Button component
import { Edit } from 'lucide-react';  // Assuming you are using lucide-react icons

// Define the user type for better type safety
interface User {
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
}

const Profile: React.FC = () => {
    // Set initial user state with default values
    const [user, setUser] = useState<User>({
        firstName: "",
        lastName: "",
        email: "",
        avatar: "",
    });

    // Fetch user data from localStorage on component mount
    useEffect(() => {
        const userInfo = localStorage.getItem("user");
        if (userInfo) {
            try {
                const parsedUser = JSON.parse(userInfo);
                // Ensure the parsed data matches the expected structure
                if (parsedUser && parsedUser.firstName && parsedUser.lastName && parsedUser.email) {
                    setUser(parsedUser);  // Set user data in state
                } else {
                    console.error("Invalid user data structure in localStorage.");
                }
            } catch (error) {
                console.error("Failed to parse user info from localStorage:", error);
            }
        }
    }, []);  // Empty dependency array means this effect runs once when the component mounts

    return (
        <div>
            <h1 className="text-2xl font-bold text-start text-gray-900 dark:text-white ml-4">
                Profile - {user.firstName} {user.lastName}
            </h1>
            <div className="mt-4 p-6 bg-white dark:bg-gray-900 shadow rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-600 dark:text-gray-300">First Name</label>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">{user.firstName}</p>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-600 dark:text-gray-300">Last Name</label>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">{user.lastName}</p>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-600 dark:text-gray-300">Email</label>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">{user.email || "N/A"}</p>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-600 dark:text-gray-300">Avatar</label>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">{user.avatar || "N/A"}</p>
                    </div>
                </div>

                <div className="mt-6 flex gap-2">
                    <Button variant="outline" className="hover:text-blue-600">
                        <Edit className="mr-2" />
                        Edit Profile
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
