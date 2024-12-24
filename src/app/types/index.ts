export interface Category {
    id: string;
    name: string;
  }
  
  export interface Product {
    id: number;
    name: string;
    price: number;
    categoryId: number;
    category?: Category; // Optional
  }
  