// // middleware.ts

import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/signin",  // Ensure this matches the path in authOptions
    error:"/error"
  },
});

export const config = {
  matcher: [
    // '/:path*',    
    
  ],
};
