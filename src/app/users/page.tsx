import React from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import ProductPagination from '@/components/pagination/page';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { baseUrl } from '@/utils/config';
import moment from 'moment';

const page = async () => {

    let users = [];

    try {
        const data = await fetch(`${baseUrl}/Users`);
        if (!data.ok) {
            throw new Error(`HTTP error! status: ${data.status}`);
        }
        users = await data.json();
    } catch (error) {
        console.error("Failed to fetch Users:", error);
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
                    {users.map((user: any, index: number) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{user.firstName}</TableCell>
                            <TableCell>{user.lastName}</TableCell>
                            <TableCell>{user.email || "N/A"}</TableCell>
                            <TableCell>{user.role || "N/A"}</TableCell>
                            <TableCell>{user.phoneNumber || "N/A"}</TableCell>
                            <TableCell className='min-w-32'>
                                {user.createdAt ? moment(user.createdAt).format('MMM, DD, YYYY') : "N/A"}
                            </TableCell>
                            <TableCell>
                                <div className='flex gap-2'>
                                    <Button variant="outline" className='hover:text-blue-600'><Edit /></Button>
                                    <Button variant="outline" className='hover:text-red-600'><Trash2 /></Button>
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

export default page;
