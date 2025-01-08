"use client"; // Enable client-side rendering

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProductPagination from "@/components/pagination/page";
import { baseUrl } from "@/utils/config";
import { Product } from "@/app/types";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton"; // Add a skeleton loader for better UX

interface OrderItem {
  orderItemId: string | number;
  orderId: string | number;
  product: Product;
  quantity?: number;
  price?: number;
}

const OrderItemPage = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch order items on component mount
  useEffect(() => {
    const fetchOrderItems = async () => {
      try {
        const response = await fetch(`${baseUrl}/OrderItem`);
        if (!response.ok) {
          throw new Error(`Failed to fetch order items: ${response.statusText}`);
        }
        const data = await response.json();
        setOrderItems(data);
      } catch (error) {
        console.error("Failed to fetch order items:", error);
        setError("Failed to load order items. Please try again later.");
        toast.error("Failed to load order items", {
          style: { color: "red" },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderItems();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-start text-gray-900 dark:text-white mb-4">
          List Orders Items
        </h1>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-start text-gray-900 dark:text-white mb-4">
          List Orders Items
        </h1>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-start text-gray-900 dark:text-white mb-4">
        List Orders Items
      </h1>
      <Table>
        <TableCaption>A list of your order items.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>OrderId</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderItems.map((orderItem: OrderItem, index: number) => (
            <TableRow key={orderItem.orderItemId}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{orderItem.orderId}</TableCell>
              <TableCell>{orderItem.product?.name}</TableCell>
              <TableCell>{orderItem.quantity || 0}</TableCell>
              <TableCell>
                {`$${Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(orderItem.product?.price || 0)}`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ProductPagination />
    </div>
  );
};

export default OrderItemPage;