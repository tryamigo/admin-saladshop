'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeftIcon, Star } from 'lucide-react'
import Link from 'next/link'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
}

interface Restaurant {
  id: string
  name: string
  cuisine: string
  rating: number
  address: string
  phoneNumber: string
  openingHours: string
  menu: MenuItem[]
}

// You would typically fetch this data from an API
const fetchRestaurantDetails = async (id: string): Promise<Restaurant> => {
  // Simulated API call
  return {
    id,
    name: "Burger Palace",
    cuisine: "American",
    rating: 4.5,
    address: "123 Main St, Anytown, AN 12345",
    phoneNumber: "(555) 123-4567",
    openingHours: "Mon-Sun: 11:00 AM - 10:00 PM",
    menu: [
      { id: "1", name: "Classic Burger", description: "Beef patty with lettuce, tomato, and cheese", price: 9.99 },
      { id: "2", name: "Veggie Burger", description: "Plant-based patty with avocado and sprouts", price: 10.99 },
      { id: "3", name: "Fries", description: "Crispy golden fries", price: 3.99 },
      { id: "4", name: "Milkshake", description: "Creamy vanilla milkshake", price: 4.99 },
    ]
  }
}

const RestaurantDetails: React.FC<{ id: string }> = ({ id }) => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)

  useEffect(() => {
    fetchRestaurantDetails(id).then(setRestaurant)
  }, [id])

  if (!restaurant) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-4">
      <Link href="/admin" passHref>
        <Button variant="outline" className="mb-4">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Restaurants
        </Button>
      </Link>

      <h1 className="text-3xl font-bold mb-4">{restaurant.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Restaurant Information</h2>
          <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
          <p><strong>Address:</strong> {restaurant.address}</p>
          <p><strong>Phone:</strong> {restaurant.phoneNumber}</p>
          <p><strong>Hours:</strong> {restaurant.openingHours}</p>
          <div className="mt-2">
            <span><strong>Rating:</strong></span>
            <Badge className="ml-2" variant={restaurant.rating >= 4 ? 'secondary' : 'default'}>
              {restaurant.rating.toFixed(1)} <Star className="h-4 w-4 inline ml-1" />
            </Badge>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Quick Stats</h2>
          <p><strong>Total Menu Items:</strong> {restaurant.menu.length}</p>
          <p><strong>Average Item Price:</strong> ${(restaurant.menu.reduce((acc, item) => acc + item.price, 0) / restaurant.menu.length).toFixed(2)}</p>
          {/* Add more stats as needed */}
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Menu</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Item</th>
              <th className="text-left">Description</th>
              <th className="text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            {restaurant.menu.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2">{item.name}</td>
                <td className="py-2">{item.description}</td>
                <td className="py-2">${item.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RestaurantDetails