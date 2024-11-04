// components/AddAgentModal.tsx
'use client'

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Address } from './admin/types';
import { AddressFields } from './AddressFields';

// This is the type we'll use for the form
interface DeliveryAgentData {
  name: string;
  status: 'available' | 'on delivery' | 'offline';
  completedDeliveries: number;
  phoneNumber: string;
  email: string;
  joinDate: Date;
  rating: number;
  address:Address;
  licenseNumber?: string;
  aadharNumber?: string; 
}

interface AddAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DeliveryAgentData) => Promise<void>;
}

const AddAgentModal: React.FC<AddAgentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<DeliveryAgentData>({
    name: '',
    status: 'available',
    completedDeliveries: 0,
    phoneNumber: '',
    email: '',
    joinDate: new Date(),
    rating: 0,
    address: {
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      latitude:'',
      longitude:'',
      streetAddress:''
      },
    aadharNumber:'',
    licenseNumber:''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s-]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }

    if (formData.completedDeliveries < 0) {
      newErrors.completedDeliveries = 'Completed deliveries cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      await onSubmit(formData);
      setFormData({
        name: '',
        status: 'available',
        completedDeliveries: 0,
        phoneNumber: '',
        email: '',
        joinDate: new Date(),
        rating: 0,
        address: {
            landmark: '',
            city: '',
            state: '',
            pincode: '',
            latitude:'',
            longitude:'',
            streetAddress:''
          },
        aadharNumber:'',
        licenseNumber:''
      });
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' || name === 'completedDeliveries' 
        ? parseInt(value, 10) 
        : value
    }));
  };

  const handleStatusChange = (value: 'available' | 'on delivery' | 'offline') => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Delivery Agent</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              placeholder="Enter agent name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={formData.status || ''}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="on delivery">On Delivery</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AddressFields
                address={formData.address}
                onChange={(updatedAddress) => {
                    setFormData(prev => ({
                    ...prev,
                    address: updatedAddress
                    }));
                }}
                isEditing={true}
                />
          <div className="space-y-2">
            <label className="text-sm font-medium">Completed Deliveries</label>
            <Input
              name="completedDeliveries"
              type="number"
              value={formData.completedDeliveries || ''}
              onChange={handleChange}
              placeholder="Enter completed deliveries"
              min="0"
            />
            {errors.completedDeliveries && (
              <p className="text-red-500 text-sm">{errors.completedDeliveries}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Aadhar Number</label>
            <Input
              name="aadharNumber"
              type="number"
              value={formData.aadharNumber || ''}
              onChange={handleChange}
              placeholder="Enter aadhar Number"
              min="0"
            />
            {errors.aadharNumber && (
              <p className="text-red-500 text-sm">{errors.aadharNumber}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">License Number</label>
            <Input
              name="licenseNumber"
              type="number"
              value={formData.licenseNumber || ''}
              onChange={handleChange}
              placeholder="Enter license Number"
              min="0"
            />
            {errors.licenseNumber && (
              <p className="text-red-500 text-sm">{errors.licenseNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <Input
              name="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Join Date</label>
            <Input
              name="joinDate"
              type="date"
              value={formData.joinDate.toISOString().split('T')[0] || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                joinDate: new Date(e.target.value)
              }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
            <Input
              name="rating"
              type="number"
              step="0.1"
              value={formData.rating || ''}
              onChange={handleChange}
              placeholder="Enter rating (0-5)"
              min="0"
              max="5"
            />
            {errors.rating && (
              <p className="text-red-500 text-sm">{errors.rating}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Agent
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAgentModal