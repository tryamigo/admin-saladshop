'use client'
import React, { useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from 'date-fns'
import Link from 'next/link'
import { EyeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useData } from '@/contexts/DataContext'



const UsersContentPage: React.FC = () => {
    const {users,searchTerm} =useData()
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toString().includes(searchTerm)
    )
  }, [users, searchTerm])

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4"></h3>
      <table className="w-full caption-bottom text-sm">
        <thead className="border-b">
          <tr>
            <th className="h-10 px-2 text-left align-middle font-medium">User ID</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Name</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Email</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Registration Date</th>
            <th className="h-10 px-2 text-left align-middle font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
              <td className="p-2">{user.id}</td>
              <td className="p-2 flex items-center">
                <Avatar className="w-8 h-8 mr-2">
                  <AvatarImage src={`https://avatars.dicebear.com/api/initials/${user.name}.svg`} />
                  <AvatarFallback delayMs={600}>
                    <div className="bg-gray-200 rounded-full w-full h-full" />
                  </AvatarFallback>
                </Avatar>
                {user.name}
              </td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{format(user.registrationDate, 'yyyy-MM-dd HH:mm')}</td>
              <td className="p-2">
                <Link href={`/admin/users/${user.id}`} passHref>
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
      {filteredUsers.length === 0 && (
        <p className="text-center mt-4 text-muted-foreground">No users found matching your search.</p>
      )}
    </div>
  )
}

export default UsersContentPage