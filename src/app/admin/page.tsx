'use client'
import React, { useMemo,useState } from 'react'
import { BarChartIcon, PersonIcon, BoxIcon, PlusIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StoreIcon, TruckIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react'
import { format } from 'date-fns'
import CreateOrderModal from '@/components/CreateOrderModal'
import AssignDeliveryAgentModal from '@/components/AssignDeliveryAgentModal'
import { useData } from '@/contexts/DataContext'



const DashboardContentPage: React.FC = () => {
    const { orders, restaurants, deliveryAgents, users, searchTerm } = useData()
    const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false)
  const [isAssignDeliveryAgentModalOpen, setIsAssignDeliveryAgentModalOpen] = useState(false)

  const filteredData = useMemo(() => {
    const lowerSearchTerm = searchTerm?.toLowerCase()
    return {
      orders: orders?.filter(order => 
        order.customerName.toLowerCase().includes(lowerSearchTerm) ||
        order.restaurantName.toLowerCase().includes(lowerSearchTerm)
      ),
      restaurants: restaurants?.filter(restaurant => 
        restaurant.name.toLowerCase().includes(lowerSearchTerm)
      ),
      deliveryAgents: deliveryAgents?.filter(agent => 
        agent.name.toLowerCase().includes(lowerSearchTerm)
      ),
      users: users?.filter(user => 
        user.name.toLowerCase().includes(lowerSearchTerm) ||
        user.email.toLowerCase().includes(lowerSearchTerm)
      )
    }
  }, [orders, restaurants, deliveryAgents, users, searchTerm])

  const stats = useMemo(() => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const ordersToday = filteredData.orders?.filter(order => 
      format(order.date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
    ).length
    const ordersYesterday = filteredData.orders?.filter(order => 
      format(order.date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')
    ).length

    const ordersTrend = ordersToday > ordersYesterday ? 'up' : 'down'

    return {
      totalOrders: filteredData.orders.length,
      activeRestaurants: filteredData.restaurants.length,
      availableDeliveryAgents: filteredData.deliveryAgents.filter((agent) => agent.status === 'available').length,
      totalUsers: filteredData.users.length,
      ordersTrend,
      ordersToday,
      ordersYesterday
    }
  }, [filteredData])

  const handleCreateOrder = (orderData: any) => {
    // Logic to create a new order
    console.log("Creating new order...", orderData)
    // Here you would typically make an API call to create the order
    // Then update the orders state with the new order
    // For now, we'll just log the order data
    setIsCreateOrderModalOpen(true)
  }

  const handleAssignDeliveryAgent = (assignmentData: any) => {
    // Logic to assign a delivery agent
    console.log("Assigning delivery agent...", assignmentData)
    // Here you would typically make an API call to assign the delivery agent
    // Then update the orders and deliveryAgents states accordingly
    // For now, we'll just log the assignment data
    setIsAssignDeliveryAgentModalOpen(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="flex items-center justify-center" onClick={handleCreateOrder}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Create New Order
          </Button>
          <Button variant="outline" className="flex items-center justify-center" onClick={handleAssignDeliveryAgent}>
            <TruckIcon className="mr-2 h-4 w-4" />
            Assign Delivery Agent
          </Button>
        </div>
      </div>
      <CreateOrderModal 
        isOpen={isCreateOrderModalOpen}
        onClose={() => setIsCreateOrderModalOpen(false)}
        onSubmit={handleCreateOrder}
        restaurants={restaurants}
      />
      <AssignDeliveryAgentModal
        isOpen={isAssignDeliveryAgentModalOpen}
        onClose={() => setIsAssignDeliveryAgentModalOpen(false)}
        onSubmit={handleAssignDeliveryAgent}
        orders={orders.filter(order => order.status === 'pending')}
        deliveryAgents={deliveryAgents.filter(agent => agent.status === 'available')}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <BoxIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {stats.ordersTrend === 'up' ? (
                <TrendingUpIcon className="inline mr-1 text-green-500" />
              ) : (
                <TrendingDownIcon className="inline mr-1 text-red-500" />
              )}
              {stats.ordersToday} today ({stats.ordersYesterday} yesterday)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Restaurants</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeRestaurants}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Delivery Agents</CardTitle>
            <PersonIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableDeliveryAgents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <PersonIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardContentPage