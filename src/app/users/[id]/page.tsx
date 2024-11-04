'use client'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, Edit, Save, X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/contexts/DataContext';
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
import { useSession } from 'next-auth/react';

const UserDetailPage: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();
    const { users } = useData();
    const [user, setUser ] = useState<any>(null);
    const [userOrders, setUserOrders] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedMobile, setEditedMobile] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const {data:session} = useSession()
    useEffect(() => {
        const foundUser  = users.find(u => u.id.toString() === id);
        if (foundUser ) {
            setUser (foundUser );
            setEditedMobile(foundUser .mobile);

            // Fetch user orders by mobile number
            const fetchUserOrders = async () => {
                try {
                    const response = await fetch(`/api/orders?mobile=${foundUser .mobile}`,{
                      method: 'GET',
                      headers: {
                        Authorization: `Bearer ${session?.user.accessToken}`,
                      }

                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch orders');
                    }
                    const ordersData = await response.json();
                    setUserOrders(ordersData);
                } catch (error) {
                    console.error('Error fetching user orders:', error);
                }
            };

            fetchUserOrders();
        }
    }, [id, users]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (user) {
            try {
                const response = await fetch(`/api/users/${user.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...user, mobile: editedMobile }),
                });

                if (!response.ok) {
                    throw new Error('Failed to update user');
                }

                setUser ({ ...user, mobile: editedMobile });
                setIsEditing(false);
            } catch (error) {
                console.error('Error updating user:', error);
            }
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedMobile(user.mobile);
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/users/${user.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            router.push('/users'); // Redirect to users list after deletion
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <Link href="/users" passHref>
                    <Button variant="outline">
                        <ArrowLeftIcon className="mr-2 h-4 w-4" />
                        Back to Users
                    </Button>
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center justify-center h-10 px-4 text-gray-700 bg-white rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out font-bold">
                            Options
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleEdit}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                        </DropdownMenuItem>
                        < DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setIsDeleteDialogOpen(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <h1 className="text-2xl font-bold mb-4">User   Details</h1>

            {isEditing ? (
                <div className="bg-white p-4 rounded shadow mb- 4">
                    <h2 className="text-lg font-bold mb-2">Edit User Details</h2>
                    <form>
                        <Label htmlFor="mobile" className="block mb-2">Mobile</Label>
                        <Input
                            id="mobile"
                            value={editedMobile}
                            onChange={(e) => setEditedMobile(e.target.value)}
                            className="mb-2"
                        />
                        <Button onClick={handleSave} className="mr-2">Save</Button>
                        <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
                    </form>
                </div>
            ) : (
                <div>
                    <p><strong>User ID:</strong> {user.id}</p>
                    <p><strong>Mobile:</strong> {user.mobile}</p>
                </div>
            )}

            <h2 className="text-xl font-semibold mb-2">Order History</h2>
            {userOrders.length > 0 ? (
                <table className="w-full caption-bottom text-sm">
                    <thead className="border-b">
                        <tr>
                            <th className="h-10 px-2 text-left align-middle font-medium">Order ID</th>
                            <th className="h-10 px-2 text-left align-middle font-medium">Date</th>
                            <th className="h-10 px-2 text-left align-middle font-medium">Total</th>
                            <th className="h-10 px-2 text-left align-middle font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userOrders.map((order) => (
                            <tr key={order.id} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p- 2">{order.id}</td>
                                <td className="p-2">{new Date(order.date).toLocaleDateString()}</td>
                                <td className="p-2">${order.total.toFixed(2)}</td>
                                <td className="p-2">
                                    <Link href={`/orders/${order.id }`} passHref>
                                        <Button variant="ghost" size="sm">View Order</Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No orders found for this user.</p>
            )}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Are you sure you want to delete this user?
                    </DialogDescription>
                    <DialogFooter>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                        <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserDetailPage;