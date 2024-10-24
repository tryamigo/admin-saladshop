import React, { useMemo } from 'react'
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { Button } from '../ui/button'
import { EyeIcon } from 'lucide-react'

interface RestaurantsContentProps {
  restaurants: Restaurant[]
  searchTerm: string
}

const RestaurantsContent: React.FC<RestaurantsContentProps> = ({ restaurants, searchTerm }) => {
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.id.toString().includes(searchTerm)
    )
  }, [restaurants, searchTerm])

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Restaurants</h3>
      <table className="w-full caption-bottom text-sm">
        <thead className="border-b">
          <tr>
            <th className="h-10 px-2 text-left align-middle font-medium">Restaurant ID</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Name</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Cuisine</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Rating</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRestaurants.map((restaurant) => (
            <tr key={restaurant.id} className="border-b transition-colors hover:bg-muted/50">
              <td className="p-2">{restaurant.id}</td>
              <td className="p-2">{restaurant.name}</td>
              <td className="p-2">{restaurant.cuisine}</td>
              <td className="p-2">
                <Badge
                  variant={
                    restaurant.rating >= 4
                      ? 'secondary'
                      : restaurant.rating >= 3
                      ? 'default'
                      : 'destructive'
                  }
                >
                  {restaurant.rating.toFixed(1)}
                </Badge>
              </td>
              <td className="p-2">
                <Link href={`/admin/restaurants/${restaurant.id}`} passHref>
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
      {filteredRestaurants.length === 0 && (
        <p className="text-center mt-4 text-muted-foreground">No restaurants found matching your search.</p>
      )}
    </div>
  )
}

export default RestaurantsContent