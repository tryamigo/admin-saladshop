'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChartIcon,
  PersonIcon,
  BoxIcon,
  GearIcon,
  BellIcon,
  ExitIcon,
} from '@radix-ui/react-icons'
import { Button } from "@/components/ui/button"
import DashboardContent from '../../components/admin/DashboardContent'
import OrdersContent from '../../components/admin/OrdersContent'
import RestaurantsContent from '../../components/admin/RestaurantsContent'
import DeliveryAgentsContent from '../../components/admin/DeliveryAgentsContent'
import UsersContent from '../../components/admin/UsersContent'
import SettingsContent from '../../components/admin/SettingsContent'
import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import ProfileContent from '@/components/admin/ProfileContent'



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
      { id: '1', name: 'Whopper', quantity: 1, price: 5.99 },
      { id: '2', name: 'Fries', quantity: 1, price: 2.99 },
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
      { id: '3', name: 'Pepperoni Pizza', quantity: 1, price: 12.99 },
      { id: '4', name: 'Garlic Bread', quantity: 1, price: 3.00 },
    ],
    deliveryAddress: '456 Elm St, Othertown, USA',
    paymentMethod: 'PayPal',
  },
]

const mockRestaurants: Restaurant[] = [
  { id: '1', name: 'Burger King', cuisine: 'Fast Food', rating: 4.2 ,address:'noida'},
  { id: '2', name: 'Pizza Hut', cuisine: 'Italian', rating: 4.5 ,address:'delhi'},
]

const mockDeliveryAgents: DeliveryAgent[] = [
  { id: '1', name: 'John Smith', status: 'available', completedDeliveries: 100 },
  { id: '2', name: 'Jane Smith', status: 'on delivery', completedDeliveries: 50 },
]

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', registrationDate: new Date('2022-01-01T12:00:00.000Z') },
  { id: '2', name: 'Jane Doe', email: 'jane@example.com', registrationDate: new Date('2022-01-02T13:00:00.000Z') },
]

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard')
  const [orders, setOrders] = useState<Order[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [deliveryAgents, setDeliveryAgents] = useState<DeliveryAgent[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: BarChartIcon, id: 'dashboard' },
    { name: 'Orders', icon: BoxIcon, id: 'orders' },
    { name: 'Restaurants', icon: BarChartIcon, id: 'restaurants' },
    { name: 'Delivery Agents', icon: PersonIcon, id: 'delivery-agents' },
    { name: 'Users', icon: PersonIcon, id: 'users' },
    { name: 'Settings', icon: GearIcon, id: 'settings' },
    { name: 'Profile', icon: PersonIcon, id: 'profile' }, // New menu item

  ]

  useEffect(() => {
    // In a real application, you would fetch data from your API here
    setOrders(mockOrders)
    setRestaurants(mockRestaurants)
    setDeliveryAgents(mockDeliveryAgents)
    setUsers(mockUsers)
  }, [])
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase())
  }
  const renderContent = (): JSX.Element => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent orders={orders} restaurants={restaurants} deliveryAgents={deliveryAgents} users={users} searchTerm={searchTerm} />
      case 'orders':
        return <OrdersContent orders={orders} searchTerm={searchTerm} />
      case 'restaurants':
        return <RestaurantsContent restaurants={restaurants} searchTerm={searchTerm} />
      case 'delivery-agents':
        return <DeliveryAgentsContent deliveryAgents={deliveryAgents} searchTerm={searchTerm} />
      case 'users':
        return <UsersContent users={users} searchTerm={searchTerm} />
      case 'settings':
        return <SettingsContent />
      case 'profile':
        return <ProfileContent />
      default:
        return <DashboardContent orders={orders} restaurants={restaurants} deliveryAgents={deliveryAgents} users={users} searchTerm={searchTerm} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-white shadow-lg"
      >
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <nav className="mt-8">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Button>
          ))}
        </nav>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
  <div className="flex items-center justify-between px-4 py-3">
    <h2 className="text-xl font-semibold text-gray-800">
      {menuItems.find((item) => item.id === activeTab)?.name}
    </h2>
    <div className="flex items-center">
      <div className="relative mr-4">
        <Input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-4 py-2 rounded-md"
          value={searchTerm}
          onChange={handleSearch}
        />
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <Button variant="ghost" size="icon" className="mr-2">
        <BellIcon className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon">
        <ExitIcon className="h-5 w-5" />
      </Button>
    </div>
  </div>
</header>

        {/* Content */}
        <main className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard