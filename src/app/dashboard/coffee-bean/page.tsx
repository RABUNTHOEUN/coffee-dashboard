"use client";

import React, { useEffect, useState } from "react";
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
import { Edit, Trash2 } from "lucide-react";
import { baseUrl } from "@/utils/config";
import Link from "next/link";
import { toast } from "sonner";

interface CoffeeBean {
  beanId: string | number;
  name: string;
  origin?: string;
  roastLevel?: string;
  pricePerKg?: number;
  stockQuantity?: number;
}

const CoffeeBeanPage = () => {
  const [coffeeBeans, setCoffeeBeans] = useState<CoffeeBean[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCoffeeBeans = async () => {
      try {
        const response = await fetch(`${baseUrl}/CoffeeBean`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCoffeeBeans(data);
      } catch (error) {
        console.error("Failed to fetch coffee beans:", error);
      }
    };

    fetchCoffeeBeans();
  }, []);

  const handleDelete = async (id: string | number) => {
    if (isDeleting) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this coffee bean?"
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${baseUrl}/CoffeeBean/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Coffee bean deleted successfully", {
            style: {
              color: "green",
            },
          });
        setCoffeeBeans((prev) => prev.filter((bean) => bean.beanId !== id));
      } else {
        toast.error("Failed to delete coffee bean", {
            style: {
              color: "red",
            },
          });
      }
    } catch (error) {
      console.error("Error deleting coffee bean:", error);
      toast.error("An error occurred while deleting the coffee bean", {
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
          Coffee Bean List
        </h1>
        <p>Already Crud Operation can Create Edit And Delete</p>
        <Link href="/dashboard/coffee-bean/create">
          <Button className="px-8 font-semibold">New</Button>
        </Link>
      </div>
      <Table>
        <TableCaption>A list of your coffee beans.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Origin</TableHead>
            <TableHead>Roast Level</TableHead>
            <TableHead>Price Per Kg</TableHead>
            <TableHead>Stock Quantity</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coffeeBeans.map((bean, index) => (
            <TableRow key={bean.beanId}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{bean.name}</TableCell>
              <TableCell>{bean.origin || "N/A"}</TableCell>
              <TableCell>{bean.roastLevel || "N/A"}</TableCell>
              <TableCell>{bean.pricePerKg || 0}</TableCell>
              <TableCell>{bean.stockQuantity || 0}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link href={`/dashboard/coffee-bean/${bean.beanId}`}>
                    <Button variant="outline" className="hover:text-blue-600">
                      <Edit />
                    </Button>
                  </Link>
                  <Button
                    onClick={() => handleDelete(bean.beanId)}
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

export default CoffeeBeanPage;
