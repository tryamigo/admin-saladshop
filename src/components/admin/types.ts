// src/components/admin/types.ts
export type OrderStatus = 'pending' | 'preparing' | 'on the way' | 'delivered';

export interface Address {
  street: string; 
  area: string; 
  city: string; 
  state: string;
  postalCode: string; 
  country: string; 

}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  ratings: number;
}

export interface Order {
  id: string;
  customerName: string;
  restaurantName: string;
  status: OrderStatus;
  total: number;
  date: Date;
  items: OrderItem[];
  deliveryAddress: Address; 
  paymentMethod: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  address: Address;
  phoneNumber: string;
  openingHours: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
}
export type deliveryStatus = 'available' | 'on delivery' | 'offline';
export interface DeliveryAgent {
  id: string;
  name: string;
  status:deliveryStatus
  completedDeliveries: number;
  phoneNumber: string;
  email: string;
  joinDate: Date;
  rating: number;
  licenseNumber?: string;
  aadharNumber?: string; 
  address:Address
  // currentOrder?: {
  //   id: string;
  //   restaurantName: string;
  //   customerName: string;
  //   deliveryAddress: Address;
  // };
}

export interface User {
  id: string;
  name: string;
  email: string;
  registrationDate: Date;
  phoneNumber: string;
  address: Address; 
  orderHistory: {
    id: string;
    date: Date;
    total: number;
    status: string;
  }[];
}