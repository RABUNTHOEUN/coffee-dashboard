"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import moment from 'moment';

const page = () => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        avatar: "",
    });

    useEffect(() => {
        const userInfo = localStorage.getItem("user");
        if (userInfo) {
            try {
                const parsedUser = JSON.parse(userInfo);
                setUser(parsedUser);
            } catch (error) {
                console.error("Failed to parse user info from localStorage:", error);
            }
        }
    }, []);
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
                    {/* <div className="flex flex-col">
                        <label className="text-sm text-gray-600 dark:text-gray-300">Phone</label>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">{user.phoneNumber || "N/A"}</p>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-600 dark:text-gray-300">Role</label>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">{user.role || "N/A"}</p>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-600 dark:text-gray-300">Joined On</label>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                            {user.createdAt ? moment(user.createdAt).format('MMM, DD, YYYY') : "N/A"}
                        </p>
                    </div> */}
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

export default page;
