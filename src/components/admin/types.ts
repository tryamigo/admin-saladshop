// src/components/admin/types.ts
export type OrderStatus = 'Pending' | 'Order Received' | 'Preparing' | 'Ready for Pickup' | 'Order Collected' | 'Ask for cancel';

export interface Address {
id?: string;
restaurantId?: string;
streetAddress: string;
latitude?: string;
longitude?: string;
landmark: string;
city: string;
state: string;
pincode: string;

}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  description: string;
  imageLink: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  orderTime: Date;
  deliveryTime?: Date;
  rating?: number;
  feedback?: string;
  deliveryCharge: number;
  discount: number;
  orderItems: OrderItem[];
  takeFromStore: boolean;
  userAddress?: any;
}


export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  ratings?: number; // Add any other fields you need
  discounts?: number; // If applicable
  imageLink?: string; // If applicable
}

export interface User {
  id: string;
  mobile: string;
}