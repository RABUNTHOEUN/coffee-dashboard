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
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Order Item",
    description: "Order Item",
};

const page = async () => {

    let orders = [];

    try {
        const data = await fetch(`${baseUrl}/OrderItem`);
        if (!data.ok) {
            throw new Error(`HTTP error! status: ${data.status}`);
        }
        orders = await data.json();
    } catch (error) {
        console.error("Failed to fetch orders:", error);
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-start text-gray-900 dark:text-white ml-4">
                Order Items List
            </h1>
            <Table>
                <TableCaption>A list of your order items.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order: any, index: number) => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{order.orderId}</TableCell>
                            <TableCell>{order.productId}</TableCell>
                            <TableCell>{order.quantity || 0 }</TableCell>
                            <TableCell>{order.price || 0}</TableCell>
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
