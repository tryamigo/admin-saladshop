'use client'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface UserDetails {
  id: string;
  name: string | null;
  email: string | null;
  role?: string;
}

const ProfileContentPage: React.FC = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)

  useEffect(() => {
    if (session?.user) {
      setUserDetails({
        id: session.user.id,
        name: session.user.name ?? null, // Convert undefined to null
        email: session.user.email ?? null, // Convert undefined to null
        role: 'Admin'
      })
    }
  }, [session])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!session) {
    router.push('/signin')
    return null
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/signin' })
  }

  const getInitials = (name: string | null): string => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Avatar className="w-16 h-16 mr-4">
              <AvatarImage src={`https://avatars.dicebear.com/api/initials/${userDetails?.name || 'U'}.svg`} />
              <AvatarFallback>
              {getInitials(userDetails?.name ?? null)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{userDetails?.name || 'User'}</h2>
              <p className="text-sm text-gray-500">{userDetails?.role || 'Admin'}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{userDetails?.email || 'No email provided'}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Access Token Status: {session.user.accessToken ? 'Active' : 'Inactive'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => router.push('/settings')}
          >
            Account Settings
          </Button>
          <Button 
            variant="outline" 
            className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfileContentPage