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
import { CircleCheck, CircleX, Edit, Trash2 } from 'lucide-react';
import { baseUrl } from '@/utils/config';
import moment from 'moment';

const page = async () => {

    let discounts = [];

    try {
        const data = await fetch(`${baseUrl}/Discount`);
        if (!data.ok) {
            throw new Error(`HTTP error! status: ${data.status}`);
        }
        discounts = await data.json();
    } catch (error) {
        console.error("Failed to fetch discounts:", error);
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-start text-gray-900 dark:text-white ml-4">
                Discounts List
            </h1>
            <Table>
                <TableCaption>A list of your Discounts.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Discount Percentage</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {discounts.map((discount: any, index: number) => (
                        <TableRow key={discount.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{discount.code}</TableCell>
                            <TableCell>{discount.description || "N/A"}</TableCell>
                            <TableCell>{discount.discountPercentage || 0}</TableCell>
                            <TableCell className='min-w-32'>
                                {discount.startDate ? moment(discount.startDate).format('MMM, DD, YYYY') : "N/A"}
                            </TableCell>
                            <TableCell className='min-w-32'>
                                {discount.endDate ? moment(discount.endDate).format('MMM, DD, YYYY') : "N/A"}
                            </TableCell>
                            <TableCell>{discount.active ? (
                                <span className="text-green-500"><CircleCheck /></span>
                            ) : (
                                <span className="text-red-500"><CircleX /></span>
                            )}</TableCell>
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
