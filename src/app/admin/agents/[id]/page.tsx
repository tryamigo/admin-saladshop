'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'

interface DeliveryAgent {
  id: string
  name: string
  status: 'available' | 'on delivery' | 'offline'
  completedDeliveries: number
  phoneNumber: string
  email: string
  joinDate: Date
  rating: number
  currentOrder?: {
    id: string
    restaurantName: string
    customerName: string
    deliveryAddress: string
  }
}

// You would typically fetch this data from an API
const fetchDeliveryAgentDetails = async (id: string): Promise<DeliveryAgent> => {
  // Simulated API call
  return {
    id,
    name: "John Doe",
    status: "on delivery",
    completedDeliveries: 150,
    phoneNumber: "(555) 123-4567",
    email: "john.doe@example.com",
    joinDate: new Date("2022-01-15"),
    rating: 4.8,
    currentOrder: {
      id: "ORD123",
      restaurantName: "Burger Palace",
      customerName: "Alice Smith",
      deliveryAddress: "456 Elm St, Anytown, AN 12345"
    }
  }
}

const DeliveryAgentDetails: React.FC<{ id: string }> = ({ id }) => {
  const [agent, setAgent] = useState<DeliveryAgent | null>(null)

  useEffect(() => {
    fetchDeliveryAgentDetails(id).then(setAgent)
  }, [id])

  if (!agent) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-4">
      <Link href="/admin" passHref>
        <Button variant="outline" className="mb-4">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Delivery Agents
        </Button>
      </Link>

      <h1 className="text-3xl font-bold mb-4">Delivery Agent Details: {agent.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Agent Information</h2>
          <p><strong>ID:</strong> {agent.id}</p>
          <p><strong>Name:</strong> {agent.name}</p>
          <p><strong>Phone:</strong> {agent.phoneNumber}</p>
          <p><strong>Email:</strong> {agent.email}</p>
          <p><strong>Join Date:</strong> {agent.joinDate.toLocaleDateString()}</p>
          <div className="mt-2">
            <span><strong>Status:</strong></span>
            <Badge className="ml-2" variant={agent.status === 'available' ? 'secondary' : agent.status === 'on delivery' ? 'default' : 'destructive'}>
              {agent.status}
            </Badge>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Performance</h2>
          <p><strong>Completed Deliveries:</strong> {agent.completedDeliveries}</p>
          <p><strong>Rating:</strong> {agent.rating.toFixed(1)} / 5.0</p>
        </div>
      </div>

      {agent.currentOrder && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Current Order</h2>
          <p><strong>Order ID:</strong> {agent.currentOrder.id}</p>
          <p><strong>Restaurant:</strong> {agent.currentOrder.restaurantName}</p>
          <p><strong>Customer:</strong> {agent.currentOrder.customerName}</p>
          <p><strong>Delivery Address:</strong> {agent.currentOrder.deliveryAddress}</p>
        </div>
      )}
    </div>
  )
}

export default DeliveryAgentDetails