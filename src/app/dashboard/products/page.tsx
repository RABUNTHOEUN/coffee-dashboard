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

const page = async () => {
    
    let products = [];

    try {
        const data = await fetch(`${baseUrl}/Products`);
        if (!data.ok) {
            throw new Error(`HTTP error! status: ${data.status}`);
        }
        products = await data.json();
    } catch (error) {
        console.error("Failed to fetch products:", error);
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-start text-gray-900 dark:text-white ml-4">
                Products List
            </h1>
            <Table>
                <TableCaption>A list of your products.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product: any, index: number) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.description || "N/A"}</TableCell>
                            <TableCell>{product.price || 0}</TableCell>
                            <TableCell>{product.categoryName || 0}</TableCell>
                            <TableCell>
                                <div className='flex gap-2'>
                                    <Button variant="outline" className='hover:text-blue-600'><Edit/></Button>
                                    <Button variant="outline" className='hover:text-red-600'><Trash2/></Button>
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
