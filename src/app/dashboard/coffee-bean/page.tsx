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
    title: "Boffee Bean",
    description: "Boffee Bean",
};

interface CoffeeBean {
    id: string | number;
    name: string;
    origin?: string;
    roastLevel?: string;
    pricePerKg?: number;
    stockQuantity?: number;
}


const page = async () => {

    let coffee_beans = [];

    try {
        const data = await fetch(`${baseUrl}/CoffeeBean`);
        if (!data.ok) {
            throw new Error(`HTTP error! status: ${data.status}`);
        }
        coffee_beans = await data.json();
    } catch (error) {
        console.error("Failed to fetch coffee bean:", error);
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-start text-gray-900 dark:text-white ml-4">
                CoffeeBean List
            </h1>
            <Table>
                <TableCaption>A list of your products.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Origin</TableHead>
                        <TableHead>RoastLevel</TableHead>
                        <TableHead>PricePerKg</TableHead>
                        <TableHead>StockQuantity</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {coffee_beans.map((coffee_bean: CoffeeBean, index: number) => (
                        <TableRow key={coffee_bean.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{coffee_bean.name}</TableCell>
                            <TableCell>{coffee_bean.origin || "N/A"}</TableCell>
                            <TableCell>{coffee_bean.roastLevel || "N/A"}</TableCell>
                            <TableCell>{coffee_bean.pricePerKg || 0}</TableCell>
                            <TableCell>{coffee_bean.stockQuantity || 0}</TableCell>
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
