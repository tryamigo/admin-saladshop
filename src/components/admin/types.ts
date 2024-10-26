// // Types
type OrderStatus = 'pending' | 'preparing' | 'on the way' | 'delivered'
interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  ratings:number
}

interface Order {
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

interface Restaurant {
    id: string
    name: string
    cuisine: string
    rating: number
    address: string
    phoneNumber: string
    openingHours: string
  }

  interface MenuItem {
    id: string
    name: string
    description: string
    price: number
  }
  

  interface DeliveryAgent {
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

interface User {
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