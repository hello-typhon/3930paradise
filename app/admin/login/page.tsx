'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.isLoggedIn) {
          router.push('/admin');
        }
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">3930 PARADISE</h1>
          <p className="text-xl text-red-500 font-bold">ADMIN LOGIN</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-4 border-white p-6 bg-gray-900">
            <div className="mb-4">
              <label className="block text-yellow-400 font-bold mb-2" htmlFor="username">
                USERNAME
              </label>
              <input
                id="username"
                type="text"
                required
                autoComplete="username"
                className="w-full bg-black border-2 border-gray-600 p-3 text-white font-mono focus:border-yellow-400 outline-none"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-yellow-400 font-bold mb-2" htmlFor="password">
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full bg-black border-2 border-gray-600 p-3 text-white font-mono focus:border-yellow-400 outline-none"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <div className="border-4 border-red-500 p-4 bg-red-900">
              <p className="font-bold">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black p-4 font-bold text-xl border-4 border-white hover:bg-yellow-300 disabled:bg-gray-600 disabled:text-gray-400"
          >
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-400 hover:text-white underline">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
