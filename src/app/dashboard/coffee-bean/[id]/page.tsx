"use client"; // This is important for client-side rendering

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // Use next/navigation for routing and params
import { Input } from "@/components/ui/input"; // Import your custom input component
import { Button } from "@/components/ui/button"; // Import your custom button component
import { baseUrl } from "@/utils/config"; // Assuming you have a config file for base URL
import { toast } from "sonner"; // For toast notifications

// Define the type for CoffeeBean
interface CoffeeBean {
  beanId: number;
  name: string;
  origin: string;
  roastLevel: string;
  pricePerKg: number | string; // Allow both number and string for controlled inputs
  stockQuantity: number | string; // Allow both number and string for controlled inputs
}

const CoffeeBeanDetail: React.FC = () => {
  const { id } = useParams(); // Get the dynamic ID parameter from the URL
  const router = useRouter();

  const [coffeeBean, setCoffeeBean] = useState<CoffeeBean>({
    beanId: Number(id), // Initialize with the beanId from the URL
    name: "",
    origin: "",
    roastLevel: "",
    pricePerKg: "",
    stockQuantity: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch coffee bean details when the component mounts
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`${baseUrl}/CoffeeBean/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch coffee bean data");
          }
          return response.json();
        })
        .then((data: CoffeeBean) => {
          setCoffeeBean({
            beanId: data.beanId,
            name: data.name,
            origin: data.origin,
            roastLevel: data.roastLevel,
            pricePerKg: data.pricePerKg,
            stockQuantity: data.stockQuantity,
          });
          setLoading(false);
        })
        .catch((err: Error) => {
          setError("Failed to fetch coffee bean data");
          toast.error(err.message, {
            style: {
              color: "red",
            },
          });
          setLoading(false);
        });
    }
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/CoffeeBean/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...coffeeBean,
          pricePerKg: Number(coffeeBean.pricePerKg), // Ensure numeric values for API
          stockQuantity: Number(coffeeBean.stockQuantity),
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        if (response.status === 400) {
          toast.error(result.message || "Bad Request");
        } else if (response.status === 404) {
          toast.error(result.message || "CoffeeBean not found");
        } else if (response.status === 409) {
          toast.error(result.message || "Concurrency conflict occurred");
        } else {
          toast.error("Failed to update coffee bean", {
            style: {
              color: "red",
            },
          });
        }
        throw new Error("Failed to update coffee bean");
      }

      toast.success("Coffee bean updated successfully!", {
        style: {
          color: "green",
        },
      });
      router.push("/dashboard/coffee-bean");
    } catch (error) {
      toast.error("Error updating coffee bean", {
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
    <div className="p-4 w-1/2 mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Coffee Bean</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Name"
              value={coffeeBean.name}
              onChange={(e) =>
                setCoffeeBean({ ...coffeeBean, name: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Origin"
              value={coffeeBean.origin}
              onChange={(e) =>
                setCoffeeBean({ ...coffeeBean, origin: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Roast Level"
              value={coffeeBean.roastLevel}
              onChange={(e) =>
                setCoffeeBean({ ...coffeeBean, roastLevel: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="number"
              placeholder="Price per Kg"
              value={coffeeBean.pricePerKg}
              onChange={(e) =>
                setCoffeeBean({ ...coffeeBean, pricePerKg: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="number"
              placeholder="Stock Quantity"
              value={coffeeBean.stockQuantity}
              onChange={(e) =>
                setCoffeeBean({ ...coffeeBean, stockQuantity: e.target.value })
              }
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Update Coffee Bean"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default CoffeeBeanDetail;
