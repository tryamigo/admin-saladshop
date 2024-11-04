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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

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

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );
  if (error) return <div>Error: {error}</div>

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Restaurants</CardTitle>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Restaurant
        </Button>
      </CardHeader>
      <CardContent>
      
        <div className="overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="h-10 px-4 text-left align-middle font-medium text-gray-500">No.</th>
                <th className="h-10 px-4 text-left align-middle font-medium text-gray-500">Name</th>
                <th className="h-10 px-4 text-left align-middle font-medium text-gray-500">Address</th>
                <th className="h-10 px-4 text-left align-middle font-medium text-gray-500">Phone Number</th>
                <th className="h-10 px-4 text-left align-middle font-medium text-gray-500">Opening Hours</th>
                <th className="h-10 px-4 text-left align-middle font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRestaurants.map((restaurant, index) => (
                <tr key={restaurant.id} className="border-b transition-colors hover:bg-gray-50">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 font-medium">{restaurant.name}</td>
                  <td className="p-4">
                    {restaurant.address && (
                      <>
                        <div>{restaurant.address.streetAddress}</div>
                        {restaurant.address.landmark && <div>{restaurant.address.landmark}</div>}
                        <div>{restaurant.address.city}, {restaurant.address.state} {restaurant.address.pincode}</div>
                      </>
                    )}
                  </td>
                  <td className="p-4">{restaurant.phoneNumber}</td>
                  <td className="p-4">{restaurant.openingHours}</td>
                  <td className="p-4">
                    <Link href={`/restaurants/${restaurant.id}`} passHref>
                      <Button variant="outline" size="sm">
                        <EyeIcon className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRestaurants.length === 0 && !isLoading && !error && (
          <p className="text-center mt-4 text-gray-500">No restaurants found. Add some restaurants to get started!</p>
        )}
      </CardContent>
      <AddRestaurantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddRestaurant}
      />
    </Card>
  )
}

export default RestaurantsContentPage