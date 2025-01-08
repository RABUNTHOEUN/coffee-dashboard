"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { baseUrl } from "@/utils/config";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

// Define the product type
interface Product {
  id: string | number;
  name: string;
}

// Define the inventory data type for the form submission
interface InventoryData {
  productId: number | null;
  stockQuantity: number;
  restockDate: string | null;
}

const CreateInventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(undefined);
  const [stockQuantity, setStockQuantity] = useState<number | "">("");
  const [restockDate, setRestockDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch product list
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${baseUrl}/Products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data: Product[] = await response.json(); // Ensure the response matches the Product type
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      }
    };

    fetchProducts();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    // Prepare the payload
    const inventoryData: InventoryData = {
      productId: selectedProductId ? parseInt(selectedProductId) : null, // Convert to number or null
      stockQuantity: stockQuantity === "" ? 0 : Number(stockQuantity), // Ensure stockQuantity is a number
      restockDate: restockDate || null, // Use null if restockDate is empty
    };

    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/Inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inventoryData),
      });

      if (!response.ok) {
        throw new Error("Error creating inventory");
      }

      const data = await response.json();
      console.log(data);

      toast.success("Inventory created successfully!", {
        style: {
          color: "green",
        },
      });

      // Reset form fields
      setSelectedProductId(undefined);
      setStockQuantity("");
      setRestockDate("");
    } catch (error) {
      toast.error("Error creating inventory", {
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
    <div className="p-4 w-full lg:w-1/2 mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Inventory</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Select
            onValueChange={(value) => setSelectedProductId(value)}
            value={selectedProductId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <Input
            type="number"
            placeholder="Stock Quantity"
            value={stockQuantity === "" ? "" : stockQuantity}
            onChange={(e) =>
              setStockQuantity(e.target.value === "" ? "" : Number(e.target.value))
            }
            required
          />
        </div>
        <div className="mb-4">
          <Input
            type="date"
            placeholder="Restock Date"
            value={restockDate}
            onChange={(e) => setRestockDate(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Inventory"}
        </Button>
      </form>
    </div>
  );
};

export default CreateInventory;