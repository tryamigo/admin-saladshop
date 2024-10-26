'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'


// You would typically fetch this data from an API
const fetchUserDetails = async (id: string): Promise<User> => {
  // Simulated API call
  return {
    id,
    name: "John Doe",
    email: "john.doe@example.com",
    registrationDate: new Date("2022-01-15"),
    phoneNumber: "(555) 123-4567",
    address: "123 Main St, Anytown, AN 12345",
    orderHistory: [
      { id: "ORD001", date: new Date("2023-05-01"), total: 25.99, status: "Delivered" },
      { id: "ORD002", date: new Date("2023-05-15"), total: 32.50, status: "Processing" },
    ]
  }
}

const UserDetails: React.FC<{ id: string }> = ({ id }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUserDetails(id).then(setUser)
  }, [id])

  if (!user) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-4">
      <Link href="/admin/users" passHref>
        <Button variant="outline" className="mb-4">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
      </Link>

      <div className="flex items-center mb-6">
        <Avatar className="w-16 h-16 mr-4">
          <AvatarImage src={`https://avatars.dicebear.com/api/initials/${user.name}.svg`} />
          <AvatarFallback delayMs={600}>
            <div className="bg-gray-200 rounded-full w-full h-full" />
          </AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold">{user.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">User Information</h2>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phoneNumber}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <p><strong>Registration Date:</strong> {format(user.registrationDate, 'yyyy-MM-dd HH:mm')}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Order Statistics</h2>
          <p><strong>Total Orders:</strong> {user.orderHistory.length}</p>
          <p><strong>Total Spent:</strong> ${user.orderHistory.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Order History</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Order ID</th>
              <th className="text-left">Date</th>
              <th className="text-left">Total</th>
              <th className="text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {user.orderHistory.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="py-2">{order.id}</td>
                <td className="py-2">{format(order.date, 'yyyy-MM-dd HH:mm')}</td>
                <td className="py-2">${order.total.toFixed(2)}</td>
                <td className="py-2">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserDetails