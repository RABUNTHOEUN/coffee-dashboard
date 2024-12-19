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
    title: "Inventory",
    description: "Inventory",
};

const page = async () => {

    let inventories = [];

    try {
        const data = await fetch(`${baseUrl}/Inventory`);
        if (!data.ok) {
            throw new Error(`HTTP error! status: ${data.status}`);
        }
        inventories = await data.json();
    } catch (error) {
        console.error("Failed to fetch inventories:", error);
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-start text-gray-900 dark:text-white ml-4">
                Inventory List
            </h1>
            <Table>
                <TableCaption>A list of your Inventories.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Stock Quantity</TableHead>
                        <TableHead>RestockDate</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {inventories.map((inventory: any, index: number) => (
                        <TableRow key={inventory.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{inventory.productId || "N/A"}</TableCell>
                            <TableCell
                                className={
                                    inventory.stockQuantity < 10
                                        ? "text-red-500 dark:text-red-400"
                                        : "text-gray-900 dark:text-white"
                                }
                            >
                                {inventory.stockQuantity !== undefined && inventory.stockQuantity !== null
                                    ? inventory.stockQuantity
                                    : "N/A"}
                            </TableCell>
                            <TableCell className='min-w-32'>
                                {inventory.restockDate ? moment(inventory.restockDate).format('MMM, DD, YYYY') : "N/A"}
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
