"use client"
import type React from "react"
import { Suspense, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { signIn } from "next-auth/react"
import { Edit2, ArrowLeft, Smartphone } from "lucide-react"

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
}

function OTPInput({ value, onChange, length = 4 }: OTPInputProps) {
  const [otp, setOtp] = useState(Array(length).fill(""))

  useEffect(() => {
    const otpArray = value.split("").slice(0, length)
    const paddedArray = [...otpArray, ...Array(length - otpArray.length).fill("")]
    setOtp(paddedArray)
  }, [value, length])

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return

    const newOtp = [...otp]
    newOtp[index] = element.value
    setOtp(newOtp)
    onChange(newOtp.join(""))

    // Focus next input
    if (element.value && index < length - 1) {
      const nextInput = element.parentElement?.nextElementSibling?.querySelector("input")
      nextInput?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = (e.target as HTMLInputElement).parentElement?.previousElementSibling?.querySelector("input")
      prevInput?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, length)
    if (/^\d+$/.test(pastedData)) {
      onChange(pastedData)
    }
  }

  return (
    <div className="flex justify-center space-x-3">
      {otp.map((digit, index) => (
        <div key={index} className="relative">
          <Input
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className="w-14 h-14 text-center text-xl font-bold border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            autoComplete="off"
          />
        </div>
      ))}
    </div>
  )
}

function SignInPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackurl") || "/"
  const [mobileNumber, setMobileNumber] = useState("9002130542")
  const [otp, setOtp] = useState("")
  const [showOtpInput, setShowOtpInput] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow digits and limit to 10 digits
    const cleanedValue = value.replace(/\D/g, "").slice(0, 10)
    setMobileNumber(cleanedValue)
  }

  const getFullMobileNumber = () => {
    return "+91" + mobileNumber
  }

  const formatMobileNumber = (number: string) => {
    if (number.length <= 5) return number
    return `${number.slice(0, 5)} ${number.slice(5)}`
  }

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push(callbackUrl)
    }
  }, [session, status, router, callbackUrl])

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mobileNumber.length !== 10) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: getFullMobileNumber() }),
      })

      if (response.status === 404) {
        toast({
          title: "User Not Found",
          description: "This mobile number is not registered. Please contact support.",
          variant: "destructive",
        })
        return
      }

      if (!response.ok) {
        throw new Error("Failed to send OTP")
      }

      setShowOtpInput(true)
      toast({
        title: "OTP Sent",
        description: "Please check your mobile for the 4-digit OTP",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 4-digit OTP",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await signIn("credentials", {
        mobileNumber: getFullMobileNumber(),
        otp,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      router.push(callbackUrl)
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditMobileNumber = () => {
    setShowOtpInput(false)
    setOtp("")
  }

  const handleBackToMobile = () => {
    setShowOtpInput(false)
    setOtp("")
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600 text-lg font-medium">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {showOtpInput ? "Verify OTP" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            {showOtpInput ? "Enter the 4-digit code sent to your mobile" : "Sign in to access your account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!showOtpInput ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                <div className="relative">
                  <Input
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={mobileNumber}
                    onChange={handleMobileNumberChange}
                    required
                    className="pl-12 h-12 text-lg border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+91</span>
                </div>
                {mobileNumber && (
                  <p className="text-sm text-gray-500">We&apos;ll send an OTP to +91 {formatMobileNumber(mobileNumber)}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={isLoading || mobileNumber.length !== 10}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending OTP...
                  </div>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Sent to</p>
                      <p className="font-semibold text-gray-900">+91 {formatMobileNumber(mobileNumber)}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleEditMobileNumber}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 block text-center">Enter 4-digit OTP</label>
                  <OTPInput value={otp} onChange={setOtp} />
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  disabled={isLoading || otp.length !== 4}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    "Verify & Sign In"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBackToMobile}
                  className="w-full text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to mobile number
                </Button>
              </div>
            </form>
          )}

          {showOtpInput && (
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="text-blue-600 hover:text-blue-700 font-medium underline disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function SignIn() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-gray-600 text-lg font-medium">Loading...</div>
          </div>
        </div>
      }
    >
      <SignInPage />
    </Suspense>
  )
}
