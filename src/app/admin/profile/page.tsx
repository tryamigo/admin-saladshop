'use client'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AdminProfile {
  name: string
  email: string
  role: string
  joinDate: Date
}

const mockAdminProfile: AdminProfile = {
  name: "Admin User",
  email: "admin@example.com",
  role: "Super Admin",
  joinDate: new Date("2022-01-01")
}

const ProfileContentPage: React.FC = () => {
  const admin = mockAdminProfile // In a real app, you'd fetch this data

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Avatar className="w-16 h-16 mr-4">
              <AvatarImage src={`https://avatars.dicebear.com/api/initials/${admin.name}.svg`} />
              <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{admin.name}</h2>
              <p className="text-sm text-gray-500">{admin.role}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{admin.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Join Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{admin.joinDate.toLocaleDateString()}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full">Change Password</Button>
          <Button variant="outline" className="w-full">Update Profile Information</Button>
          <Button variant="outline" className="w-full text-red-500 hover:text-red-700">Logout</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfileContentPage