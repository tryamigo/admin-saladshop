// // middleware.ts

import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/signin",  // Ensure this matches the path in authOptions

  },
});

export const config = {
  matcher: [
    '/:path*',      // Protects all routes under /admin
    
  ],
};
