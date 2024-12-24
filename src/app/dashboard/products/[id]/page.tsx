'use client'; // For client-side rendering

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input'; // Ensure you have this component
import { Button } from '@/components/ui/button'; // Ensure you have this component
import { baseUrl } from '@/utils/config';
import { useParams } from 'next/navigation'; // For dynamic route parameters
import { toast } from 'sonner';

const ProductDetail: React.FC = () => {
  const { id } = useParams(); // Dynamic ID from the route
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
  });
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();


  // Fetch product details
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`${baseUrl}/Products/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch product data');
          }
          return response.json();
        })
        .then((data) => {
          setProduct({
            name: data.name,
            description: data.description,
            price: data.price,
            categoryId: data.categoryId,
          });
        })
        .catch((err) => {
          setError('Failed to fetch product data');
          toast.error(err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Fetch categories for the dropdown
  useEffect(() => {
    fetch(`${baseUrl}/Categories`)
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((err) => {
        toast.error('Failed to fetch categories');
        console.error(err); // Optionally log the error for debugging
      });
  }, []);


  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/Products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...product,
          categoryId: parseInt(product.categoryId), // Convert categoryId to a number
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      toast.success('Product updated successfully!');
      router.push('/dashboard/products');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error updating product: ${error.message}`);
      } else {
        toast.error('Error updating product');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-4 w-1/2 mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Product Name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Product Description"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="number"
              placeholder="Price"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: parseFloat(e.target.value) })
              }
              required
            />
          </div>
          <div className="mb-4">
            <select
              value={product.categoryId}
              onChange={(e) =>
                setProduct({ ...product, categoryId: e.target.value })
              }
              required
              className="border p-2 rounded w-full"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>

          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Update Product'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default ProductDetail;
