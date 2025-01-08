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
import ProductPagination from "@/components/pagination/page";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { baseUrl } from "@/utils/config";
import Link from "next/link";
import { toast } from "sonner";
import { Product } from "@/app/types";


const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetch(`${baseUrl}/Products`);
        if (!data.ok) {
          throw new Error(`HTTP error! status: ${data.status}`);
        }
        const result = await data.json();
        setProducts(result);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to fetch products.", {
          style: {
            color: "red",
          },
        });
      }
    };

    fetchProducts();
  }, []);

  // Handle product delete
  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${baseUrl}/Products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete product with ID ${id}`);
      }

      toast.success("Product deleted successfully!", {
        style: {
          color: "green",
        },
      });
      // Remove the deleted product from the state
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.", {
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
          Products List
        </h1>
        <p>Already Crud Operation can Create Edit And Delete</p>
        <Link href={"/dashboard/products/create"}>
          <Button className="px-8 font-semibold">New</Button>
        </Link>
      </div>
      <Table>
        <TableCaption>A list of your products.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description || "N/A"}</TableCell>
              <TableCell>
                {`$${Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(product.price || 0)}`}
              </TableCell>
              <TableCell>{product.categoryName || "N/A"}</TableCell>
              <TableCell>{product.discounts[0]?.discountPercentage || 0}%</TableCell>

              <TableCell>
                <div className="flex gap-2">
                  <Link href={`/dashboard/products/${product.id}`}>
                    <Button variant="outline" className="hover:text-blue-600">
                      <Edit />
                    </Button>
                  </Link>
                  <Button
                    onClick={() => handleDelete(product.id)}
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
