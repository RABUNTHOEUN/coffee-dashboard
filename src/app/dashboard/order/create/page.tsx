"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { baseUrl } from '@/utils/config';
import { Loader2 } from 'lucide-react';
import { Product } from '@/app/types';

const CreateOrder = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [orderItems, setOrderItems] = useState<{ productId: number; quantity: number }[]>([]);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Fetch products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch(`${baseUrl}/Products`);
            const data = await response.json();
            setProducts(data);
        };

        fetchProducts();

    }, []);

    // Add product to the order
    const handleAddItem = (productId: number) => {
        setOrderItems([
            ...orderItems,
            { productId, quantity: 1 }, // Default quantity is 1
        ]);
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        const orderData = {
            userId: 1, // Assuming logged-in user ID (you might want to dynamically get the user ID)
            orderStatus: 'pending',
            totalAmount: orderItems.reduce((sum, item) => sum + item.quantity * 10, 0), // Assume price is 10 for each item
            deliveryAddress,
            orderItems,
        };

        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            alert('You are not logged in!');
            setIsLoading(false);
            return;
        }

        const response = await fetch(`${baseUrl}/Orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'token': `Bearer ${token}`, // Add token to Authorization header
            },
            body: JSON.stringify(orderData),
        });

        if (response.ok) {
            alert('Order placed successfully!');
        } else {
            alert('Failed to place order.');
        }

        setIsLoading(false);
    };




    return (
        <div className="w-2/3 mx-auto p-6">

            <h2 className="text-2xl font-semibold mb-6">Create New Order</h2>

            <div className="mb-6">
                <h4 className="text-lg font-medium mb-4">Products</h4>
                <div className="space-y-4">
                    {products.map((product) => (
                        <Card key={product.id} className="p-4 flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-xl">{product.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Price: $10</p>
                            </div>
                            <Button onClick={() => handleAddItem(product.id)} variant="outline">
                                Add to Order
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <h4 className="text-lg font-medium mb-4">Order Items</h4>
                <div className="space-y-2">
                    {orderItems.map((item, index) => (
                        <Card key={index} className="p-4 flex justify-between">
                            <div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">Product ID: {item.productId}</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">Quantity: {item.quantity}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <h4 className="text-lg font-medium mb-2">Delivery Address</h4>
                <Input
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your address"
                    className="w-full"
                />
            </div>

            <Button
                onClick={handleSubmit}
                disabled={isLoading || !deliveryAddress || orderItems.length === 0}
                className="w-full mt-4"
            >
                {isLoading ? (
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                ) : (
                    'Place Order'
                )}
            </Button>
        </div>
    );
};

export default CreateOrder;
