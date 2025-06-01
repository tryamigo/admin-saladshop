'use client'
import React, { useMemo } from 'react'
import { PersonIcon, BoxIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {  TrendingUpIcon, TrendingDownIcon, PlusIcon } from 'lucide-react'
import { format } from 'date-fns'
import { useData } from '@/contexts/DataContext'
import { Button } from '@/components/ui/button'



const DashboardContentPage: React.FC = () => {
    const { orders, users, searchTerm } = useData()
  const filteredData = useMemo(() => {
    const lowerSearchTerm = searchTerm?.toLowerCase()
    return {
      orders: orders?.filter(order => 
        order.customerName.toLowerCase().includes(lowerSearchTerm)
      ),
      users: users?.filter(user => 
        user.mobile.includes(searchTerm)
      )
    }
  }, [orders, users, searchTerm])

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
      totalUsers: filteredData.users.length,
      ordersTrend,
      ordersToday,
      ordersYesterday
    }
  }, [filteredData])


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
          
          <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2">
            <StatsCard
                title="Total Orders"
                value={stats.totalOrders}
                icon={<BoxIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-500" />}
                trend={stats.ordersTrend}
                trendValue={`${stats.ordersToday} today (${stats.ordersYesterday} yesterday)`}
            />
            <StatsCard
                title="Total Users"
                value={stats.totalUsers}
                icon={<PersonIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-500" />}
            />
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