'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Mail, ArrowRight } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const popupVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
};

function LoginContent() {
  const [email, setEmail] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'OAuthAccountNotLinked') {
      setShowPopup(true);
    }

    const prefilledEmail = searchParams.get('prefilled_email');
    if (prefilledEmail) {
      setEmail(prefilledEmail);
    }
  }, [searchParams]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const result = await signIn('email', {
      email,
      callbackUrl,
      redirect: false,
    });

    if (result?.error) {
      setError('Failed to sign in. Please try again.');
    } else if (result?.url) {
      router.push('/auth/verify-request');
    }

    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-amber-50 text-gray-800"
    >
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-parchment border-4 border-gray-300 rounded-lg shadow-lg p-8">
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-4xl font-serif font-bold mb-4 text-gray-900 border-b-2 border-gray-300 pb-4">
              Welcome Back to Whisker
            </h1>
            <p className="mt-2 text-lg text-gray-700 font-handwritten">
              Log in to access your Whisker application
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="w-full max-w-md mx-auto"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-sepia-500 focus:border-sepia-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={handleEmailChange}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div>
                <motion.button
                  whileHover={!isLoading ? { scale: 1.05 } : {}}
                  whileTap={!isLoading ? { scale: 0.95 } : {}}
                  type="submit"
                  disabled={isLoading}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    isLoading
                      ? 'bg-gray-400'
                      : 'bg-sepia-600 hover:bg-sepia-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sepia-500 transition-all duration-300`}
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <Lock
                      className="h-5 w-5 text-sepia-500 group-hover:text-sepia-400"
                      aria-hidden="true"
                    />
                  </span>
                  {isLoading ? 'Loading...' : 'Log in'}
                  {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={popupVariants}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          >
            <div className="bg-parchment p-6 rounded-lg shadow-xl max-w-sm w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Login Error</h3>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              <p className="text-gray-600 mb-4">Please login with email.</p>
              <button
                onClick={() => setShowPopup(false)}
                className="w-full bg-sepia-600 text-white py-2 px-4 rounded hover:bg-sepia-700 transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div></div>}>
      <LoginContent />
    </Suspense>
  );
}
