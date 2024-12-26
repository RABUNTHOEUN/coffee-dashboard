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
import Link from "next/link";
import { toast } from "sonner";

interface User {
    // id?: number;
    firstName?: string;
    lastName?: string;
}


interface Order {
    orderId: string | number;
    userId: string | number;
    user?: User;
    paymentId?: string | number;
    orderStatus?: string;
    totalAmount?: number;
    orderDate?: string | Date;
    deliveryAddress?: string;
}


const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'text-yellow-500 dark:text-yellow-400 font-semibold'; // Yellow for pending
        case 'shipped':
            return 'text-blue-500 dark:text-blue-400 font-semibold'; // Blue for shipped
        case 'delivered':
            return 'text-green-500 dark:text-green-400 font-semibold'; // Green for delivered
        case 'cancelled':
            return 'text-red-500 dark:text-red-400 font-semibold'; // Red for cancelled
        default:
            return 'text-gray-500 dark:text-gray-400'; // Gray for N/A or unknown
    }
}

const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const userId = JSON.parse(localStorage.getItem("user") || "{}").id;
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("You are not logged in!", {
                    style: {
                        color: "red",
                    },
                });
                return;
            }

            try {
                const response = await fetch(`${baseUrl}/Orders/orders/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // Include the token here
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data);

                setOrders(data);
            } catch (error) {
                if (error instanceof Error) {
                    console.error("Failed to fetch orders:", error.message);
                    toast.error(`Failed to fetch orders: ${error.message}`, {
                        style: {
                            color: "red",
                        },
                    });
                } else {
                    console.error("An unexpected error occurred:", error);
                    toast.error("An unexpected error occurred. Please try again.", {
                        style: {
                            color: "red",
                        },
                    });
                }
            }
        };

        fetchOrders();
    }, []);

    const handleDelete = async (orderId: string | number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this order?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You are not logged in!", {
                    style: {
                        color: "red",
                    },
                });
                return;
            }

            const response = await fetch(`${baseUrl}/Orders/orders/${orderId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            toast.success("Order deleted successfully.", {
                style: {
                    color: "green",
                },
            });
            setOrders((prevOrders) => prevOrders.filter((order) => order.orderId !== orderId));
        } catch (error) {
            if (error instanceof Error) {
                console.error("Failed to delete order:", error.message);
                toast.error(`Failed to delete order: ${error.message}`, {
                    style: {
                        color: "red",
                    },
                });
            } else {
                console.error("An unexpected error occurred:", error);
                toast.error("An unexpected error occurred. Please try again.", {
                    style: {
                        color: "red",
                    },
                });
            }
        }
    };



    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-start text-gray-900 dark:text-white ml-4">
                    Orders List
                </h1>
                <Link href="/dashboard/order/create">
                    <Button className="px-8 font-semibold">New</Button>
                </Link>
            </div>
            <Table>
                <TableCaption>A list of your orders.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Order Status</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Delivery Address</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order, index) => (
                        <TableRow key={order.orderId}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{`${order.user?.firstName || ""} ${order.user?.lastName || ""}`}</TableCell>
                            <TableCell>{order.paymentId}</TableCell>
                            <TableCell className={getStatusStyle(order.orderStatus || 'N/A')}>
                                {order.orderStatus || "N/A"}
                            </TableCell>
                            <TableCell>
                                {`$${Intl.NumberFormat("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(order.totalAmount || 0)}`}
                            </TableCell>

                            <TableCell className="min-w-32">
                                {order.orderDate
                                    ? moment(order.orderDate).format("MMM, DD, YYYY, [at] hh:mm A")
                                    : "N/A"}
                            </TableCell>
                            <TableCell>{order.deliveryAddress || "N/A"}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Link href={`/dashboard/order/${order.orderId}`}>
                                        <Button variant="outline" className='hover:text-blue-600'>
                                            <Edit />
                                        </Button>
                                    </Link>
                                    <Button onClick={() => handleDelete(order.orderId)} variant="outline" className="hover:text-red-600">
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

export default OrdersPage;
