'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftIcon, Edit } from 'lucide-react';
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
import { Order, OrderStatus } from '@/components/admin/types';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const OrderDetails: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { toast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  const { data: session, status } = useSession();

  const fetchOrderDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`,
        }
      });
      if (!response.ok) throw new Error('Failed to fetch order details');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch order details",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrderDetails(id).then(setOrder);
    }
  }, [id, session, status]);

  const handleEditOrder = async () => {
    if (!editedOrder) return;

    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
        body: JSON.stringify({ status: editedOrder.status }),
      });

      if (!response.ok) throw new Error('Failed to update order');

      const updatedOrder = await fetchOrderDetails(id);
      setOrder(updatedOrder);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Order updated successfully",
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      });
    }
  };

  if (!order) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl bg-white shadow rounded-lg space-y-6">
      <div className="flex flex-row justify-between items-center pb-4 border-b">
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>User ID</Label>
              <Input
                value={order.userId}
                disabled
                className="bg-gray-100"
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
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Preparing">Preparing</SelectItem>
                  <SelectItem value="Ready for Pickup">Ready for Pickup</SelectItem>
                  <SelectItem value="Order Collected">Order Collected</SelectItem>
                  <SelectItem value="Ask for cancel">Ask for cancel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Total Amount</Label>
              <Input
                value={`$${order.total.toFixed(2)}`}
                disabled
                className="bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label>Order Time</Label>
              <Input
                value={format(new Date(order.orderTime), 'PPp')}
                disabled
                className="bg-gray-100"
              />
            </div>
            {order.deliveryTime && (
              <div className="space-y-2">
                <Label>Delivery Time</Label>
                <Input
                  value={format(new Date(order.deliveryTime), 'PPp')}
                  disabled
                  className="bg-gray-100"
                />
              </div>
            )}
            {order.userAddress && (
              <div className="space-y-2">
                <Label>Delivery Address</Label>
                <Input
                  value={order.userAddress}
                  disabled
                  className="bg-gray-100"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditOrder}>
              Save Changes
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Order Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Order ID:</span> {order.id}</p>
                <p><span className="font-medium">User ID:</span> {order.userId}</p>
                <p><span className="font-medium">Status:</span> <Badge>{order.status}</Badge></p>
                <p><span className="font-medium">Total:</span> ${order.total.toFixed(2)}</p>
                <p><span className="font-medium">Order Time:</span> {format(new Date(order.orderTime), 'PPp')}</p>
                {order.deliveryTime && (
                  <p><span className="font-medium">Delivery Time:</span> {format(new Date(order.deliveryTime), 'PPp')}</p>
                )}
              </div>
            </div>

            {order.userAddress && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Delivery Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Address:</span> {order.userAddress}</p>
                </div>
              </div>
            )}

            <div className="col-span-2">
              <h3 className="text-lg font-semibold mb-2">Order Items</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.orderItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;