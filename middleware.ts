// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//     const token = request.cookies.get('token')?.value;
//     console.log("cookie : ", token);
    

//     if (!token) {
//         // Redirect to login if no token is found in cookies
//         return NextResponse.redirect(new URL('/login', request.url));
//     }

//     return NextResponse.next(); // Allow access if token exists
// }

// export const config = {
//     matcher: ['/protected/:path*', '/'], // Apply middleware to specific routes
// };
