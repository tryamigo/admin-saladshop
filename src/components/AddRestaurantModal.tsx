import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AddRestaurantModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (restaurantData: Partial <Restaurant>) => void
}

const AddRestaurantModal: React.FC<AddRestaurantModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [restaurantData, setRestaurantData] = useState<Partial<Restaurant>>({
    name: '',
    address: '',
    
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(restaurantData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Restaurant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input 
              placeholder="Restaurant Name" 
              value={restaurantData.name} 
              onChange={(e) => setRestaurantData({...restaurantData, name: e.target.value})}
            />
            <Input 
              placeholder="Restaurant Address" 
              value={restaurantData.address} 
              onChange={(e) => setRestaurantData({...restaurantData, address: e.target.value})}
            />
            <Button type="submit">Add Restaurant</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddRestaurantModal