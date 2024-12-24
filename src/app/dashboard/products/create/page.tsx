'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For navigation after creating the product
import { Input } from '@/components/ui/input'; // Assuming you have a reusable input component
import { Button } from '@/components/ui/button'; // Assuming you have a reusable button component
import { toast } from 'sonner'; // Importing toast for notifications
import { baseUrl } from '@/utils/config'; // Base URL for your API

const CreateProduct = () => {
    const router = useRouter();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: 0,
        categoryId: 0,
        // imageUrl: ''
    });
    const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Fetch categories for the select dropdown
    useEffect(() => {
        fetch(`${baseUrl}/Categories`)
            .then((response) => response.json())
            .then((data) => {
                setCategories(data); // Set the available categories
                setLoadingCategories(false);
            })
            .catch((error) => {
                console.error('Failed to fetch categories:', error);
                setLoadingCategories(false);
            });
    }, []);

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    // Handle category selection change
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategoryId = parseInt(e.target.value);
        setProduct({
            ...product,
            categoryId: selectedCategoryId,
        });
    };

    // Handle form submission to create a new product
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${baseUrl}/Products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });

            if (!response.ok) {
                throw new Error('Failed to create product');
            }

            toast.success('Product created successfully');
            router.push('/dashboard/products'); // Navigate to the products list page after creation
        } catch (error) {
            toast.error('Error creating product');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="p-4 w-1/2 mx-auto">
                <h2 className="text-xl font-bold mb-4">Create New Product</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Input
                            type="text"
                            name="name"
                            placeholder="Product Name"
                            value={product.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            type="text"
                            name="description"
                            placeholder="Product Description"
                            value={product.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={product.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Category
                        </label>
                        {loadingCategories ? (
                            <p>Loading categories...</p>
                        ) : (
                            <select
                                id="category"
                                name="categoryId"
                                value={product.categoryId}
                                onChange={handleCategoryChange}
                                className="p-2 w-full border  rounded-md"
                                required
                            >
                                <option value="">Select a Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    {/* <div className="mb-4">
                    <Input
                    type="text"
                    name="imageUrl"
                        placeholder="Image URL"
                        value={product.imageUrl}
                        onChange={handleChange}
                        required
                        />
                        </div> */}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Product'}
                    </Button>
                </form>
            </div>
        </>
    );
};

export default CreateProduct;
