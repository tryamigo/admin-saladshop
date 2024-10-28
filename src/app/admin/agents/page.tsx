'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EyeIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { useData } from '@/contexts/DataContext';
import AssignDeliveryAgentModal from '@/components/AssignDeliveryAgentModal';
import { DeliveryAgent, Order } from '@/components/admin/types';
import AddAgentModal from '@/components/AddAgentModal';
import CompleteDeliveryModal from '@/components/CompleteDeliveryModal';
import { useToast } from '@/hooks/use-toast';

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
    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders');
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
       
        }
    };

    const loadDeliveryAgents = async () => {
        try {
            const response = await fetch('/api/agents');
            if (!response.ok) throw new Error('Failed to fetch delivery agents');
            const data = await response.json();
            // Ensure that the data is an array before setting it
            if (Array.isArray(data.agents)) {
                setDeliveryAgents(data.agents);
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
        loadDeliveryAgents();
        fetchOrders();
    }, []);

    const handleAddAgent = async (agentData: Partial<DeliveryAgent>) => {
        try {
            const response = await fetch('/api/agents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold">Delivery Agents</h3>
                <div className="space-x-2">
                    <Button onClick={() => setIsAddModalOpen(true)}>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Add Agent
                    </Button>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Assign Agent
                    </Button>
                    <Button onClick={() => setIsCompleteModalOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Complete Delivery
          </Button>
                </div>
            </div>

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

            <table className="w-full caption-bottom text-sm">
                <thead className="border-b">
                    <tr>
                        <th className="h-10 px-2 text-left align-middle font-medium">No.</th>
                        <th className="h-10 px-2 text-left align-middle font-medium">Name</th>
                        <th className="h-10 px-2 text-left align-middle font-medium">Status</th>
                        <th className="h-10 px-2 text-left align-middle font-medium">Completed Deliveries</th>
                        <th className="h-10 px-2 text-left align-middle font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAgents.map((agent,index) => (
                        <tr key={agent.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2">{agent.name}</td>
                            <td className="p-2">
                                <Badge
                                    variant={
                                        agent.status === 'available'
                                            ? 'secondary'
                                            : 'default'
                                    }
                                >
                                    {agent.status}
                                </Badge>
                            </td>
                            <td className="p-2">{agent.completedDeliveries}</td>
                            <td className="p-2">
                                <Link href={`/admin/agents/${agent.id}`} passHref>
                                    <Button variant="ghost" size="sm">
                                        <EyeIcon className="mr-2 h-4 w-4" />
                                        View
                                    </Button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredAgents.length === 0 && (
                <p className="text-center mt-4 text-muted-foreground">No delivery agents found.</p>
            )}
        </div>
    );
};

export default DeliveryAgentsContentPage;