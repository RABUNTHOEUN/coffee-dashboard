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
import { Delete, Edit, Trash2 } from 'lucide-react';
import { baseUrl } from '@/utils/config';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Category",
    description: "Category",
};

const page = async () => {

    let categories = [];

    try {
        const data = await fetch(`${baseUrl}/Categories`);
        if (!data.ok) {
            throw new Error(`HTTP error! status: ${data.status}`);
        }
        categories = await data.json();
    } catch (error) {
        console.error("Failed to fetch categories:", error);
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-start text-gray-900 dark:text-white ml-4">
                Category List
            </h1>
            <Table>
                <TableCaption>A list of your categories.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Products Count</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map((category: any, index: number) => (
                        <TableRow key={category.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{category.name}</TableCell>
                            <TableCell>{category.description || "N/A"}</TableCell>
                            <TableCell>{category.productCount || 0}</TableCell>
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
