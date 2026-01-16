'use client';

import { useState, useEffect, ReactNode, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const AUTH_COOKIE_NAME = 'admin_auth';
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, maxAge: number): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/admin; max-age=${maxAge}; SameSite=Strict`;
}

function AuthWrapper({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for secret in URL params
    const secretParam = searchParams.get('secret');
    if (secretParam) {
      validateSecret(secretParam);
      return;
    }

    // Check for existing auth cookie
    const authCookie = getCookie(AUTH_COOKIE_NAME);
    if (authCookie) {
      validateSecret(authCookie, false);
      return;
    }

    setIsAuthenticated(false);
  }, [searchParams]);

  async function validateSecret(secret: string, setCookieOnSuccess = true) {
    try {
      const response = await fetch('/api/admin/forever-links/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret }),
      });

      if (response.ok) {
        if (setCookieOnSuccess) {
          setCookie(AUTH_COOKIE_NAME, secret, AUTH_COOKIE_MAX_AGE);
          // Remove secret from URL for cleaner display
          const url = new URL(window.location.href);
          url.searchParams.delete('secret');
          window.history.replaceState({}, '', url.toString());
        }
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setError('Invalid credentials');
      }
    } catch {
      setIsAuthenticated(false);
      setError('Authentication failed');
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    validateSecret(password);
  }

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Not authenticated - show login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Forever Links Admin
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Admin Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter admin password"
                required
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Sign In
            </button>
          </form>

          <p className="mt-4 text-xs text-gray-500 text-center">
            Contact your administrator for access credentials.
          </p>
        </div>
      </div>
    );
  }

  // Authenticated - render children
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              Forever Links Admin
            </h1>
            <span className="text-sm text-gray-500">
              Coterie Landing Pages
            </span>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

export default function ForeverLinksLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      }
    >
      <AuthWrapper>{children}</AuthWrapper>
    </Suspense>
  );
}
