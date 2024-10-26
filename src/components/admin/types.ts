// // Types
export type OrderStatus = 'pending' | 'preparing' | 'on the way' | 'delivered'
export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  ratings:number
}

export interface Order {
  id: string
  customerName: string
  restaurantName: string
  status: OrderStatus
  total: number
  date: Date
  items: OrderItem[]
  deliveryAddress: string
  paymentMethod: string
}

export interface Restaurant {
    id: string
    name: string
    cuisine: string
    rating: number
    address: string
    phoneNumber: string
    openingHours: string
  }

  export interface MenuItem {
    id: string
    name: string
    description: string
    price: number
  }
  

  export interface DeliveryAgent {
    id: string
    name: string
    status: 'available' | 'on delivery' | 'offline'
    completedDeliveries: number
    phoneNumber: string
    email: string
    joinDate: Date
    rating: number
    currentOrder?: {
      id: string
      restaurantName: string
      customerName: string
      deliveryAddress: string
    }
  }

export interface User {
    id: string
    name: string
    email: string
    registrationDate: Date
    phoneNumber: string
    address: string
    orderHistory: {
      id: string
      date: Date
      total: number
      status: string
    }[]
  }