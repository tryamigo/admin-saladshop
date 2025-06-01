import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Order, OrderItem, OrderStatus,  } from './admin/types';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orderData: Partial<Order>) => void;
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
}) => {
  const initialOrderData: Partial<Order> = {
    customerName: '',
    restaurantId: '', // Changed from restaurantName
    status: 'pending',
    total: 0,
    date: new Date(),
    items: [],
    userAddress: '', // Changed from deliveryAddress
    userLatitude: 0, // Added
    userLongitude: 0, // Added
    paymentMethod: '',
    mobile: ''
  };

  const [orderData, setOrderData] = useState<Partial<Order>>(initialOrderData);
  const [currentItem, setCurrentItem] = useState<Partial<OrderItem>>({
    name: '',
    quantity: 1,
    price: 0,
    ratings: 0,
    discount: 0, // Added
    description: '', // Added
    imageLink: '' // Added
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedTotal = orderData.items?.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    ) || 0;

    onSubmit({
      ...orderData,
      date: new Date(),
      total: calculatedTotal,
      status: 'pending' as OrderStatus
    });
    setOrderData(initialOrderData);
    onClose();
  };

  const handleAddItem = () => {
    if (currentItem.name && currentItem.price) {
      setOrderData(prev => ({
        ...prev,
        items: [...(prev.items || []), {
          id: crypto.randomUUID(),
          name: currentItem.name!,
          quantity: currentItem.quantity || 1,
          price: currentItem.price || 0,
          ratings: currentItem.ratings || 0,
          discount: currentItem.discount || 0,
          description: currentItem.description || '',
          imageLink: currentItem.imageLink || ''
        }]
      }));
      setCurrentItem({
        name: '',
        quantity: 1,
        price: 0,
        ratings: 0,
        discount: 0,
        description: '',
        imageLink: ''
      });
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setOrderData(prev => ({
      ...prev,
      items: prev.items?.filter(item => item.id !== itemId) || []
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input 
                id="customerName"
                placeholder="Customer Name" 
                value={orderData.customerName || ''} 
                onChange={(e) => setOrderData({...orderData, customerName: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input 
                id="mobile"
                placeholder="Mobile Number" 
                value={orderData.mobile || ''} 
                onChange={(e) => setOrderData({...orderData, mobile: e.target.value})}
                required
              />
            </div>
            {/* Restaurant Selection */}
            <div className="space-y-2">
              <Label>Restaurant</Label>
              <Select 
                value={orderData.restaurantId || ''}
                onValueChange={(value) => {
                  setOrderData({
                    ...orderData, 
                    restaurantId: value
                  });
                }}
              >
              </Select>
            </div>

            {/* User Address */}
            <div className="space-y-2">
              <Label>User Address</Label>
              <Input 
                placeholder="Address"
                value={orderData.userAddress || ''} 
                onChange={(e) => setOrderData({...orderData, userAddress: e.target.value})}
                required
              />
            </div>

            {/* Latitude and Longitude */}
            <div className="space-y-2">
              <Label>Latitude</Label>
              <Input 
                type="number"
                placeholder="Latitude"
                value={orderData.userLatitude || ''} 
                onChange={(e) => setOrderData({
                  ...orderData, 
                  userLatitude: parseFloat(e.target.value)
                })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Longitude</Label>
              <Input 
                type="number"
                placeholder="Longitude"
                value={orderData.userLongitude || ''} 
                onChange={(e) => setOrderData({
                  ...orderData, 
                  userLongitude: parseFloat(e.target.value)
                })}
                required
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select 
                value={orderData.paymentMethod || ''}
                onValueChange={(value) => setOrderData({...orderData, paymentMethod: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-4">
            <h3 className="font-medium">Order Items</h3>
            
            {/* Add Item Form */}
            <div className="grid grid-cols-2 gap-2">
              <Input 
                placeholder="Item Name"
                value={currentItem.name || ''}
                onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
              />
              <Input 
                placeholder="Description"
                value={currentItem.description || ''}
                onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})}
              />
              <Input 
                type="number"
                placeholder="Quantity"
                value={currentItem.quantity || ''}
                onChange={(e) => setCurrentItem({
                  ...currentItem, 
                  quantity: parseInt(e.target.value)
                })}
                min="1"
              />
              <Input 
                type="number"
                placeholder="Price"
                value={currentItem.price || ''}
                onChange={(e) => setCurrentItem({
                  ...currentItem, 
                  price: parseFloat(e.target.value) || 0
                })}
                min="0"
                step=" 0.01"
              />
              <Input 
                type="number"
                placeholder="Discount"
                value={currentItem.discount || ''}
                onChange={(e) => setCurrentItem({
                  ...currentItem, 
                  discount: parseFloat(e.target.value) || 0
                })}
                min="0"
                step="0.01"
              />
              <Input 
                placeholder="Image Link"
                value={currentItem.imageLink || ''}
                onChange={(e) => setCurrentItem({...currentItem, imageLink: e.target.value})}
              />
              <Button 
                type="button" 
                onClick={handleAddItem}
                disabled={!currentItem.name || !currentItem.price}
              >
                Add Item
              </Button>
            </div>

            {/* Items List */}
            <div className="space-y-2">
              {orderData.items?.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2 border rounded">
                  <span>{item.name}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>${item.price.toFixed(2)}</span>
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="text-right font-medium">
              Total: ${orderData.items?.reduce(
                (sum, item) => sum + (item.price * item.quantity), 
                0
              ).toFixed(2) || '0.00'}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={!orderData.customerName || 
                     !orderData.userAddress || 
                     !orderData.paymentMethod || 
                     !orderData.mobile ||
                     orderData.items?.length === 0}
          >
            Create Order
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrderModal;