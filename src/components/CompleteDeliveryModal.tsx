// components/CompleteDeliveryModal.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CompleteDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assignmentData: { orderId: string, agentId: string }) => void;
  orders: any[];
}

const CompleteDeliveryModal: React.FC<CompleteDeliveryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  orders,
}) => {
  const [assignmentData, setAssignmentData] = useState<{ orderId: string, agentId: string }>({
    orderId: '',
    agentId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!assignmentData.orderId || !assignmentData.agentId) {
      // Handle error
      return;
    }

    try {
      await onSubmit(assignmentData);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Delivery</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Select 
              onValueChange={(value) => setAssignmentData({...assignmentData, orderId: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Order" />
              </SelectTrigger>
              <SelectContent>
                {orders.map((order) => (
                  <SelectItem key={order.id} value={order.id}>{order.customerName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              onValueChange={(value) => setAssignmentData({...assignmentData, agentId: value})}
            >
            </Select>
            <Button type="submit">Complete Delivery</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteDeliveryModal;