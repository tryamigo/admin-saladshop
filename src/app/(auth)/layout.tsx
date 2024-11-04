import React from 'react'

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Decorative area */}
      <div className="hidden md:flex md:w-1/2 bg-indigo-600 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Platform</h1>
          <p className="text-xl">Manage your business with ease and efficiency.</p>
        </div>
        <div className="mt-auto relative z-10">
          <p className="text-lg font-semibold">Empowering your success</p>
          <p className="text-sm opacity-75">© 2023 Your Company Name</p>
        </div>

        {/* Abstract background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Right side - Sign-in content */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}