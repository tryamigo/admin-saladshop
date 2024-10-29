
'use client'
import React, { useMemo } from 'react'
import { BarChartIcon, PersonIcon, BoxIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {  TrendingUpIcon, TrendingDownIcon } from 'lucide-react'
import { format } from 'date-fns'
import { useData } from '@/contexts/DataContext'



const DashboardContentPage: React.FC = () => {
    const { orders, restaurants, deliveryAgents, users, searchTerm } = useData()
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


  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      
        </div>
      </div>
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