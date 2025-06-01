import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "niltewari";
const apiUrl = process.env.BACKEND_API_URL || 'https://backend.thesaladhouse.co';


interface BackendResponse {
  message: string;
  user: {
    id: string;
    mobile: string;
  };
  token: string;
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Mobile OTP',
      credentials: {
        mobileNumber: { label: "Mobile Number", type: "text" },
        otp: { label: "OTP", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.mobileNumber || !credentials?.otp) {
          throw new Error('Mobile number and OTP are required');
        }

        try {
          // Verify OTP with backend
          const response = await fetch(`${apiUrl}/auth/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              mobile: credentials.mobileNumber,
              otp: credentials.otp,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Invalid OTP');
          }

          const data = await response.json() as BackendResponse;
          const decoded = jwt.verify(data.token, JWT_SECRET) as jwt.JwtPayload;

          if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
            return {
              id: data.user.id,
              mobileNumber: data.user.mobile,
              accessToken: data.token,
            };
          } else {
            throw new Error('Invalid token payload');
          }
        } catch (error) {
          console.error("Error during OTP verification:", error);
          throw error;
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.mobileNumber = user.mobileNumber;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.mobileNumber = token.mobileNumber;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/(auth)/signin',
    error: '/(auth)/error'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };