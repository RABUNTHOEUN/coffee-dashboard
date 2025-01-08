"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // Routing utilities
import { Input } from "@/components/ui/input"; // UI components
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // Notifications
import { baseUrl } from "@/utils/config"; // API base URL

const EditInventory = () => {
  const { id } = useParams(); // Extract inventory ID from URL
  const router = useRouter();

  // State for inventory fields
  const [inventory, setInventory] = useState({
    inventoryId: id,
    stockQuantity: "",
    restockDate: "",
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message

  // Fetch the existing inventory by ID
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`${baseUrl}/inventory/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch inventory details");
          }
          return response.json();
        })
        .then((data) => {
          setInventory({
            inventoryId: data.inventoryId,
            stockQuantity: data.stockQuantity,
            restockDate: data.restockDate.split("T")[0], // Format date for input
          });
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          toast.error(err.message);
          setLoading(false);
        });
    }
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/inventory/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inventoryId: inventory.inventoryId,
          stockQuantity: parseInt(inventory.stockQuantity, 10),
          restockDate: inventory.restockDate,
        }),
      });

      if (response.status === 400) {
        throw new Error("Invalid data submitted");
      }
      if (response.status === 404) {
        throw new Error("Inventory not found");
      }
      if (!response.ok) {
        throw new Error("Failed to update inventory");
      }

      toast.success("Inventory updated successfully!");
      router.push("/dashboard/inventory"); // Navigate to the inventory list
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-1/2 mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Inventory</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Stock Quantity</label>
            <Input
              type="number"
              placeholder="Stock Quantity"
              value={inventory.stockQuantity}
              onChange={(e) =>
                setInventory({ ...inventory, stockQuantity: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Restock Date</label>
            <Input
              type="date"
              value={inventory.restockDate}
              onChange={(e) =>
                setInventory({ ...inventory, restockDate: e.target.value })
              }
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Update Inventory"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default EditInventory;
