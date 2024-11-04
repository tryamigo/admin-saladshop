'use client'
import React, { useMemo } from 'react'
import Link from 'next/link'
import { EyeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useData } from '@/contexts/DataContext'

const UsersContentPage: React.FC = () => {
    const {users, searchTerm} = useData()
    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.id.toString().includes(searchTerm) ||
            user.mobile.includes(searchTerm)
        )
    }, [users, searchTerm])

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Users</h3>
            <table className="w-full caption-bottom text-sm">
                <thead className="border-b">
                    <tr>
                        <th className="h-10 px-2 text-left align-middle font-medium">User ID</th>
                        <th className="h-10 px-2 text-left align-middle font-medium">Mobile</th>
                        <th className="h-10 px-2 text-left align-middle font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-2">{user.id}</td>
                            <td className="p-2">{user.mobile}</td>
                            <td className="p-2">
                                <Link href={`/users/${user.id}`} passHref>
                                    <Button variant="ghost" size="sm">
                                        <EyeIcon className="mr-2 h-4 w-4" />
                                        View Details
                                    </Button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredUsers.length === 0 && (
                <p className="text-center mt-4 text-muted-foreground">No users found matching your search.</p>
            )}
        </div>
    )
}

export default UsersContentPage