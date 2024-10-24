// Types
type OrderStatus = 'pending' | 'preparing' | 'on the way' | 'delivered'
type DeliveryAgentStatus = 'available' | 'on delivery' | 'unavailable'

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
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
  address:string
  cuisine: string
  rating: number
}

interface DeliveryAgent {
  id: string
  name: string
  status: DeliveryAgentStatus
  completedDeliveries: number
}

interface User {
  id: string
  name: string
  email: string
  registrationDate: Date
}

interface MenuItem {
  name: string
  icon: React.ElementType
  id: string
}