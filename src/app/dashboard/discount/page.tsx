"use client";
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
// import ProductPagination from "@/components/pagination/page";
import { Button } from "@/components/ui/button";
import { CircleCheck, CircleX, Edit, Trash2 } from "lucide-react";
import { baseUrl } from "@/utils/config";
import moment from "moment";
// import { Metadata } from "next";
import Link from "next/link";
import { toast } from "sonner";
import { Product } from "@/app/types";

// export const metadata: Metadata = {
//   title: "Discount",
//   description: "Discounts management",
// };

interface Discount {
  discountId: string | number;
  code: string;
  description?: string;
  discountPercentage?: number;
  startDate?: string | Date;
  endDate?: string | Date;
  active: boolean;
  product: Product;
}

const DiscountPage = () => {
  const [discounts, setDiscount] = useState<Discount[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch discounts when the page loads
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetch(`${baseUrl}/Discount`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDiscount(data);
      } catch (error) {
        console.error("Failed to fetch discounts:", error);
      }
    };

    fetchDiscounts();
  }, []);

  const handleDelete = async (id: string | number) => {
    if (isDeleting) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this discount?"
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${baseUrl}/Discount/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Discount deleted successfully", {
          style: {
            color: "green",
          },
        });
        setDiscount((prev) => prev.filter((discount) => discount.discountId !== id));
      } else {
        toast.error("Failed to delete discount", {
          style: {
            color: "red",
          },
        });
      }
    } catch (error) {
      console.error("Error deleting discount:", error);
      toast.error("An error occurred while deleting the discount", {
        style: {
          color: "red",
        },
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-start text-gray-900 dark:text-white ml-4">
          Discounts List
        </h1>
        <p>Already Crud Operation can Create Edit And Delete</p>
        <Link href="/dashboard/discount/create">
          <Button className="px-8 font-semibold">New</Button>
        </Link>
      </div>
      <Table>
        <TableCaption>A list of your Discounts.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Discount Percentage</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {discounts.map((discount: Discount, index: number) => (
            <TableRow key={discount.discountId}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{discount.code}</TableCell>

              <TableCell>{discount.description || "N/A"}</TableCell>
              <TableCell>
                {discount.product ? discount.product?.name : "No Product"}
              </TableCell>
              <TableCell>{discount.discountPercentage || 0}%</TableCell>
              <TableCell className="min-w-32">
                {discount.startDate
                  ? moment(discount.startDate).format("MMM, DD, YYYY")
                  : "N/A"}
              </TableCell>
              <TableCell className="min-w-32">
                {discount.endDate
                  ? moment(discount.endDate).format("MMM, DD, YYYY")
                  : "N/A"}
              </TableCell>
              <TableCell>
                {discount.active ? (
                  <span className="text-green-500">
                    <CircleCheck />
                  </span>
                ) : (
                  <span className="text-red-500">
                    <CircleX />
                  </span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link href={`/dashboard/discount/${discount.discountId}`}>
                    <Button variant="outline" className="hover:text-blue-600">
                      <Edit />
                    </Button>
                  </Link>
                  <Button
                    onClick={() => handleDelete(discount.discountId)}
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
      {/* <ProductPagination /> */}
    </div>
  );
};

export default DiscountPage;
