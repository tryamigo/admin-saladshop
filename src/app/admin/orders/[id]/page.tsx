'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'



// You would typically fetch this data from an API
const fetchOrderDetails = async (id: string): Promise<Order> => {
  // Simulated API call
  return {
    id,
    customerName: "John Doe",
    restaurantName: "Burger Palace",
    status: "preparing",
    total: 35.99,
    date: new Date(),
    items: [
      { id: "1", name: "Cheeseburger", quantity: 2, price: 12.99 },
      { id: "2", name: "Fries", quantity: 1, price: 3.99 },
      { id: "3", name: "Soda", quantity: 2, price: 2.99 },
    ],
    deliveryAddress: "123 Main St, Anytown, AN 12345",
    paymentMethod: "Credit Card"
  }
}

const OrderDetails: React.FC<{ id: string }> = ({ id }) => {
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrderDetails(id).then(setOrder)
  }, [id])

  if (!order) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-4">
      <Link href="/admin" passHref>
        <Button variant="outline" className="mb-4">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
      </Link>
    <div>
      <h1 className="text-3xl font-bold mb-4">Order Details: {order.id}</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Customer Information</h2>
          <p><strong>Name:</strong> {order.customerName}</p>
          <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Order Information</h2>
          <p><strong>Restaurant:</strong> {order.restaurantName}</p>
          <p><strong>Date:</strong> {order.date.toLocaleString()}</p>
          <div>
          <span><strong>Status:</strong></span> <Badge>{order.status}</Badge>
            </div>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        </div>
      </div>

      <div className="mt-4 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Order Items</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Item</th>
              <th className="text-left">Quantity</th>
              <th className="text-left">Price</th>
              <th className="text-left">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-right font-bold">Total:</td>
              <td className="font-bold">${order.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default OrderDetails