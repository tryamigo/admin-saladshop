import React from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from 'date-fns'
import { EyeIcon, ChevronDownIcon } from 'lucide-react'
import Link from 'next/link'

interface OrdersContentProps {
  orders: Order[]
  searchTerm: string
}

const OrdersContent: React.FC<OrdersContentProps> = ({ orders, searchTerm }) => {
  const [statusFilter, setStatusFilter] = React.useState('all')

  const filteredOrders = orders.filter(order => 
    (order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || order.status === statusFilter)
  )

  const handleStatusFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value)
  }

  const getStatusColor = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'pending': return 'default'
      case 'preparing': return 'secondary'
      case 'on the way': return 'outline'
      case 'delivered': return 'default'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Orders</h3>
      </div>

      <div className="flex justify-end">
        <div className="relative inline-block w-48">
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="on the way">On the Way</option>
            <option value="delivered">Delivered</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDownIcon className="h-4 w-4" />
          </div>
        </div>
      </div>

      <table className="w-full caption-bottom text-sm">
        <thead className="border-b">
          <tr>
            <th className="h-10 px-2 text-left align-middle font-medium">Order ID</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Customer</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Restaurant</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Total</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Status</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Date</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id} className="border-b transition-colors hover:bg-muted/50">
              <td className="p-2 font-medium">{order.id}</td>
              <td className="p-2">{order.customerName}</td>
              <td className="p-2">{order.restaurantName}</td>
              <td className="p-2">${order.total.toFixed(2)}</td>
              <td className="p-2">
                <Badge variant={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </td>
              <td className="p-2">{format(order.date, 'PPp')}</td>
              <td className="p-2">
                <Link href={`/admin/orders/${order.id}`} passHref>
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

      {filteredOrders.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No orders found matching your criteria.
        </div>
      )}
    </div>
  )
}

export default OrdersContent