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

    let orders = [];

    try {
        const data = await fetch(`${baseUrl}/Orders`);
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
                Orders List
            </h1>
            <Table>
                <TableCaption>A list of your orders.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Order Status</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Delevery Address</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order: any, index: number) => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{order.userId}</TableCell>
                            <TableCell>{order.paymentId}</TableCell>
                            <TableCell>{order.orderStatus || "N/A"}</TableCell>
                            <TableCell>{order.totalAmount || 0}</TableCell>
                            <TableCell className='min-w-32'>
                                {order.orderDate ? moment(order.orderDate).format('MMM, DD, YYYY') : "N/A"}
                            </TableCell>
                            <TableCell>{order.deliveryAddress || "N/A"}</TableCell>
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
