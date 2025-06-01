'use client'

import "./globals.css";
import { DataProvider } from '@/contexts/DataContext'
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
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
import { SearchIcon, MenuIcon, XIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useData } from '@/contexts/DataContext'
import { useState } from 'react'
import { signOut } from 'next-auth/react'


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/signin' || pathname === '/error'

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <DataProvider>
            {isAuthPage ? children : <AdminLayout>{children}</AdminLayout>}
            <Toaster />
          </DataProvider>
        </SessionProvider>
      </body>
    </html>
  )
}




export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <div className="flex h-screen bg-gray-100">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <Header toggleSidebar={toggleSidebar} />
        <main className="p-4 sm:p-6">
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

const menuMap: Record<string, string> = {
  '/': 'Dashboard',
  '/orders': 'Orders',
  '/restaurants': 'Restaurants',
  '/users': 'Users',
  '/settings': 'Settings',
  '/profile': 'Profile',
}

export function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { searchTerm, setSearchTerm } = useData()
  const pathname = usePathname()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
            <MenuIcon className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold text-gray-800">{menuMap[pathname] || 'Dashboard'}</h2>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative hidden sm:block">
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-md w-[200px] sm:w-[250px] md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <BellIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

const menuItems = [
  { name: 'Dashboard', icon: BarChartIcon, path: '/' },
  { name: 'Orders', icon: BoxIcon, path: '/orders' },
  { name: 'Menu', icon: BoxIcon, path: '/menu' },
  { name: 'Users', icon: PersonIcon, path: '/users' },
  { name: 'Settings', icon: GearIcon, path: '/settings' },
]

export  function Sidebar({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div
      className={`fixed lg:static w-64 h-full bg-white shadow-lg z-30 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
          <XIcon className="h-5 w-5" />
        </Button>
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant={pathname === item.path ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => {
              router.push(item.path)
              toggleSidebar()
            }}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.name}
          </Button>
        ))}
        <Button
          variant="ghost"
          className="w-full justify-start mt-4"
          onClick={() => signOut({ callbackUrl: '/signin' })}
        >
          <ExitIcon className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </nav>
    </div>
  )
}
