
'use client'
import React, { useMemo } from 'react'
import { BarChartIcon, PersonIcon, BoxIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {  TrendingUpIcon, TrendingDownIcon, PlusIcon, BikeIcon, UtensilsIcon, UserPlusIcon } from 'lucide-react'
import { format } from 'date-fns'
import { useData } from '@/contexts/DataContext'
import { Button } from '@/components/ui/button'



const DashboardContentPage: React.FC = () => {
    const { orders, restaurants, deliveryAgents, users, searchTerm } = useData()
  const filteredData = useMemo(() => {
    const lowerSearchTerm = searchTerm?.toLowerCase()
    return {
      orders: orders?.filter(order => 
        order.customerName.toLowerCase().includes(lowerSearchTerm)
      ),
      restaurants: restaurants?.filter(restaurant => 
        restaurant.name.toLowerCase().includes(lowerSearchTerm)
      ),
      deliveryAgents: deliveryAgents?.filter(agent => 
        agent.name.toLowerCase().includes(lowerSearchTerm)
      ),
      users: users?.filter(user => 
        user.mobile.includes(searchTerm)
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
    <div className="space-y-8 p-8 bg-gray-50">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
                title="Total Orders"
                value={stats.totalOrders}
                icon={<BoxIcon className="h-6 w-6 text-blue-500" />}
                trend={stats.ordersTrend}
                trendValue={`${stats.ordersToday} today (${stats.ordersYesterday} yesterday)`}
            />
            <StatsCard
                title="Active Restaurants"
                value={stats.activeRestaurants}
                icon={<BarChartIcon className="h-6 w-6 text-green-500" />}
            />
            <StatsCard
                title="Total Users"
                value={stats.totalUsers}
                icon={<PersonIcon className="h-6 w-6 text-purple-500" />}
            />
        </div>
    </div>
)
}

const StatsCard = ({ title, value, icon, trend, trendValue }:any) => (
<Card className="hover:shadow-lg transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        {icon}
    </CardHeader>
    <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {trend && (
            <p className="text-sm text-muted-foreground mt-2">
                {trend === 'up' ? (
                    <TrendingUpIcon className="inline mr-1 text-green-500 h-4 w-4" />
                ) : (
                    <TrendingDownIcon className="inline mr-1 text-red-500 h-4 w-4" />
                )}
                {trendValue}
            </p>
        )}
    </CardContent>
</Card>
)

const QuickActionCard = ({ title, description, icon, action }:any) => (
<Card className="hover:shadow-lg transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center space-x-4">
        {icon}
        <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    </CardHeader>
    <CardContent>
        <Button onClick={action} className="w-full">
            <PlusIcon className="mr-2 h-4 w-4" /> Add New
        </Button>
    </CardContent>
</Card>
)

export default DashboardContentPage