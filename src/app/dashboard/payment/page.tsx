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

    let payments = [];

    try {
        const data = await fetch(`${baseUrl}/Payment`);
        if (!data.ok) {
            throw new Error(`HTTP error! status: ${data.status}`);
        }
        payments = await data.json();
    } catch (error) {
        console.error("Failed to fetch Payments:", error);
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-start text-gray-900 dark:text-white ml-4">
                Payment List
            </h1>
            <Table>
                <TableCaption>A list of your Payments.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment Date</TableHead>
                        <TableHead>Status</TableHead>
                        {/* <TableHead>Items</TableHead> */}
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {payments.map((payment: any, index: number) => (
                        <TableRow key={payment.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{payment.orderId}</TableCell>
                            <TableCell>{payment.paymentMethod}</TableCell>
                            <TableCell>{payment.amount || 0}</TableCell>
                            <TableCell className='min-w-32'>
                                {payment.paymentDate ? moment(payment.paymentDate).format('MMM, DD, YYYY') : "N/A"}
                            </TableCell>
                            <TableCell>{payment.order?.orderStatus || "N/A"}</TableCell>
                            {/* <TableCell>{payment.orderItems?.quantity || "N/A"}</TableCell> */}
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
