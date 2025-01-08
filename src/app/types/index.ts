export interface Category {
    id: string;
    name: string;
  }

  interface Discount {
    discountId: number;
    code: string;
    description: string;
    discountPercentage: number;  // Match to decimal, use number in TypeScript
    startDate: string;  // Use ISO string format for DateTime
    endDate: string;    // Use ISO string format for DateTime
    active: boolean;
  }
  
  
  export interface Product {
    id: string | number;
    name: string;
    description?: string;
    price?: number;
    categoryName?: string;
    discounts: Discount[];
  }
  
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}