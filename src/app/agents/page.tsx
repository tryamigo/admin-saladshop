'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon, EyeIcon, PlusIcon, UserPlusIcon } from 'lucide-react';
import Link from 'next/link';
import { useData } from '@/contexts/DataContext';
import AssignDeliveryAgentModal from '@/components/AssignDeliveryAgentModal';
import { DeliveryAgent, Order } from '@/components/admin/types';
import AddAgentModal from '@/components/AddAgentModal';
import CompleteDeliveryModal from '@/components/CompleteDeliveryModal';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const DeliveryAgentsContentPage: React.FC = () => {
    // Initialize deliveryAgents as an empty array
    const [deliveryAgents, setDeliveryAgents] = useState<DeliveryAgent[]>([]);
    const { searchTerm } = useData(); // Only get searchTerm from context
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const {toast} = useToast()
    const {data : session , status } =useSession()
    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders',{
                headers:{
                    Authorization: `Bearer ${session?.user.accessToken}`,

                }
            });
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
       
        }
    };

    const loadDeliveryAgents = async () => {
        try {
            const response = await fetch('/api/agents',{
                headers:{
                 Authorization: `Bearer ${session?.user.accessToken}`,
                }
            });
            if (!response.ok) throw new Error('Failed to fetch delivery agents');
            const data = await response.json();
            // Ensure that the data is an array before setting it
            if (Array.isArray(data.agents)) {
                setDeliveryAgents(data.agents || [] );
                toast({
                    title: 'Delivery Agents Loaded',
                    description: data.message,
                })
            } else {
              
                throw new Error('Expected an array of delivery agents');
            }
        } catch (error) {
            console.error(error);

        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if(status === 'authenticated') {

        loadDeliveryAgents();
        fetchOrders();
        }
    }, [session,status]);

    const handleAddAgent = async (agentData: Partial<DeliveryAgent>) => {
        try {
            const response = await fetch('/api/agents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.user.accessToken}`,

                },
                body: JSON.stringify({
                    ...agentData,
                }),
            });

            if (!response.ok) throw new Error('Failed to create agent');

            await loadDeliveryAgents(); // Refresh the list after adding

            
            setIsAddModalOpen(false);
        } catch (error) {
            console.error('Error adding agent:', error);
    
        }
    };

    const handleAssignAgent = async (assignmentData: { orderId: string, agentId: string }) => {
        try {
            const response = await fetch('/api/agents/assign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.user.accessToken}`,

                },
                body: JSON.stringify(assignmentData),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                toast({
                    title: "Assignment Failed",
                    description: data.message || "Failed to assign delivery agent",
                    variant: "destructive",
                });
                return;
            }
    
            toast({
                title: "Success",
                description: "Agent assigned successfully",
                variant: "default",
            });
    
            await loadDeliveryAgents();
            setIsModalOpen(false);
    
        } catch (error) {
            console.error('Error assigning delivery agent:', error);
            toast({
                title: "Error",
                description: "An unexpected error occurred",
                variant: "destructive",
            });
        }
    };
    const handleCompleteDelivery = async (assignmentData: { orderId: string, agentId: string }) => {
        try {
          const response = await fetch('/api/agents/complete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.user.accessToken}`,

            },
            body: JSON.stringify(assignmentData),
          });
    
          if (!response.ok) throw new Error('Failed to complete delivery');
    
          await loadDeliveryAgents(); // Refresh the list after completion
    
          setIsCompleteModalOpen(false);
        } catch (error) {
          console.error('Error completing delivery:', error);
        }
      };
    const filteredAgents = deliveryAgents.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.id.toString().includes(searchTerm)
    );

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
    );

    return  (
        <Card className="container mx-auto p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <CardTitle className="text-2xl font-bold">Delivery Agents</CardTitle>
                <div className="flex space-x-2">
                    <Button 
                        onClick={() => setIsAddModalOpen(true)}
                        className=""
                    >
                        <UserPlusIcon className="mr-2 h-4 w-4" />
                        Add Agent
                    </Button>
                    <Button 
                        onClick={() => setIsModalOpen(true)}
                        className=""
                    >
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Assign Agent
                    </Button>
                    <Button 
                        onClick={() => setIsCompleteModalOpen(true)}
                        className=""
                    >
                        <CheckCircleIcon className="mr-2 h-4 w-4" />
                        Complete Delivery
                    </Button>
                </div>
            </CardHeader>

            <CardContent>

                <div className="rounded-md border">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">#</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Completed Deliveries</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAgents.map((agent, index) => (
                                <tr key={agent.id} className="border-t transition-colors hover:bg-muted/50">
                                    <td className="p-4">{index + 1}</td>
                                    <td className="p-4 font-medium">{agent.name}</td>
                                    <td className="p-4">
                                        <Badge
                                            variant={agent.status === 'available' ? 'default' : 'secondary'}
                                            className={`${
                                                agent.status === 'available' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {agent.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                            {agent.completedDeliveries}
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <Link href={`/agents/${agent.id}`} passHref>
                                            <Button variant="outline" size="sm" className="hover:bg-gray-100">
                                                <EyeIcon className="mr-2 h-4 w-4" />
                                                View Details
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredAgents.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-muted-foreground">No delivery agents found.</p>
                    </div>
                )}
            </CardContent>

            <AssignDeliveryAgentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAssignAgent}
                orders={orders}
                deliveryAgents={deliveryAgents}
            />
            <CompleteDeliveryModal
                isOpen={isCompleteModalOpen}
                onClose={() => setIsCompleteModalOpen(false)}
                onSubmit={handleCompleteDelivery}
                orders={orders}
                deliveryAgents={deliveryAgents}
            />
            <AddAgentModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddAgent}
            />
        </Card>
    );
};

export default DeliveryAgentsContentPage;