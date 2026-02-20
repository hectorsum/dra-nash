'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ForceLogout() {
  const router = useRouter();

  useEffect(() => {
    // Clear the cookie client-side to be sure
    document.cookie = 'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Also call the logout API to be double sure
    fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
      window.location.href = '/login';
    });
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900">Sesión inválida</h2>
        <p className="text-gray-600">Redirigiendo al login...</p>
      </div>
    </div>
  );
}
