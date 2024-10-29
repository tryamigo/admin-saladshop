'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeftIcon, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { DeliveryAgent, deliveryStatus } from '@/components/admin/types'
import { useParams, useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AddressFields } from '@/components/AddressFields'

const DeliveryAgentDetails: React.FC = () => {
  const [agent, setAgent] = useState<DeliveryAgent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAgent, setEditedAgent] = useState<DeliveryAgent | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    const loadAgentDetails = async () => {
      try {
        const response = await fetch(`/api/agents?id=${id}`);
        const agentDetails = await response.json();
        setAgent(agentDetails.agent);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAgentDetails();
  }, [id]);

  const handleEditAgent = async () => {
    if (!editedAgent) return;

    try {
      const response = await fetch(`/api/agents?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedAgent),
      });

      if (!response.ok) throw new Error('Failed to update agent');

      const updatedAgent = await response.json();
      setAgent(updatedAgent.agent);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating agent:', error);
    }
  };

  const handleDeleteAgent = async () => {
    try {
      const response = await fetch(`/api/agents?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete agent');

      setIsDeleteDialogOpen(false);
      router.push('/agents');
    } catch (error) {
      console.error('Error deleting agent:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!agent) return <div>Agent not found.</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Link href="/agents" passHref>
          <Button variant="outline">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Delivery Agents
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Options</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {
              setIsEditing(true);
              setEditedAgent(agent);
            }}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Agent
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Agent
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Agent</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this agent? This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteAgent}>
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
          <h1 className="text-3xl font-bold mb-4">Edit Agent Details</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={editedAgent?.name || ''}
                onChange={(e) => setEditedAgent(prev => ({ ...prev!, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={editedAgent?.status || ''}
                onValueChange={(value) => setEditedAgent(prev => ({ ...prev!, status: value as deliveryStatus }))}
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
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                value={editedAgent?.phoneNumber || ''}
                onChange={(e) => setEditedAgent(prev => ({ ...prev!, phoneNumber: e.target.value }))}
              />
            </div>
            <AddressFields
            address={editedAgent?.address  || {
              street: '', area: '', city: '', state: '', postalCode: '', country: ''
            }}
            onChange={(updatedAddress) => {
              setEditedAgent(prev => ({
                ...prev!,
                address: updatedAddress
              }));
            }}
            isEditing={true}
          />
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={editedAgent?.email || ''}
                onChange={(e) => setEditedAgent(prev => ({ ...prev!, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Rating</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={editedAgent?.rating || ''}
                onChange={(e) => setEditedAgent(prev => ({ ...prev!, rating: parseFloat(e.target.value) }))}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={handleEditAgent}>Save Changes</Button>
            <Button variant="outline" onClick={() => {
              setIsEditing(false);
              setEditedAgent(null);
            }}>Cancel</Button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">Delivery Agent Details: {agent.name}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 ">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Agent Information</h2>
              <p>Name: {agent.name}</p>
              <p>Phone: {agent.phoneNumber}</p>
              <p>Email: {agent.email}</p>
              <p>Aadhar Number: {agent.aadharNumber}</p>
              <p>License Number: {agent.licenseNumber}</p>
              <p>Join Date: 
                 {agent.joinDate ? new Date(agent.joinDate).toLocaleDateString() : 'N/A'}
              </p>
              <p>Aadhar Number: {agent.aadharNumber}</p>
              <p>License Number:{agent.licenseNumber}</p>
              <AddressFields
              address={agent?.address}
              isEditing={false}
            />
              <div className="mt-2">
                <span>Status:</span>
                <Badge className="ml-2" variant={agent.status === 'available' ? 'secondary' : 'default'}>
                  {agent.status}
                </Badge>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Performance</h2>
              <p>Completed Deliveries:{agent.completedDeliveries}</p>
              <p>Rating: {Number(agent.rating).toFixed(1)} / 5.0</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DeliveryAgentDetails;