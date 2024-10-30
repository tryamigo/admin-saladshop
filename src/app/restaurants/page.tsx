'use client'
import React, { useMemo, useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { EyeIcon, PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AddRestaurantModal from '@/components/AddRestaurantModal'
import { useData } from '@/contexts/DataContext'
import { Restaurant } from '@/components/admin/types'
import { useSession } from 'next-auth/react'

const RestaurantsContentPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { searchTerm } = useData()
  const {data : session,status} =useSession()

  const fetchRestaurants = async () => {
    if (status !== 'authenticated' || !session?.user?.accessToken) {
      return;
    }
    setIsLoading(true)
    try {
      const response = await fetch('/api/restaurants',{
        headers:{
          Authorization: `Bearer ${session?.user.accessToken}`,

        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants')
      }
      const data = await response.json()
      setRestaurants(Array.isArray(data) ? data : []);
      
    } catch (err) {
      setError('Failed to load restaurants')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddRestaurant = async (restaurantData: Omit<Restaurant, 'id'>) => {
    try {
      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user.accessToken}`,

        },
        body: JSON.stringify(restaurantData),
      })
      if (!response.ok) {
        throw new Error('Failed to add restaurant')
      }
      const newRestaurant = await response.json()
      setRestaurants(prev => [...prev, newRestaurant])
      setIsAddModalOpen(false)
    } catch (err) {
      console.error('Failed to add restaurant:', err)
    }
  }

  useEffect(() => {
    fetchRestaurants()
  }, [status,session])

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.id.toString().includes(searchTerm)
    )
  }, [restaurants, searchTerm])

  if (isLoading) return <div>Loading restaurants...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold"></h3>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Restaurant
        </Button>
      </div>
      <table className="w-full caption-bottom text-sm">
        <thead className="border-b">
          <tr>
            <th className="h-10 px-2 text-left align-middle font-medium">No.</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Name</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Rating</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Address</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Phone Number</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Opening Hours</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRestaurants.map((restaurant, index) => (
            <tr key={restaurant.id} className="border-b transition-colors hover:bg-muted/50">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{restaurant.name}</td>
              <td className="p-2">
  
              </td>
              <td className="p-2">
  {restaurant.address && (
    <>
      <div>{restaurant.address.streetAddress}</div>
      {restaurant.address.landmark && <div>{restaurant.address.landmark}</div>}
      <div>{restaurant.address.city}</div>
      <div>{restaurant.address.state}</div>
      <div>{restaurant.address.pincode}</div>
      <div>{restaurant.address.latitude}</div>
      <div>{restaurant.address.longitude}</div>
    </>
  )}
</td>
              <td className="p-2">{restaurant.phoneNumber}</td>
              <td className="p-2">{restaurant.openingHours}</td>
              <td className="p-2">
                <Link href={`/restaurants/${restaurant.id}`} passHref>
                  <Button variant="ghost" size="sm">
                    <EyeIcon className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredRestaurants.length === 0 && !isLoading && !error && (
        <p className="text-center mt-4 text-muted-foreground">No restaurants found. Add some restaurants to get started!</p>
      )}
      <AddRestaurantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddRestaurant}
      />
    </div>
  )
}

export default RestaurantsContentPage