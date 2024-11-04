'use client'
import React, { Suspense, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import GoogleSignInButton from '@/components/GoogleSignInButton'
import Image from 'next/image'

function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackurl') || '/'; 

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push(callbackUrl);
    }
  }, [session, status, router, callbackUrl]);

  return (
    <div className=" flex items-center justify-center p-8  bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="absolute inset-0 bg-pattern opacity-10"></div>
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/30 shadow-xl border-0">
        <CardHeader className="text-center">
       
          <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
          <CardDescription className="text-gray-200">Sign in to access your account</CardDescription>
        </CardHeader>
        <CardContent>
        <GoogleSignInButton 
          className="py-3 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-50" 
          label="Continue with Google"
        />
          <p className="mt-6 text-center text-sm text-gray-200">
            By signing in, you agree to our <a href="#" className="underline hover:text-white">Terms of Service</a> and <a href="#" className="underline hover:text-white">Privacy Policy</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="text-white text-2xl font-semibold">Loading...</div>
      </div>
    }>
      <SignInPage />
    </Suspense>
  );
}