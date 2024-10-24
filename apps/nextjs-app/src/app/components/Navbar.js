'use client';

import Link from 'next/link';

export default function Navbar({ session }) {
  return (
    <nav className="bg-gradient-to-br from-amber-50 to-orange-100 shadow-md">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Whisker
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link
              href="/recipes"
              className="text-gray-700 hover:text-amber-500 transition duration-300 text-lg"
            >
              Recipes
            </Link>
          </div>

          {/* Auth Section */}
          <div>
            {session ? (
              <div className="text-gray-700 text-lg">{session.user.email}</div>
            ) : (
              <Link
                href="/auth/login"
                className="inline-block bg-amber-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-amber-600 transition duration-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
