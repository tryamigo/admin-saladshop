import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;
const apiUrl = process.env.BACKEND_API_URL || 'http://localhost:3001';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.accessToken = token.accessToken as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      const email = profile?.email;
      if (!email || !email.endsWith('@amigo.gg')) {
        console.error("Unauthorized email domain. Only @amigo.gg emails are allowed.");
        return false;
      }
      if (account?.provider === "google") {
        try {
          const response = await fetch(`${apiUrl}/admin/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: profile?.email,
              name: profile?.name,
            }),
          });
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Google sign-in error:", errorData.error);
            return false;
          }

          const data = await response.json();
          try {
            const decoded = jwt.verify(data.token, JWT_SECRET) as jwt.JwtPayload;

            if (typeof decoded === 'object' && decoded !== null && 'id' in decoded && 'email' in decoded) {
              user.id = decoded.id as string;
              user.email = decoded.email as string;
              user.accessToken = data.token;
              return true;
            } else {
              console.error("Invalid token payload");
              return false;
            }
          } catch (jwtError) {
            console.error("JWT verification error:", jwtError);
            return false;
          }
        } catch (error) {
          console.error("Error during Google sign-in:", error);
          return false;
        }
      }
      return true;
    },
  },
  pages: {
    signIn: '/signin',
    error:'/error'
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };