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
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Staff Shift",
    description: "Staff Shift",
};

interface User{
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

interface StaffShift {
    shiftId: string | number;
    userId: string | number;
    startTime?: Date | string;
    endTime?: Date | string;
    shiftDate?: Date | string;
    user?: User;
}




const page = async () => {

    let staffshifts = [];

    try {
        const data = await fetch(`${baseUrl}/StaffShift`);
        if (!data.ok) {
            throw new Error(`HTTP error! status: ${data.status}`);
        }
        staffshifts = await data.json();
        console.log(staffshifts);

    } catch (error) {
        console.error("Failed to fetch staffshifts:", error);
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-start text-gray-900 dark:text-white ml-4">
                Staff Shift List
            </h1>
            <Table>
                <TableCaption>A list of your staffshifts.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>End Time</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>User Email</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {staffshifts.map((staffshift: StaffShift, index: number) => (
                        <TableRow key={staffshift.shiftId}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{staffshift.userId}</TableCell>
                            <TableCell className="min-w-32">
                                {staffshift.startTime ? moment(staffshift.startTime).format("MMM, DD, YYYY") : "N/A"}
                            </TableCell>
                            <TableCell className="min-w-32">
                                {staffshift.endTime ? moment(staffshift.endTime).format("MMM, DD, YYYY") : "N/A"}
                            </TableCell>
                            <TableCell className="min-w-32">
                                {staffshift.shiftDate ? moment(staffshift.shiftDate).format("MMM, DD, YYYY") : "N/A"}
                            </TableCell>
                            <TableCell>
                                {staffshift.user
                                    ? `${staffshift.user.firstName} ${staffshift.user.lastName}`
                                    : "N/A"}
                            </TableCell>
                            <TableCell>
                                {staffshift.user
                                    ? `${staffshift.user.email}`
                                    : "N/A"}
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="hover:text-blue-600"><Edit /></Button>
                                    <Button variant="outline" className="hover:text-red-600"><Trash2 /></Button>
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
