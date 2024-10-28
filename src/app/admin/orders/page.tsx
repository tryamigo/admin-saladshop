'use client'
import React, { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from 'date-fns'
import { EyeIcon, ChevronDownIcon, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { useData } from '@/contexts/DataContext'
import { useToast } from '@/hooks/use-toast'
import CreateOrderModal from '@/components/CreateOrderModal'
import { Order, Restaurant } from '@/components/admin/types'

const OrdersContentPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('all')
  const { searchTerm } = useData() 
  const [orders, setOrders] = useState<Order[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const {toast} = useToast()
  const fetchRestaurants = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/restaurants')
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants')
      }
      const data = await response.json()
      setRestaurants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

   // Fetch orders from the API
   const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders') // Adjust the API endpoint as needed
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      })
    }
  }
  useEffect(() => {
    fetchRestaurants()
    fetchOrders()
  }, [])
  const handleStatusFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value)
  }

  const handleCreateOrder = async (orderData: Partial<Order>) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })
      if (!response.ok) throw new Error('Failed to create order')
      toast({
        title: "Success",
        description: "Order created successfully",
      })
      // Refresh orders list
      fetchOrders()
    } catch (error) {
      console.error('Error creating order:', error)
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      })
    }
  }
  const getStatusColor = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'pending': return 'default'
      case 'preparing': return 'secondary'
      case 'on the way': return 'outline'
      case 'delivered': return 'default'
      default: return 'default'
    }
  }
  const filteredOrders = orders?.filter(order => 
    (order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || order.status === statusFilter)
  )
  if(isLoading){
    return <div>Loading...</div>
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Orders</h3>
        <Button onClick={() => setIsModalOpen(true)}>          <PlusIcon className="mr-2 h-4 w-4" />
          Add Order
        </Button>
      </div>
        <CreateOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrder}
        restaurants={restaurants}
      />

   
      <div className="flex justify-end">
        <div className="relative inline-block w-48">
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="all">All Statuses</option>
            < option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="on the way">On the Way</option>
            <option value="delivered">Delivered</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDownIcon className="h-4 w-4" />
          </div>
        </div>
      </div>

      <table className="w-full caption-bottom text-sm">
        <thead className="border-b">
          <tr>
            <th className="h-10 px-2 text-left align-middle font-medium">No.</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Customer</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Restaurant</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Total</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Status</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Date</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order,index) => (
            <tr key={order.id} className="border-b transition-colors hover:bg-muted/50">
              <td className="p-2 font-medium">{index+1}</td>
              <td className="p-2">{order.customerName}</td>
              <td className="p-2">{order.restaurantName}</td>
              <td className="p-2">${Number(order.total).toFixed(2)}</td>
              <td className="p-2">
                <Badge variant={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </td>
              <td className="p-2">{format(order.date, 'PPp')}</td>
              <td className="p-2">
                <Link href={`/admin/orders/${order.id}`} passHref>
                  <Button variant="ghost" size="sm">
                    <EyeIcon className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredOrders.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No orders found matching your criteria.
        </div>
      )}
    </div>
  )
}

export default OrdersContentPage