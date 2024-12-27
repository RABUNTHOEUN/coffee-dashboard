"use client";

import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import ProductPagination from "@/components/pagination/page";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { baseUrl } from "@/utils/config";
import moment from "moment";
import Link from "next/link";
import { toast } from "sonner";

interface User {
    id: string | number;
    firstName: string;
    lastName: string;
    email?: string;
    role?: string;
    phoneNumber?: string;
    createdAt?: Date | string;
}

const Page = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${baseUrl}/Users`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
                toast.error("Failed to fetch users.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Handle user delete
    const handleDelete = async (id: string | number) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`${baseUrl}/Users/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`Failed to delete user with ID ${id}`);
            }

            toast.success("User deleted successfully!", {
                style: {
                    color: 'green'
                }
            });
            // Remove the deleted user from the state
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return <p>Loading users...</p>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-start text-gray-900 dark:text-white ml-4">
                Users List
            </h1>
            <Table>
                <TableCaption>A list of your Users.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Create At</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user: User, index: number) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{user.firstName}</TableCell>
                            <TableCell>{user.lastName}</TableCell>
                            <TableCell>{user.email || "N/A"}</TableCell>
                            <TableCell>{user.role || "N/A"}</TableCell>
                            <TableCell>{user.phoneNumber || "N/A"}</TableCell>
                            <TableCell className="min-w-32">
                                {user.createdAt
                                    ? moment(user.createdAt).format("MMM, DD, YYYY")
                                    : "N/A"}
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Link href={`/dashboard/users/${user.id}`}>
                                        <Button variant="outline" className="hover:text-blue-600">
                                            <Edit />
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={() => handleDelete(user.id)}
                                        variant="outline"
                                        className="hover:text-red-600"
                                        disabled={isDeleting}
                                    >
                                        <Trash2 />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <ProductPagination />
        </div>
    );
};

export default Page;
