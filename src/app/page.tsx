'use client'
import React, { useMemo } from 'react'
import { PersonIcon, BoxIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {  TrendingUpIcon, TrendingDownIcon, PlusIcon } from 'lucide-react'
import { format } from 'date-fns'
import { useData } from '@/contexts/DataContext'
import { Button } from '@/components/ui/button'
import { DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react'



const DashboardContentPage: React.FC = () => {
    const { orders, users, searchTerm, setSearchTerm } = useData()
  const filteredData = useMemo(() => {
    const lowerSearchTerm = searchTerm?.toLowerCase()
    return {
      orders: orders?.filter(order => 
        order.userId.toLowerCase().includes(lowerSearchTerm)
      ),
      users: users?.filter(user => 
        user.mobile.includes(searchTerm)
      ),
      searchTerm,
      setSearchTerm
    }
  }, [orders, users, searchTerm, setSearchTerm])

  const stats = useMemo(() => {
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)

    const todayOrders = filteredData.orders?.filter(order => {
      const orderDate = new Date(order.orderTime)
      return orderDate >= startOfDay && orderDate <= endOfDay
    })

    const totalRevenue = todayOrders?.reduce((sum, order) => sum + order.total, 0) || 0
    const totalOrders = todayOrders?.length || 0
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue
    }
  }, [filteredData.orders])


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[2000px] mx-auto">
        <div className="space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Dashboard Overview</h2>
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Add any action buttons or filters here if needed */}
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.averageOrderValue.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredData.users.length}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
)
}

const StatsCard = ({ title, value, icon, trend, trendValue }:any) => (
<Card className="hover:shadow-lg transition-shadow duration-300 w-full h-full">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
        <CardTitle className="text-[11px] sm:text-xs md:text-sm font-medium text-gray-600 truncate">{title}</CardTitle>
        <div className="flex-shrink-0">{icon}</div>
    </CardHeader>
    <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
        <div className="text-xl sm:text-2xl md:text-3xl font-bold truncate">{value}</div>
        {trend && (
            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-1 sm:mt-2 flex items-center">
                {trend === 'up' ? (
                    <TrendingUpIcon className="inline mr-1 text-green-500 h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 flex-shrink-0" />
                ) : (
                    <TrendingDownIcon className="inline mr-1 text-red-500 h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 flex-shrink-0" />
                )}
                <span className="truncate">{trendValue}</span>
            </p>
        )}
    </CardContent>
</Card>
)

// const QuickActionCard = ({ title, description, icon, action }:any) => (
// <Card className="hover:shadow-lg transition-shadow duration-300 w-full h-full">
//     <CardHeader className="flex flex-row items-center space-x-2 sm:space-x-3 md:space-x-4 px-3 sm:px-4 pt-3 sm:pt-4">
//         <div className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 flex-shrink-0">{icon}</div>
//         <div className="min-w-0 flex-1">
//             <CardTitle className="text-sm sm:text-base md:text-lg font-semibold truncate">{title}</CardTitle>
//             <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 truncate">{description}</p>
//         </div>
//     </CardHeader>
//     <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
//         <Button 
//             onClick={action} 
//             className="w-full text-xs sm:text-sm md:text-base py-1.5 sm:py-2 h-8 sm:h-9 md:h-10"
//         >
//             <PlusIcon className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Add New
//         </Button>
//     </CardContent>
// </Card>
// )

export default DashboardContentPage