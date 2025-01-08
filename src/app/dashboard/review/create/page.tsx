"use client"; // Enable client-side rendering

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { baseUrl } from "@/utils/config";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star } from "lucide-react";

interface Product {
  id: string | number;
  name: string;
}

interface User {
  id: string | number;
  firstName: string;
  lastName: string;
}

const CreateReview = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [productId, setProductId] = useState<string | number>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null); // State to store user data
  const router = useRouter();

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  }, []);

  // Fetch products for the dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${baseUrl}/Products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products", {
          style: { color: "red" },
        });
      }
    };

    fetchProducts();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!user) {
      toast.error("User not found. Please log in again.", {
        style: { color: "red" },
      });
      return;
    }

    if (rating <= 0 || !reviewText.trim()) {
      toast.error("Please provide a rating and review text.", {
        style: { color: "red" },
      });
      return;
    }

    const reviewData = {
      userId: user.id, // Use the user ID from localStorage
      productId,
      rating,
      reviewText,
      reviewDate: new Date().toISOString(), // Set the current date
    };

    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/Review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error("Failed to create review");
      }

      toast.success("Review created successfully!", {
        style: { color: "green" },
      });

      // Redirect to the reviews list
      router.push("/dashboard/review");
    } catch (error) {
      toast.error("Error creating review", {
        style: { color: "red" },
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full lg:w-1/2 mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Review</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Select
            onValueChange={(value) => setProductId(value)}
            value={productId.toString()}
            disabled={loading}
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
          <div className="flex gap-1">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={24}
                className={`cursor-pointer ${index < rating ? "text-yellow-500" : "text-gray-400"}`}
                onClick={() => !loading && setRating(index + 1)} // Disable interaction while loading
              />
            ))}
          </div>
        </div>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Review Text"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Review"}
        </Button>
      </form>
    </div>
  );
};

export default CreateReview;