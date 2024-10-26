// app/admin/layout.tsx
'use client'

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
import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useData } from '@/contexts/DataContext'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { searchTerm, setSearchTerm } = useData()
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    { name: 'Dashboard', icon: BarChartIcon, path: '/admin' },
    { name: 'Orders', icon: BoxIcon, path: '/admin/orders' },
    { name: 'Restaurants', icon: BarChartIcon, path: '/admin/restaurants' },
    { name: 'Delivery Agents', icon: PersonIcon, path: '/admin/agents' },
    { name: 'Users', icon: PersonIcon, path: '/admin/users' },
    { name: 'Settings', icon: GearIcon, path: '/admin/settings' },
    { name: 'Profile', icon: PersonIcon, path: '/admin/profile' },
  ]

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase())
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
              key={item.path}
              variant={pathname === item.path ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => router.push(item.path)}
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
              {menuItems.find((item) => item.path === pathname)?.name}
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
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}