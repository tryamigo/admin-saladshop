"use client"

import type { ChangeEvent, ClipboardEvent, FormEvent, KeyboardEvent } from "react"
import { Suspense, useEffect, useState, useCallback, useMemo } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { signIn } from "next-auth/react"
import { Edit2, ArrowLeft, Smartphone } from "lucide-react"

// Constants
const MOBILE_NUMBER_LENGTH = 10
const OTP_LENGTH = 6
const COUNTRY_CODE = "+91"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend.thesaladhouse.co"

// Types
interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  disabled?: boolean
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Enums
enum SignInStep {
  MOBILE_INPUT = "mobile_input",
  OTP_VERIFICATION = "otp_verification"
}

enum LoadingState {
  IDLE = "idle",
  SENDING_OTP = "sending_otp",
  VERIFYING_OTP = "verifying_otp"
}

// Utility functions
const validateMobileNumber = (mobile: string): boolean => {
  return /^\d{10}$/.test(mobile)
}

const validateOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp)
}

const formatMobileNumber = (number: string): string => {
  if (number.length <= 5) return number
  return `${number.slice(0, 5)} ${number.slice(5)}`
}

const sanitizeMobileInput = (input: string): string => {
  return input.replace(/\D/g, '').slice(0, MOBILE_NUMBER_LENGTH)
}

// Custom hooks
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

// API service
class AuthService {
  private static async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      clearTimeout(timeoutId)

      if (response.status === 404) {
        return {
          success: false,
          error: 'User not found. Please contact support.',
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        }
      }

      const data = await response.json()
      return {
        success: true,
        data,
      }
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: 'Request timed out. Please try again.',
          }
        }
        return {
          success: false,
          error: error.message,
        }
      }
      
      return {
        success: false,
        error: 'An unexpected error occurred.',
      }
    }
  }

  static async sendOTP(mobile: string): Promise<ApiResponse> {
    return this.makeRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ mobile }),
    })
  }

  static async verifyOTP(mobile: string, otp: string): Promise<ApiResponse> {
    const result = await signIn("credentials", {
      mobileNumber: mobile,
      otp,
      redirect: false,
    })

    if (result?.error) {
      return {
        success: false,
        error: result.error === 'CredentialsSignin' 
          ? 'Invalid OTP. Please try again.' 
          : result.error,
      }
    }

    return { success: true }
  }
}

// Components
function OTPInput({ value, onChange, length = OTP_LENGTH, disabled = false }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""))

  useEffect(() => {
    const otpArray = value.split("").slice(0, length)
    const paddedArray = [...otpArray, ...Array(length - otpArray.length).fill("")]
    setOtp(paddedArray)
  }, [value, length])

  const handleChange = useCallback((element: HTMLInputElement, index: number) => {
    const inputValue = element.value
    
    if (inputValue && !/^\d$/.test(inputValue)) return

    const newOtp = [...otp]
    newOtp[index] = inputValue
    setOtp(newOtp)
    onChange(newOtp.join(""))

    // Auto-focus next input
    if (inputValue && index < length - 1) {
      const nextInput = element.parentElement?.nextElementSibling?.querySelector("input") as HTMLInputElement
      nextInput?.focus()
    }
  }, [otp, onChange, length])

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = (e.target as HTMLInputElement).parentElement?.previousElementSibling?.querySelector("input") as HTMLInputElement
      prevInput?.focus()
    }
  }, [otp])

  const handlePaste = useCallback((e: ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, '').slice(0, length)
    if (pastedData) {
      onChange(pastedData)
    }
  }, [onChange, length])

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {otp.map((digit, index) => (
        <div key={index} className="relative flex-1 max-w-[50px] sm:max-w-[60px]">
          <Input
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            disabled={disabled}
            className="w-full h-12 sm:h-14 text-center text-lg sm:text-xl font-bold border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50"
            autoComplete="one-time-code"
            aria-label={`OTP digit ${index + 1}`}
          />
        </div>
      ))}
    </div>
  )
}

