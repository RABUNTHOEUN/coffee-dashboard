"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { baseUrl } from "@/utils/config";
import { Loader2 } from "lucide-react";
import { Product } from "@/app/types";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderItem {
  productId: number; // Ensure productId is always a number
  productName: string;
  quantity: number;
}

interface OrderData {
  userId: number | null;
  orderStatus: string;
  totalAmount: number;
  deliveryAddress: string;
  orderItems: { productId: number; quantity: number }[];
}

const CreateOrder = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProducts, setIsFetchingProducts] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (user) {
      try {
        setUserId(JSON.parse(user).id);
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
    setToken(storedToken || null);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsFetchingProducts(true);
        const response = await fetch(`${baseUrl}/Products`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        // Ensure product IDs are numbers
        const productsWithNumericIds = data.map((product: Product) => ({
          ...product,
          id: Number(product.id),
        }));
        setProducts(productsWithNumericIds);
        toast.success("Products fetched successfully!", {
          style: { color: "green" },
        });
      } catch (error) {
        console.error(error);
        toast.error("Error fetching products.", {
          style: { color: "red" },
        });
      } finally {
        setIsFetchingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddItem = (product: Product) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === product.id);
      if (existingItem) {
        toast.success(`${product.name} quantity updated.`, {
          style: { color: "green" },
        });
        return prevItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success(`${product.name} added to order.`, {
        style: { color: "green" },
      });
      return [
        ...prevItems,
        { productId: Number(product.id), productName: product.name, quantity: 1 }, // Ensure productId is a number
      ];
    });
  };

  const handleRemoveItem = (productId: number) => {
    const product = orderItems.find((item) => item.productId === productId);
    setOrderItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
    if (product) {
      toast.success(`${product.productName} removed from order.`, {
        style: { color: "green" },
      });
    }
  };

  const handleSubmit = async () => {
    if (!deliveryAddress.trim()) {
      toast.error("Please provide a delivery address.", {
        style: { color: "red" },
      });
      return;
    }

    if (!token) {
      toast.error("You are not logged in!", {
        style: { color: "yellow" },
      });
      return;
    }

    setIsLoading(true);

    const orderData: OrderData = {
      userId,
      orderStatus: "pending",
      totalAmount: orderItems.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.productId);
        return sum + item.quantity * (product?.price || 0);
      }, 0),
      deliveryAddress,
      orderItems: orderItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetch(`${baseUrl}/Orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        toast.success("Order placed successfully!", {
          style: { color: "green" },
        });
        setOrderItems([]);
        setDeliveryAddress("");
      } else {
        toast.error("Failed to place order.", {
          style: { color: "red" },
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while placing the order.", {
        style: { color: "red" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingProducts) {
    return (
      <div className="w-full mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">Create New Order</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Create New Order</h2>

      <div className="flex gap-10">
        <div className="w-full">
          <h4 className="text-xl font-semibold">Products</h4>
          <hr className="mb-4" />
          <div className="space-y-4">
            {products.map((product) => (
              <Card key={product.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-xl">{product.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Price: {`$${product.price}`}</p>
                </div>
                <Button onClick={() => handleAddItem(product)} variant="outline">
                  Add to Order
                </Button>
              </Card>
            ))}
          </div>
        </div>
        <div className="w-2/3">
          <h4 className="text-xl font-semibold">Order Items</h4>
          <hr className="mb-4" />
          <div className="space-y-4">
            {orderItems.map((item, index) => (
              <Card key={index} className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-xl font-medium text-gray-700 dark:text-gray-300">{item.productName}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Quantity: {item.quantity}</p>
                </div>
                <Button
                  onClick={() => handleRemoveItem(item.productId)}
                  variant="destructive"
                  className="ml-4"
                >
                  Remove
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="my-4">
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
          "Place Order"
        )}
      </Button>
    </div>
  );
};

export default CreateOrder;