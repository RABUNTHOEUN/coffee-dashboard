"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { baseUrl } from '@/utils/config';
import React, { useState } from 'react';
import { toast } from 'sonner';

const CreateCoffeeBean = () => {
    const [beanName, setBeanName] = useState('');
    const [origin, setOrigin] = useState('');
    const [roastLevel, setRoastLevel] = useState('');
    const [pricePerKg, setPricePerKg] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Create the coffee bean object
        const coffeeBeanData = {
            name: beanName,
            origin,
            roastLevel,
            pricePerKg: parseFloat(pricePerKg),
            stockQuantity: parseInt(stockQuantity, 10),
        };

        setLoading(true);

        try {
            const response = await fetch(`${baseUrl}/CoffeeBean`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(coffeeBeanData),
            });

            if (!response.ok) {
                throw new Error('Error creating coffee bean');
            }

            const data = await response.json();
            console.log(data);

            // Show success toast
            toast.success('Coffee bean created successfully!', {
                style: {
                    color: "green",
                },
            });

            // Clear the input fields
            setBeanName('');
            setOrigin('');
            setRoastLevel('');
            setPricePerKg('');
            setStockQuantity('');
        } catch (error) {
            // Show error toast
            toast.error('Error creating coffee bean', {
                style: {
                    color: "red",
                },
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 w-full lg:w-1/2 mx-auto">
            <h2 className="text-xl font-bold mb-4">Create Coffee Bean</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <Input
                        type="text"
                        placeholder="Bean Name"
                        value={beanName}
                        onChange={(e) => setBeanName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <Input
                        type="text"
                        placeholder="Origin"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <Input
                        type="text"
                        placeholder="Roast Level"
                        value={roastLevel}
                        onChange={(e) => setRoastLevel(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <Input
                        type="number"
                        placeholder="Price Per Kg"
                        value={pricePerKg}
                        onChange={(e) => setPricePerKg(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <Input
                        type="number"
                        placeholder="Stock Quantity"
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(e.target.value)}
                        required
                    />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Coffee Bean'}
                </Button>
            </form>
        </div>
    );
};

export default CreateCoffeeBean;
