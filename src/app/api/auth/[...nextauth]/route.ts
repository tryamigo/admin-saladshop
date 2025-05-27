import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;
const apiUrl = process.env.BACKEND_API_URL || 'http://localhost:3001';

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
          const response = await fetch(`${apiUrl}/admin/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              mobileNumber: credentials.mobileNumber,
              otp: credentials.otp,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Invalid OTP');
          }

          const data = await response.json();
          const decoded = jwt.verify(data.token, JWT_SECRET) as jwt.JwtPayload;

          if (typeof decoded === 'object' && decoded !== null && 'id' in decoded && 'mobileNumber' in decoded) {
            return {
              id: decoded.id,
              mobileNumber: decoded.mobileNumber,
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
        session.user.id = token.id as string;
        session.user.mobileNumber = token.mobileNumber as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/(auth)/signin',
    error: '/(auth)/error'
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };