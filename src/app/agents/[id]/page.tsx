'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeftIcon, Edit, Trash2, Star, Package, Phone, Mail, IdCard, Calendar, MapPin, CreditCard, FileText } from 'lucide-react'
import Link from 'next/link'
import { DeliveryAgent, deliveryStatus } from '@/components/admin/types'
import { useParams, useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
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
import { useSession } from 'next-auth/react'

const DeliveryAgentDetails: React.FC = () => {
  const [agent, setAgent] = useState<DeliveryAgent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAgent, setEditedAgent] = useState<DeliveryAgent | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const {data: session} = useSession()
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    const loadAgentDetails = async () => {
      try {
        const response = await fetch(`/api/agents?id=${id}`, {
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
        });
        const agentDetails = await response.json();
        setAgent(agentDetails.agent);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAgentDetails();
  }, [id, session]);

  const handleEditAgent = async () => {
    if (!editedAgent) return;

    try {
      const response = await fetch(`/api/agents?id=${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
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
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete agent');

      setIsDeleteDialogOpen(false);
      router.push('/agents');
    } catch (error) {
      console.error('Error deleting agent:', error);
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );
  if (!agent) return <div className="text-center text-red-500">Agent not found.</div>;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Delivery Agent Details</CardTitle>
          <div className="flex space-x-2">
            <Link href="/agents" passHref>
              <Button variant="outline" className="hover:bg-gray-100">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Agents
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hover:bg-gray-100">Actions</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  onClick={() => {
                    setIsEditing(true);
                    setEditedAgent(agent);
                  }}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Agent
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-red-600 cursor-pointer hover:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Agent
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Agent</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this agent? This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteAgent}>Delete</Button>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Agent Details</CardTitle>
            <CardDescription>Update the information for {agent.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={editedAgent?.name || ''}
                  onChange={(e) => setEditedAgent(prev => ({ ...prev!, name: e.target.value }))}
                  className="w-full"
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
                </Select >
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  value={editedAgent?.phoneNumber || ''}
                  onChange={(e) => setEditedAgent(prev => ({ ...prev!, phoneNumber: e.target.value }))}
                  className="w-full"
                />
              </div>
              <AddressFields
                address={editedAgent?.address || {
                  streetAddress: '', landmark: '', city: '', state: '', pincode: '', latitude: '', longitude: ''
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
                  className="w-full"
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
                  className="w-full"
                />
              </div>
            </div>
            <CardFooter className="flex justify-end gap-2">
              <Button onClick={handleEditAgent} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
              <Button variant="outline" onClick={() => {
                setIsEditing(false);
                setEditedAgent(null);
              }}>Cancel</Button>
            </CardFooter>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                {agent.name}
                <Badge 
                  className={`ml-2 ${
                    agent.status === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : agent.status === 'on delivery'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {agent.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <IdCard className="h-5 w-5 text-gray-500" />
                  Personal Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{agent.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{agent.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Joined: {agent.joinDate ? new Date(agent.joinDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Star className="h-5 w-5 text-gray-500" />
                  Performance Metrics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Completed Deliveries</div>
                    <div className="text-2xl font-bold">{agent.completedDeliveries}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Rating</div>
                    <div className="text-2xl font-bold flex items-center gap-2">
                      {agent.rating} / 5.0
                      <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-500" />
                Delivery Information
 </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-gray-500" />
                  Payment Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span>Aadhar Number: {agent.aadharNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span>License Number: {agent.licenseNumber}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DeliveryAgentDetails;