"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { baseUrl } from '@/utils/config';
import React, { useState } from 'react';
import { toast } from 'sonner';

const CreateCategory = () => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Create the category object
        const categoryData = {
            name: categoryName,
            description: categoryDescription,
        };

        setLoading(true); // Set loading state to true

        try {
            // Use the fetch API to send a POST request
            const response = await fetch(`${baseUrl}/Categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryData),
            });

            if (!response.ok) {
                throw new Error('Error creating category');
            }

            const data = await response.json();
            console.log(data);
            

            // Show success toast
            toast.success('Category created successfully!',{
                style: {
                    color: "green",
                },
            });

            // Clear the input fields
            setCategoryName('');
            setCategoryDescription('');
        } catch (error) {
            // Show error toast
            toast.error('Error creating category',{
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
        <div className="p-4 w-1/2 mx-auto">
            <h2 className="text-xl font-bold mb-4">Create Category</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <Input
                        type="text"
                        placeholder="Category Name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <Input
                        type="text"
                        placeholder="Category Description"
                        value={categoryDescription}
                        onChange={(e) => setCategoryDescription(e.target.value)}
                        required
                    />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Category'}
                </Button>
            </form>
        </div>
    );
};

export default CreateCategory;
