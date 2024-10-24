import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CreateOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (orderData: Partial<Order>) => void
  restaurants: Restaurant[]
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ isOpen, onClose, onSubmit, restaurants }) => {
  const [orderData, setOrderData] = useState<Partial<Order>>({
    customerName: '',
    id: '',
    items: [],
    deliveryAddress: '',
    status: 'pending'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(orderData)
    // Reset form after submission
    setOrderData({
      customerName: '',
      id: '',
      items: [],
      deliveryAddress: '',
      status: 'pending'
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input 
              placeholder="Customer Name" 
              value={orderData.customerName} 
              onChange={(e) => setOrderData({...orderData, customerName: e.target.value})}
            />
            <Select 
              onValueChange={(value) => setOrderData({...orderData, id: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Restaurant" />
              </SelectTrigger>
              <SelectContent>
                {restaurants.map((restaurant) => (
                  <SelectItem key={restaurant.id} value={restaurant.id}>{restaurant.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input 
              placeholder="Delivery Address" 
              value={orderData.deliveryAddress} 
              onChange={(e) => setOrderData({...orderData, deliveryAddress: e.target.value})}
            />
            <Button type="submit">Create Order</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateOrderModal