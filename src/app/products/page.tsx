"use client"
import React, { useEffect, useState } from 'react';
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

interface Product {
    id : number;
    categoryId: number;
    categoryName: string;
    description: string;
    imageUrl: string;
    price: number;
    inventoryId: number;
    name: string;

}


interface ApiResponse {
    products: Product[];
    totalPages: number;
}

const Page: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1); // State for current page
    const [totalPages, setTotalPages] = useState<number>(1); // To handle pagination

    useEffect(() => {
        // Fetch data from the API with pagination
        fetch(`http://localhost:5044/api/products?page=${currentPage}`)
            .then((response) => {
                console.log('Response:', response); // Log the response object
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data: ApiResponse) => {
                console.log(data); // Log the fetched data
                setProducts(data.products); // Assuming the API returns { products: [...] }
                setTotalPages(data.totalPages); // Assuming the API returns total pages info
                setLoading(false); // Set loading to false
            })
            .catch((error: Error) => {
                console.error('Error:', error.message); // Log the error message
                setError(error.message); // Set error message if any
                setLoading(false);
            });
    }, [currentPage]); // Refetch data whenever currentPage changes

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-start text-gray-900 dark:text-white ml-4">
                Product List
            </h1>
            <Table>
                <TableCaption>A list of your recent products.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Product Number</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* Map over the products array to create TableRows dynamically */}
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.categoryName}</TableCell>
                            <TableCell>{product.description}</TableCell>
                            <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* <ProductPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            /> */}
        </div>
    );
};

export default Page;
