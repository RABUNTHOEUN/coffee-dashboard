"use client";
import { Product } from '@/app/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { baseUrl } from '@/utils/config';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

const CreateDiscount = () => {
    const [discountCode, setDiscountCode] = useState('');
    const [description, setDescription] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState<number | string>('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [active, setActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');

    // Fetch products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${baseUrl}/products`);
                if (!response.ok) {
                    throw new Error('Error fetching products');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProducts();
    }, []);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Create the discount object
        const discountData = {
            code: discountCode,
            description,
            discountPercentage: Number(discountPercentage),
            startDate,
            endDate,
            active,
            productId: selectedProduct, // Add the selected product ID
        };

        setLoading(true); // Set loading state to true

        try {
            // Use the fetch API to send a POST request
            const response = await fetch(`${baseUrl}/Discount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(discountData),
            });

            if (!response.ok) {
                throw new Error('Error creating discount');
            }

            const data = await response.json();
            console.log(data);

            // Show success toast
            toast.success('Discount created successfully!', {
                style: {
                    color: "green",
                },
            });

            // Clear the input fields
            setDiscountCode('');
            setDescription('');
            setDiscountPercentage('');
            setStartDate('');
            setEndDate('');
            setSelectedProduct('');
        } catch (error) {
            // Show error toast
            toast.error('Error creating discount', {
                style: {
                    color: "red",
                },
            });
            console.error(error);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="p-4 w-full lg:w-1/2 mx-auto">
            <h2 className="text-xl font-bold mb-4">Create Discount</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <Input
                        type="text"
                        placeholder="Discount Code"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <Input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <Input
                        type="number"
                        placeholder="Discount Percentage"
                        value={discountPercentage}
                        onChange={(e) => setDiscountPercentage(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <Input
                        type="date"
                        placeholder="Start Date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <Input
                        type="date"
                        placeholder="End Date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-medium">Select Product</label>
                    <select
                        className="w-full p-2 border rounded"
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        required
                    >
                        <option value="" disabled>
                            -- Select a Product --
                        </option>
                        {products.map((product: Product) => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            checked={active}
                            onChange={() => setActive(!active)}
                        />
                        <span className="ml-2">Active</span>
                    </label>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Discount'}
                </Button>
            </form>
        </div>
    );
};

export default CreateDiscount;
