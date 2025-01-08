"use client"; // Enable client-side rendering

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { baseUrl } from "@/utils/config";
import { useRouter, useParams } from "next/navigation";
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

interface Review {
  id: string | number;
  userId: string | number;
  productId: string | number;
  rating: number;
  reviewText: string;
  reviewDate: string;
}

const EditReview = () => {
  const { id } = useParams(); // Get the review ID from the URL
  const [review, setReview] = useState<Review>({
    id: 0,
    userId: 0,
    productId: 0,
    rating: 0,
    reviewText: "",
    reviewDate: "",
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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

  // Fetch review data based on the ID
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await fetch(`${baseUrl}/Review/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch review");
        }
        const data: Review = await response.json();
        setReview(data);
      } catch (error) {
        console.error("Error fetching review:", error);
        setError("Failed to load review");
        toast.error("Failed to load review", {
          style: { color: "red" },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id]);

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

    if (review.rating <= 0 || !review.reviewText.trim()) {
      toast.error("Please provide a rating and review text.", {
        style: { color: "red" },
      });
      return;
    }

    const updatedReview = {
      id: review.id,
      userId: user.id, // Use the user ID from localStorage
      productId: review.productId,
      rating: review.rating,
      reviewText: review.reviewText,
      reviewDate: review.reviewDate,
    };

    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/Review/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedReview),
      });

      if (!response.ok) {
        throw new Error("Failed to update review");
      }

      toast.success("Review updated successfully!", {
        style: { color: "green" },
      });

      // Redirect to the reviews list
      router.push("/dashboard/review");
    } catch (error) {
      toast.error("Error updating review", {
        style: { color: "red" },
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-4 w-full lg:w-1/2 mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Review</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Select
            onValueChange={(value) => setReview({ ...review, productId: Number(value) })}
            value={review.productId.toString()}
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
                className={`cursor-pointer ${index < review.rating ? "text-yellow-500" : "text-gray-400"}`}
                onClick={() => !loading && setReview({ ...review, rating: index + 1 })} // Disable interaction while loading
              />
            ))}
          </div>
        </div>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Review Text"
            value={review.reviewText}
            onChange={(e) => setReview({ ...review, reviewText: e.target.value })}
            required
            disabled={loading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Updating..." : "Update Review"}
        </Button>
      </form>
    </div>
  );
};

export default EditReview;