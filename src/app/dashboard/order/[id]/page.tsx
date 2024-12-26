'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { baseUrl } from '@/utils/config';
import { toast } from 'sonner';

interface Order {
  orderId: string;
  orderStatus: string;
  deliveryAddress: string;
}

const Page = () => {
  const router = useRouter();
  const { id } = useParams();
  const [order, setOrder] = useState<Order>({
    orderId: '',
    orderStatus: 'pending',
    deliveryAddress: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        toast.error('Order ID not found in the URL.', {
          style: {
            color: "yellow",
          },
        });
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You are not logged in!', {
          style: {
            color: "red",
          },
        });
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`${baseUrl}/Orders/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const fetchedOrder = await response.json();
        setOrder(fetchedOrder);
        console.log(fetchedOrder);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching order:', error.message);
          toast.error(`Error fetching order: ${error.message}`, {
            style: {
              color: "red",
            },
          });
        } else {
          console.error('An unexpected error occurred:', error);
          toast.error('An unexpected error occurred. Please try again.', {
            style: {
              color: "red",
            },
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // Handle form save
  const handleSave = async () => {
    if (!order) {
      toast.error('Order data is missing!', {
        style: {
          color: "red",
        },
      });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You are not logged in!', {
        style: {
          color: "red",
        },
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/Orders/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      toast.success('Order updated successfully.', {
        style: {
          color: "green",
        },
      });
      router.push('/dashboard/order');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to update order:', error.message);
        toast.error(`Failed to update order: ${error.message}`, {
          style: {
            color: "red",
          },
        });
      } else {
        console.error('An unexpected error occurred:', error);
        toast.error('An unexpected error occurred. Please try again.', {
          style: {
            color: "red",
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!order.orderId) {
    return <div>No order data found.</div>;
  }

  return (
    <div className="   dark:text-white shadow-lg rounded-lg p-4 w-full lg:w-1/2 mx-auto">
      <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
        Edit Order {id}
      </h1>
      <form className="space-y-4">
        <div>
          <label htmlFor="orderStatus" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
            Order Status:
          </label>
          <select
            id="orderStatus"
            value={order.orderStatus || 'pending'}
            onChange={(e) => setOrder({ ...order, orderStatus: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
            Delivery Address:
          </label>
          <input
            id="deliveryAddress"
            type="text"
            value={order.deliveryAddress || ''}
            onChange={(e) => setOrder({ ...order, deliveryAddress: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading} variant="outline" className="w-full sm:w-auto">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
