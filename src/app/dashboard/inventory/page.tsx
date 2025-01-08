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
import ProductPagination from "@/components/pagination/page";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { baseUrl } from "@/utils/config";
import moment from "moment";
// import { Metadata } from "next";
import { toast } from "sonner";
import Link from "next/link";
import { Product } from "@/app/types";

interface Inventory {
  inventoryId: string | number;
  product: Product;
  stockQuantity?: number;
  restockDate?: string | Date;
}

const InventoryPage = () => {
  const [coffeeBeans, setCoffeeBeans] = useState<Inventory[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch inventory data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/Inventory`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCoffeeBeans(data);
      } catch (error) {
        console.error("Failed to fetch inventories:", error);
        toast.error("Failed to load inventory data.");
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string | number) => {
    if (isDeleting) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this inventory item?"
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${baseUrl}/Inventory/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Inventory item deleted successfully", {
          style: { color: "green" },
        });
        setCoffeeBeans((prev) => prev.filter((item) => item.inventoryId !== id));
      } else {
        toast.error("Failed to delete inventory item", {
          style: { color: "red" },
        });
      }
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      toast.error("An error occurred while deleting the inventory item.", {
        style: { color: "red" },
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-start text-gray-900 dark:text-white ml-4">
          Inventory List
        </h1>
        <p>Already Crud Operation can Create Edit And Delete</p>
        <Link href="/dashboard/inventory/create">
          <Button className="px-8 font-semibold">New</Button>
        </Link>
      </div>
      <Table>
        <TableCaption>A list of your inventories.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Stock Quantity</TableHead>
            <TableHead>Restock Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coffeeBeans.map((inventory: Inventory, index: number) => (
            <TableRow key={inventory.inventoryId}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{inventory.product.name || "N/A"}</TableCell>
              <TableCell
                className={
                  inventory.stockQuantity !== undefined &&
                  inventory.stockQuantity < 10
                    ? "text-red-500 dark:text-red-400"
                    : "text-gray-900 dark:text-white"
                }
              >
                {inventory.stockQuantity ?? "N/A"}
              </TableCell>
              <TableCell className="min-w-32">
                {inventory.restockDate
                  ? moment(inventory.restockDate).format("MMM DD, YYYY")
                  : "N/A"}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link href={`/dashboard/inventory/${inventory.inventoryId}`}>
                    <Button variant="outline" className="hover:text-blue-600">
                      <Edit />
                    </Button>
                  </Link>
                  <Button
                    onClick={() => handleDelete(inventory.inventoryId)}
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

export default InventoryPage;
