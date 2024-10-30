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
      streetAddress: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      latitude: '',
      longitude: ''
    },
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
    setRestaurantData(prev => ({ ...prev, [name]: value }));
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