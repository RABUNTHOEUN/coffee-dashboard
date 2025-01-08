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
import { Button } from "@/components/ui/button";
import { Edit, Star, Trash2 } from "lucide-react";
import { baseUrl } from "@/utils/config";
import moment from "moment";
import { Product } from "@/app/types";
import Link from "next/link";
import { toast } from "sonner";

interface User {
  firstName: string;
  lastName: string;
}

interface Review {
  reviewId: string | number;
  userId: string | number;
  productId?: string | number;
  rating?: number;
  reviewText?: string;
  reviewDate?: string | Date;
  user?: User;
  product?: Product;
}

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => (
        <Star
          size={18}
          key={index}
          className={`${index < rating ? "text-yellow-500" : "text-gray-400"}`}
        />
      ))}
    </div>
  );
};

const Page = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null); // State to store user data

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  }, []);

  // Fetch reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${baseUrl}/Review`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setError("Failed to load reviews");
        toast.error("Failed to load reviews", {
          style: { color: "red" },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Handle delete functionality
  const handleDelete = async (reviewId: string | number) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!isConfirmed) {
      return; // Exit if the user cancels
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`${baseUrl}/Review/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      // Remove the deleted review from the state
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.reviewId !== reviewId)
      );

      toast.success("Review deleted successfully!", {
        style: { color: "green" },
      });
    } catch (error) {
      toast.error("Error deleting review", {
        style: { color: "red" },
      });
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-start text-gray-900 dark:text-white ml-4">
          Reviews List
        </h1>
        <p>Already Crud Operation can Create Edit And Delete</p>
        <Link href="/dashboard/review/create">
          <Button className="px-8 font-semibold">New</Button>
        </Link>
      </div>
      <Table>
        <TableCaption>A list of your reviews.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Review Text</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review: Review, index: number) => (
            <TableRow key={review.reviewId}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                {user
                  ? `${user.firstName} ${user.lastName}` // Display user from localStorage
                  : review.user
                  ? `${review.user.firstName} ${review.user.lastName}`
                  : "N/A"}
              </TableCell>
              <TableCell>
                {review.product ? `${review.product.name}` : "N/A"}
              </TableCell>
              <TableCell>
                <RatingStars rating={Number(review.rating) || 0} />
              </TableCell>
              <TableCell>{review.reviewText || "N/A"}</TableCell>
              <TableCell className="min-w-32">
                {review.reviewDate
                  ? moment(review.reviewDate).format("MMM, DD, YYYY")
                  : "N/A"}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link href={`/dashboard/review/${review.reviewId}`}>
                    <Button variant="outline" className="hover:text-blue-600">
                      <Edit />
                    </Button>
                  </Link>
                  <Button
                    onClick={() => handleDelete(review.reviewId)}
                    variant="outline"
                    className="hover:text-red-600"
                    disabled={isDeleting}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ProductPagination />
    </div>
  );
};

export default Page;