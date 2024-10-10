'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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

export default function VerifyRequest() {
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
            <Mail className="mx-auto h-12 w-12 text-sepia-600" />
            <h2 className="mt-6 text-4xl font-serif font-bold mb-4 text-gray-900 border-b-2 border-gray-300 pb-4">
              Check Your Email
            </h2>
            <p className="mt-2 text-lg text-gray-700 font-handwritten">
              We've sent you a secure sign-in link
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <p className="text-center text-gray-700">
              Please check your email inbox for a message from
              info@whisker.recipes. Click the link in the email to securely sign
              in to your account.
            </p>
            <p className="text-center text-gray-600 text-sm">
              If you don't see the email, please check your spam folder.
            </p>

            <Link href="/auth/login" passHref>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sepia-600 hover:bg-sepia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sepia-500 transition-all duration-300"
              >
                Return to Login
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
