import React from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import ProductPagination from '@/components/pagination/page';
import { Button } from '@/components/ui/button';
import { Edit, Star, Trash2 } from 'lucide-react';
import { baseUrl } from '@/utils/config';
import moment from 'moment';
import { Metadata } from 'next';
import { Product } from '@/app/types';

export const metadata: Metadata = {
    title: "Review",
    description: "Review",
};

interface User {
    firstName: string;
    lastName: string;
}


interface Review {
    id: string | number;
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
                    className={`${index < rating ? 'text-yellow-500' : 'text-gray-400'
                        }`}
                />
            ))}
        </div>
    );
};

const page = async () => {

    let reviews = [];

    try {
        const data = await fetch(`${baseUrl}/Review`);
        if (!data.ok) {
            throw new Error(`HTTP error! status: ${data.status}`);
        }
        reviews = await data.json();
    } catch (error) {
        console.error("Failed to fetch reviews:", error);
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-start text-gray-900 dark:text-white ml-4">
                Reviews List
            </h1>
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
                        <TableRow key={review.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>
                                {review.user
                                    ? `${review.user.firstName} ${review.user.lastName}`
                                    : "N/A"}
                            </TableCell>
                            <TableCell>
                                {review.product
                                    ? `${review.product.name}`
                                    : "N/A"}
                            </TableCell>
                            <TableCell>
                                <RatingStars rating={Number(review.rating) || 0} />
                            </TableCell>
                            <TableCell>{review.reviewText || "N/A"}</TableCell>
                            {/* <TableCell>{review.reviewDate || "N/A"}</TableCell> */}
                            <TableCell className='min-w-32'>
                                {review.reviewDate ? moment(review.reviewDate).format('MMM, DD, YYYY') : "N/A"}
                            </TableCell>
                            <TableCell>
                                <div className='flex gap-2'>
                                    <Button variant="outline" className='hover:text-blue-600'><Edit /></Button>
                                    <Button variant="outline" className='hover:text-red-600'><Trash2 /></Button>
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

export default page;
