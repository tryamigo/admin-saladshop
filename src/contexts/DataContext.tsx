// contexts/DataContext.tsx
'use client'
import { createContext, useContext, useState, useEffect } from 'react'

interface DataContextType {
  orders: Order[]
  restaurants: Restaurant[]
  deliveryAgents: DeliveryAgent[]
  users: User[]
  searchTerm: string
  setSearchTerm: (term: string) => void
}
// Mock data
const mockOrders: Order[] = [
    {
      id: '1',
      customerName: 'John Doe',
      restaurantName: 'Burger King',
      status: 'pending',
      total: 10.99,
      date: new Date('2022-01-01T12:00:00.000Z'),
      items: [
        { id: '1', name: 'Whopper', quantity: 1, price: 5.99,ratings:5 },
        { id: '2', name: 'Fries', quantity: 1, price: 2.99,ratings:5 },
      ],
      deliveryAddress: '123 Main St, Anytown, USA',
      paymentMethod: 'Credit Card',
    },
    {
      id: '2',
      customerName: 'Jane Doe',
      restaurantName: 'Pizza Hut',
      status: 'preparing',
      total: 15.99,
      date: new Date('2022-01-02T13:00:00.000Z'),
      items: [
        { id: '3', name: 'Pepperoni Pizza', quantity: 1, price: 12.99,ratings:4 },
        { id: '4', name: 'Garlic Bread', quantity: 1, price: 3.00,ratings:4 },
      ],
      deliveryAddress: '456 Elm St, Othertown, USA',
      paymentMethod: 'PayPal',
    },
  ]
  
  // const mockRestaurants: Restaurant[] = [
  //   { id: '1', name: 'Burger King', cuisine: 'Fast Food', rating: 4.2 ,address:'noida'},
  //   { id: '2', name: 'Pizza Hut', cuisine: 'Italian', rating: 4.5 ,address:'delhi'},
  // ]
  
  // const mockDeliveryAgents: DeliveryAgent[] = [
  //   { id: '1', name: 'John Smith', status: 'available', completedDeliveries: 100 },
  //   { id: '2', name: 'Jane Smith', status: 'on delivery', completedDeliveries: 50 },
  // ]
  
  // const mockUsers: User[] = [
  //   { id: '1', name: 'John Doe', email: 'john@example.com', registrationDate: new Date('2022-01-01T12:00:00.000Z') },
  //   { id: '2', name: 'Jane Doe', email: 'jane@example.com', registrationDate: new Date('2022-01-02T13:00:00.000Z') },
  // ]
const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [deliveryAgents, setDeliveryAgents] = useState<DeliveryAgent[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Initialize with mock data
    // setOrders(mockOrders)
    // setRestaurants(mockRestaurants)
    // setDeliveryAgents(mockDeliveryAgents)
    // setUsers(mockUsers)
  }, [])

  return (
    <DataContext.Provider value={{ 
      orders, 
      restaurants, 
      deliveryAgents, 
      users, 
      searchTerm, 
      setSearchTerm 
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}