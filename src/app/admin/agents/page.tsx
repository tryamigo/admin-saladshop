'use client'
import React from 'react'
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { EyeIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useData } from '@/contexts/DataContext'



const DeliveryAgentsContentPage: React.FC = () => {
    const {deliveryAgents,searchTerm} =useData()
  const filteredAgents = deliveryAgents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.id.toString().includes(searchTerm)
  )

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4"></h3>
      <table className="w-full caption-bottom text-sm">
        <thead className="border-b">
          <tr>
            <th className="h-10 px-2 text-left align-middle font-medium">Agent ID</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Name</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Status</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Completed Deliveries</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAgents.map((agent) => (
            <tr key={agent.id} className="border-b transition-colors hover:bg-muted/50">
              <td className="p-2">{agent.id}</td>
              <td className="p-2">{agent.name}</td>
              <td className="p-2">
                <Badge
                  variant={
                    agent.status === 'available'
                      ? 'secondary'
                      : agent.status === 'on delivery'
                      ? 'default'
                      : 'destructive'
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
  )
}

export default DeliveryAgentsContentPage