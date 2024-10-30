'use client'

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
      <p className="mt-4">
        {error === 'AccessDenied' 
          ? 'Only @amigo.gg email addresses are allowed to sign in.'
          : 'An error occurred during authentication.'}
      </p>
      <Link 
        href="/signin" 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back to Sign In
      </Link>
    </div>
  );
}