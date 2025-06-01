'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EyeIcon, ChevronDownIcon, PlusIcon, SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { useData } from '@/contexts/DataContext'
import { useToast } from '@/hooks/use-toast'
import CreateOrderModal from '@/components/CreateOrderModal'
import { Order, } from '@/components/admin/types'
import { useSession } from 'next-auth/react'
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const OrdersContentPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('all')
  const { searchTerm } = useData() 
  const [orders, setOrders] = useState<Order[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const {toast} = useToast()
  const {data : session,status} = useSession()
  const fetchRestaurants = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/restaurants',{
        headers:{
          Authorization: `Bearer ${session?.user.accessToken}`,
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants')
      }
      const data = await response.json()
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [session?.user.accessToken]);

  const fetchOrders = useCallback(async () => {
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
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      })
    }
  }, [session?.user.accessToken, toast]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchRestaurants()
      fetchOrders()
    }
  }, [status, fetchRestaurants, fetchOrders])
  const handleStatusFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value)
  }

  const handleCreateOrder = async (orderData: Partial<Order>) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user.accessToken}`,

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
     order.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || order.status === statusFilter)
  )
  if(isLoading){
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  console.log(orders)
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Orders</CardTitle>
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Order
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CreateOrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateOrder}
        />

        <div className="flex justify-between items-center mb-6">
          <div className="relative inline-block w-48">
            <select
              value={statusFilter}
              onChange={handleStatusFilter}
              className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="on the way">On the Way</option>
              <option value="delivered">Delivered</option>
            </select>
            <ChevronDownIcon className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order, index) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index+1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${Number(order.total).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(order.date, 'PPp')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/orders/${order.id}`} passHref>
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
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No orders found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default OrdersContentPage