'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api/client';

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [status, setStatus] = useState<'confirming' | 'success' | 'error'>('confirming');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    const confirmEmail = async () => {
      try {
        await api.get('/v1/auth/confirmation', {
          params: { confirmation_token: token }
        });

        setStatus('success');

        // Redirect after 2 seconds
        void setTimeout(() => {
          router.push('/auth/login?confirmed=true');
        }, 2000);
      } catch {
        setStatus('error');
      }
    };

    void confirmEmail();
  }, [token, router]);

  if (status === 'confirming') {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirming Your Email...</h1>
        <p className="text-gray-600">Please wait while we confirm your email address.</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Confirmed!</h1>
        <p className="text-gray-600 mb-4">Your email has been confirmed successfully.</p>
        <p className="text-sm text-gray-500">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirmation Failed</h1>
      <p className="text-gray-600 mb-6">This confirmation link is invalid or has expired.</p>
      <Link 
        href="/auth/signup" 
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Sign up again
      </Link>
    </div>
  );
}