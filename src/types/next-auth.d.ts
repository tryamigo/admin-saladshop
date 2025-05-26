import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    mobileNumber?: string | null
    accessToken: string
  }

  interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    mobileNumber?: string | null
    accessToken: string
  }
}