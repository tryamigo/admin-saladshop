// contexts/DataContext.tsx
'use client'
import { Order, User } from '@/components/admin/types'
import { useSession } from 'next-auth/react'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface DataContextType {
  orders: Order[]
  users: User[]
  searchTerm: string
  setSearchTerm: (term: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const {data:session,status} = useSession()

  // Fetch orders from the API
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders',{
        headers:{
          Authorization: `Bearer ${session?.user.accessToken}`,
        }
      })
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }
 
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchData = useCallback(async () => {
    if (status === "authenticated" && session?.user.accessToken) {
      try {
        await fetchOrders()
        await fetchUsers()
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  }, [status, session?.user.accessToken, fetchOrders, fetchUsers]);

  useEffect(() => {
    fetchData()
  }, [fetchData])
 

  return (
    <DataContext.Provider value={{ 
      orders,
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