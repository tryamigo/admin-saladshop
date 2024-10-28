// src/components/AddRestaurantModal.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Address } from './admin/types';
import { AddressFields } from './AddressFields';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  address: Address;
  phoneNumber: string;
  openingHours: string;
}

interface AddRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (restaurantData: Omit<Restaurant, 'id'>) => void;
}

const AddRestaurantModal: React.FC<AddRestaurantModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [restaurantData, setRestaurantData] = useState<Omit<Restaurant, 'id'>>({
    name: '',
    address: {
      street: '',
      area: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    cuisine: '',
    rating: 0,
    phoneNumber: '',
    openingHours: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(restaurantData);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'street' || name === 'area' || name === 'city' || name === 'state' || name === 'postalCode' || name === 'country') {
      setRestaurantData(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
    } else {
      setRestaurantData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRatingChange = (value: string) => {
    setRestaurantData(prev => ({ ...prev, rating: parseFloat(value) }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Restaurant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input 
              name="name"
              placeholder="Restaurant Name" 
              value={restaurantData.name} 
              onChange={handleInputChange}
            />
        <AddressFields
          address={restaurantData.address}
          onChange={(updatedAddress) => {
            setRestaurantData(prev => ({ ...prev, address: updatedAddress }));
          }}
          isEditing={true}
        />
            <Input 
              name="cuisine"
              placeholder="Cuisine Type" 
              value={restaurantData.cuisine || ''} 
              onChange={handleInputChange}
            />
            <Select onValueChange={handleRatingChange}>
              <SelectTrigger>
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map(rating => (
                  <SelectItem key={rating} value={rating.toString()}>{rating}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input 
              name="phoneNumber"
              placeholder="Phone Number" 
              value={restaurantData.phoneNumber} 
              onChange={handleInputChange}
            />
            <Input 
              name="openingHours"
              placeholder="Opening Hours" 
              value={restaurantData.openingHours} 
              onChange={handleInputChange}
            />
            <Button type="submit">Add Restaurant</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRestaurantModal;