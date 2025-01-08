'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { baseUrl } from '@/utils/config';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Product } from '@/app/types';

const DiscountEdit = () => {
  const { id } = useParams();
  const [discount, setDiscount] = useState({
    code: '',
    description: '',
    discountPercentage: '',
    startDate: '',
    endDate: '',
    active: false,
    productId: '',
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState('');

  const router = useRouter();

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`${baseUrl}/Discount/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch discount data');
          }
          return response.json();
        })
        .then((data) => {
          console.log('API Response:', data); // Log the response for debugging
          setDiscount({
            code: data.code || '',
            description: data.description || '',
            discountPercentage: data.discountPercentage?.toString() || '',
            startDate: data.startDate ? data.startDate.split('T')[0] : '', // Format date for input field
            endDate: data.endDate ? data.endDate.split('T')[0] : '', // Format date for input field
            active: data.active || false,
            productId: data.productId?.toString() || '', // Ensure productId is a string
          });
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to fetch discount data');
          toast.error(err.message);
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    setProductsLoading(true);
    fetch(`${baseUrl}/Products`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load products');
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setProductsLoading(false);
      })
      .catch((err) => {
        setProductsError(err.message);
        toast.error(err.message);
        setProductsLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validate discount percentage
    const discountPercentage = parseFloat(discount.discountPercentage);
    if (isNaN(discountPercentage) || discountPercentage < 0 || discountPercentage > 100) {
      toast.error('Discount percentage must be between 0 and 100', {
        style: { color: 'red' },
      });
      return;
    }
  
    // Prepare the payload
    const updatedDiscount = {
      DiscountId: parseInt(id as string), // Ensure DiscountId matches the URL id
      Code: discount.code,
      Description: discount.description,
      DiscountPercentage: discountPercentage,
      StartDate: new Date(discount.startDate).toISOString(), // Convert to ISO string
      EndDate: new Date(discount.endDate).toISOString(), // Convert to ISO string
      Active: discount.active,
      ProductId: parseInt(discount.productId), // Ensure ProductId is a number
    };
  
    setLoading(true);
  
    try {
      const response = await fetch(`${baseUrl}/Discount/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDiscount),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update discount');
      }
  
      // Handle 204 No Content response
      if (response.status === 204) {
        toast.success('Discount updated successfully!', {
          style: { color: 'green' },
        });
        router.push('/dashboard/discount');
      }
    } catch (error) {
      toast.error('Error updating discount', {
        style: { color: 'red' },
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-4 w-1/2 mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Discount</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Discount Code"
              value={discount.code}
              onChange={(e) => setDiscount({ ...discount, code: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Description"
              value={discount.description}
              onChange={(e) => setDiscount({ ...discount, description: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="number"
              placeholder="Discount Percentage"
              value={discount.discountPercentage}
              onChange={(e) => setDiscount({ ...discount, discountPercentage: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="date"
              placeholder="Start Date"
              value={discount.startDate}
              onChange={(e) => setDiscount({ ...discount, startDate: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="date"
              placeholder="End Date"
              value={discount.endDate}
              onChange={(e) => setDiscount({ ...discount, endDate: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="product" className="block text-sm font-medium">
              Select Product
            </label>
            {productsLoading ? (
              <p>Loading products...</p>
            ) : productsError ? (
              <p className="text-red-500">{productsError}</p>
            ) : (
              <select
                id="product"
                value={discount.productId}
                onChange={(e) => setDiscount({ ...discount, productId: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select a product</option>
                {products.map((product: Product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              checked={discount.active}
              onChange={() => setDiscount({ ...discount, active: !discount.active })}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm font-medium">Active</label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Updating...' : 'Update Discount'}
            </Button>
            <Button
              type="button"
              className="w-full bg-gray-500 hover:bg-gray-600"
              onClick={() => router.push('/dashboard/discount')}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default DiscountEdit;