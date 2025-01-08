'use client';  // This is important for client-side rendering

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for routing
import { Input } from '@/components/ui/input'; // Make sure you have your input component
import { Button } from '@/components/ui/button'; // Same for button
import { baseUrl } from '@/utils/config'; // Assuming you have a config file for base URL
import { useParams } from 'next/navigation';  // Import useParams to get route params
import { toast } from 'sonner';

const CategoryDetail = () => {
  const { id } = useParams(); // Use useParams to get the dynamic ID parameter from the URL

  const [category, setCategory] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  // Fetch category data based on the ID in the URL
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`${baseUrl}/Categories/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch category data');
          }
          return response.json();
        })
        .then((data) => {
          setCategory({ name: data.name, description: data.description });
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to fetch category data');
          toast.error(err.message); // Use toast.error for error messages
          setLoading(false);
        });
    }
  }, [id]);

  // Handle form submission for editing the category
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedCategory = {
      name: category.name,
      description: category.description,
    };

    setLoading(true); // Set loading state while making the request

    try {
      const response = await fetch(`${baseUrl}/Categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCategory),
      });

      if (!response.ok) {
        throw new Error('Failed to update category');
      }

      toast.success('Category updated successfully!',{
        style: {
            color: "yellow",
        },
    });
      router.push('/dashboard/categories'); // Redirect after success
    } catch (error) {
      toast.error('Error updating category',{
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
      <h2 className="text-xl font-bold mb-4">Edit Category</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p> // Show error message in red
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Category Name"
              value={category.name}
              onChange={(e) => setCategory({ ...category, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Category Description"
              value={category.description}
              onChange={(e) => setCategory({ ...category, description: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Update Category'} {/* Update button text based on loading state */}
          </Button>
        </form>
      )}
    </div>
  );
};

export default CategoryDetail;
