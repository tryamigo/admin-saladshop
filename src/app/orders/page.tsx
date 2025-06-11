'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EyeIcon, ChevronDownIcon } from 'lucide-react'
import Link from 'next/link'
import { useData } from '@/contexts/DataContext'
import { useToast } from '@/hooks/use-toast'
import { Order } from '@/components/admin/types'
import { useSession } from 'next-auth/react'
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const OrdersContentPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('all')
  const { searchTerm } = useData() 
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const {toast} = useToast()
  const {data : session, status} = useSession()

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch('https://backend.thesaladhouse.co/orders', {
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`,
        }
      })
      console.log(response,"response")
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast({
        title: "Error",
        description: "Failed to fetch orders. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [session?.user.accessToken, toast]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders()
    }
  }, [status, fetchOrders])

  const handleStatusFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value)
  }

  const getStatusColor = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Pending': return 'default'
      case 'Preparing': return 'secondary'
      case 'Ready for Pickup': return 'outline'
      case 'Order Collected': return 'default'
      case 'Ask for cancel': return 'destructive'
      default: return 'default'
    }
  }

  const filteredOrders = orders?.filter(order => 
    (order.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Orders</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="relative inline-block w-48">
            <select
              value={statusFilter}
              onChange={handleStatusFilter}
              className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Preparing">Preparing</option>
              <option value="Ready for Pickup">Ready for Pickup</option>
              <option value="Order Collected">Order Collected</option>
              <option value="Ask for cancel">Ask for cancel</option>
            </select>
            <ChevronDownIcon className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.userId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${Number(order.total).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(order.orderTime), 'PPp')}</td>
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