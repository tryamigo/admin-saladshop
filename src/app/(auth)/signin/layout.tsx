// app/signin/layout.tsx

import React from 'react'

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {children}
    </div>
  )
}