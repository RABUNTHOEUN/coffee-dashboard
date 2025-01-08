'use client';
import React, { useState, useEffect } from 'react';
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
import Link from 'next/link';
import { toast } from "sonner"



interface Category {
    id: string | number;
    name: string;
    description?: string;
    productCount?: number;
}

const CategoryPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);  // Prevent multiple clicks during deletion

    // Fetch categories when the component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${baseUrl}/Categories`);
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);  // Only run on component mount

    // Handle category deletion
    const handleDelete = async (id: string | number) => {
        if (isDeleting) return;  // Prevent multiple clicks
    
        // Show confirmation dialog using Sonner
        const confirmed = window.confirm('Are you sure you want to delete this category?');
        if (!confirmed) return;  // If not confirmed, exit the function
    
        setIsDeleting(true);  // Start the deletion process
        try {
            const response = await fetch(`${baseUrl}/Categories/${id}`, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                toast.success('Category deleted successfully',{
                    style: {
                        color: "green",
                    },
                });
                setCategories(categories.filter(category => category.id !== id));  // Remove from state
            } else {
                toast.error('Failed to delete category',{
                    style: {
                        color: "red",
                    },
                });
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('An error occurred while deleting the category',{
                style: {
                    color: "red",
                },
            });
        } finally {
            setIsDeleting(false);  // Reset deleting state
        }
    };


    return (
        <div suppressHydrationWarning>
            <div className='flex items-center justify-between'>
                <h1 className="text-2xl font-bold text-start text-gray-900 dark:text-white ml-4">
                    Category List
                </h1>
                <p>Already Crud Operation can Create Edit And Delete</p>
                <Link href="/dashboard/categories/create">
                    <Button className='px-8 font-semibold'>New</Button>
                </Link>
            </div>
            <Table>
                <TableCaption>A list of your categories.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        {/* <TableHead>Products Count</TableHead> */}
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map((category, index) => (
                        <TableRow key={category.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{category.name}</TableCell>
                            <TableCell>{category.description || "N/A"}</TableCell>
                            {/* <TableCell>{category.productCount || 0}</TableCell> */}
                            <TableCell>
                                <div className='flex gap-2'>
                                    <Link href={`/dashboard/categories/${category.id}`}>
                                        <Button variant="outline" className='hover:text-blue-600'>
                                            <Edit />
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={() => handleDelete(category.id)}
                                        variant="outline"
                                        className='hover:text-red-600'
                                        disabled={isDeleting}
                                    >
                                        <Trash2 />
                                    </Button>
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

export default CategoryPage;
