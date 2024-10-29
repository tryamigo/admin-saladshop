'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftIcon, Edit, Trash2, X, Plus } from 'lucide-react';
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Order, OrderItem, OrderStatus } from '@/components/admin/types';
import { AddressFields } from '@/components/AddressFields';

const OrderDetails: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<OrderItem>({
    id: Date.now().toString(), // Generate a temporary ID
    name: '',
    quantity: 1,
    price: 0,
    ratings: 0
  });

  const fetchOrderDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/orders?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch order details');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchOrderDetails(id).then(setOrder);
  }, [id]);

  const handleEditOrder = async () => {
    if (!editedOrder) return;

    try {
      const response = await fetch(`/api/orders?orderId=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedOrder),
      });

      if (!response.ok) throw new Error('Failed to update order');

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      const response = await fetch(`/api/orders?orderId=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete order');

      setIsDeleteDialogOpen(false);
      router.push('/orders');
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleUpdateItem = (itemId: string, field: keyof OrderItem, value: string | number) => {
    if (!editedOrder) return;

    const updatedItems = editedOrder.items.map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    );

    setEditedOrder({
      ...editedOrder,
      items: updatedItems,
      total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    });
  };

  const handleRemoveItem = (itemId: string) => {
    if (!editedOrder) return;

    const updatedItems = editedOrder.items.filter(item => item.id !== itemId);

    setEditedOrder({
      ...editedOrder,
      items: updatedItems,
      total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    });
  };

  const handleAddItem = () => {
    if (!editedOrder || !newItem.name || newItem.quantity <= 0 || newItem.price <= 0) return;

    const updatedItems = [...editedOrder .items, { ...newItem, id: Date.now().toString() }];

    setEditedOrder({
      ...editedOrder,
      items: updatedItems,
      total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    });

    // Reset new item form
    setNewItem({
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      price: 0,
      ratings: 0
    });
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Link href="/orders" passHref>
          <Button variant="outline">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Options</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {
              setIsEditing(true);
              setEditedOrder(order);
            }}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Order
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this order? This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteOrder}>
              Delete
            </Button>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input
                value={editedOrder?.customerName || ''}
                onChange={(e) => setEditedOrder(prev => ({ ...prev!, customerName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Restaurant Name</Label>
              <Input
                value={editedOrder?.restaurantName || ''}
                onChange={(e) => setEditedOrder(prev => ({ ...prev!, restaurantName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={editedOrder?.status}
                onValueChange={(value: OrderStatus) =>
                  setEditedOrder(prev => ({ ...prev!, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="on the way">On the way</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <AddressFields
              address={editedOrder?.deliveryAddress || {
                street: '', area: '', city: '', state: '', postalCode: '', country: ''
              }}
              onChange={(updatedAddress) => {
                setEditedOrder(prev => ({ ...prev!, deliveryAddress: updatedAddress }));
              }}
              isEditing={true}
            />
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Input
                value={editedOrder?.paymentMethod || ''}
                onChange={(e) => setEditedOrder(prev => ({ ...prev!, paymentMethod: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Order Items</h3>
            </div>

            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Item</th>
                  <th className="text-left">Quantity</th>
                  <th className="text-left">Price</th>
                  <th className="text-left">Subtotal</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {editedOrder?.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <Input
                        value={item.name}
                        onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id, 'quantity', parseInt(e.target.value))}
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) => handleUpdateItem(item.id, 'price', parseFloat(e.target.value))}
                      />
                    </td>
                    <td>${(item.quantity * item.price).toFixed(2)}</td>
                    <td>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {/* New Item Row */}
                <tr>
                  <td>
                    <Input
                      placeholder="Item name"
                      value={newItem.name || ''}
                      onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      value={newItem.quantity || ''}
                      onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      value={newItem.price || ''}
                      onChange={(e) => setNewItem(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                    />
                  </td>
                  <td>${(newItem.quantity * newItem.price).toFixed(2)}</td>
                  <td>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddItem}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-right font-bold">Total:</td>
                  <td className="font-bold" colSpan={2}>
                    ${Number(editedOrder?.total).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleEditOrder}>Save Changes</Button>
            <Button variant="outline" onClick={() => {
              setIsEditing(false);
              setEditedOrder(null);
            }}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-3xl font-bold mb-4">Order Details:</h2>
          < div className="grid grid-cols-1 md:grid-cols-2 ">
            <div className="space-y-2">
              <Label>Customer Name:</Label>
              <Badge variant="outline">{order?.customerName}</Badge>
            </div>
            <div className="space-y-2">
              <Label>Restaurant Name:</Label>
              <Badge variant="outline">{order?.restaurantName}</Badge>
            </div>
            <div className="space-y-2">
              <Label>Status:</Label>
              <Badge variant="outline">{order?.status}</Badge>
            </div>
           
            <div className="space-y-2">
              <Label>Payment Method:</Label>
              <Badge variant="outline">{order?.paymentMethod}</Badge>
            </div>
          </div>

          <AddressFields
              address={order.deliveryAddress}
              isEditing={false}
            />
          <div className="space-y-4">
            <h3 className="font-medium">Order Items:</h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Item</th>
                  <th className="text-left">Quantity</th>
                  <th className="text-left">Price</th>
                  <th className="text-left">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order?.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-right font-bold">Total:</td>
                  <td className="font-bold" colSpan={2}>
                    ${Number(order?.total).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;