function LoadingSpinner({ size = "sm" }: { size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "w-5 h-5" : "w-8 h-8"
  return (
    <div className={`${sizeClass} border-2 border-white border-t-transparent rounded-full animate-spin`} />
  )
}

function SignInPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State
  const [currentStep, setCurrentStep] = useState<SignInStep>(SignInStep.MOBILE_INPUT)
  const [mobileNumber, setMobileNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE)
  const [otpSentAt, setOtpSentAt] = useState<Date | null>(null)

  // Computed values
  const callbackUrl = useMemo(() => searchParams.get("callbackurl") || "/", [searchParams])
  const fullMobileNumber = useMemo(() => `${COUNTRY_CODE}${mobileNumber}`, [mobileNumber])
  const isAuthenticated = status === "authenticated" && session?.user
  const canSendOTP = validateMobileNumber(mobileNumber) && loadingState === LoadingState.IDLE
  const canVerifyOTP = validateOTP(otp) && loadingState === LoadingState.IDLE
  const isLoading = loadingState !== LoadingState.IDLE

  // Debounced mobile number for validation feedback
  const debouncedMobileNumber = useDebounce(mobileNumber, 500)

  // Effects
  useEffect(() => {
    if (isAuthenticated) {
      router.push(callbackUrl)
    }
  }, [isAuthenticated, router, callbackUrl])

  // Handlers
  const handleMobileInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeMobileInput(e.target.value)
    setMobileNumber(sanitized)
  }, [])

  const handleSendOTP = useCallback(async (e?: FormEvent) => {
    e?.preventDefault()
    
    if (!canSendOTP) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      })
      return
    }

    setLoadingState(LoadingState.SENDING_OTP)

    try {
      const response = await AuthService.sendOTP(fullMobileNumber)

      if (!response.success) {
        throw new Error(response.error)
      }

      setCurrentStep(SignInStep.OTP_VERIFICATION)
      setOtpSentAt(new Date())
      setOtp("") // Clear any previous OTP
      
      toast({
        title: "OTP Sent",
        description: "Please check your mobile for the 6-digit OTP",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send OTP. Please try again."
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoadingState(LoadingState.IDLE)
    }
  }, [canSendOTP, fullMobileNumber])

  const handleVerifyOTP = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    
    if (!canVerifyOTP) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit OTP",
        variant: "destructive",
      })
      return
    }

    setLoadingState(LoadingState.VERIFYING_OTP)

    try {
      const response = await AuthService.verifyOTP(fullMobileNumber, otp)

      if (!response.success) {
        throw new Error(response.error)
      }

      // Success will be handled by the session effect
      router.push(callbackUrl)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Invalid OTP. Please try again."
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoadingState(LoadingState.IDLE)
    }
  }, [canVerifyOTP, fullMobileNumber, otp, router, callbackUrl])

  const handleEditMobileNumber = useCallback(() => {
    setCurrentStep(SignInStep.MOBILE_INPUT)
    setOtp("")
    setOtpSentAt(null)
  }, [])

  const handleBackToMobile = useCallback(() => {
    setCurrentStep(SignInStep.MOBILE_INPUT)
    setOtp("")
    setOtpSentAt(null)
  }, [])

  // Render helpers
  const renderMobileInputStep = () => (
    <form onSubmit={handleSendOTP} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="mobile-input" className="text-sm font-medium text-gray-700">
          Mobile Number
        </label>
        <div className="relative">
          <Input
            id="mobile-input"
            type="tel"
            inputMode="numeric"
            placeholder="Enter your mobile number"
            value={mobileNumber}
            onChange={handleMobileInputChange}
            required
            className="pl-12 h-12 text-lg border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            autoComplete="tel"
            aria-describedby="mobile-help"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            {COUNTRY_CODE}
          </span>
        </div>
        {debouncedMobileNumber && (
          <p id="mobile-help" className="text-sm text-gray-500">
            {validateMobileNumber(debouncedMobileNumber) 
              ? `We'll send an OTP to ${COUNTRY_CODE} ${formatMobileNumber(debouncedMobileNumber)}`
              : "Please enter a valid 10-digit mobile number"
            }
          </p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
        disabled={!canSendOTP}
      >
        {loadingState === LoadingState.SENDING_OTP ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner />
            <span className="ml-2">Sending OTP...</span>
          </div>
        ) : (
          "Send OTP"
        )}
      </Button>
    </form>
  )

  const renderOTPVerificationStep = () => (
    <form onSubmit={handleVerifyOTP} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sent to</p>
              <p className="font-semibold text-gray-900">
                {COUNTRY_CODE} {formatMobileNumber(mobileNumber)}
              </p>
              {otpSentAt && (
                <p className="text-xs text-gray-500">
                  {otpSentAt.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleEditMobileNumber}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            aria-label="Edit mobile number"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 block text-center">
            Enter 6-digit OTP
          </label>
          <OTPInput 
            value={otp} 
            onChange={setOtp} 
            length={OTP_LENGTH}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Button
          type="submit"
          className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
          disabled={!canVerifyOTP}
        >
          {loadingState === LoadingState.VERIFYING_OTP ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner />
              <span className="ml-2">Verifying...</span>
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
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to mobile number
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={() => handleSendOTP()}
            disabled={isLoading}
            className="text-blue-600 hover:text-blue-700 font-medium underline disabled:opacity-50"
          >
            Resend OTP
          </button>
        </p>
      </div>
    </form>
  )

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {currentStep === SignInStep.OTP_VERIFICATION ? "Verify OTP" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            {currentStep === SignInStep.OTP_VERIFICATION 
              ? "Enter the 6-digit code sent to your mobile" 
              : "Sign in to access your account"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === SignInStep.MOBILE_INPUT 
            ? renderMobileInputStep() 
            : renderOTPVerificationStep()
          }
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
            <LoadingSpinner size="md" />
            <div className="text-gray-600 text-lg font-medium mt-4">Loading...</div>
          </div>
        </div>
      }
    >
      <SignInPage />
    </Suspense>
  )
}