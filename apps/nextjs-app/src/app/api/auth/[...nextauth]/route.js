import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { ServerClient } from 'postmark';
import { emailHtml, text } from '@/lib/email/sign-in';

import client from '@/lib/db';

// Debug function
const debug = (...args) => console.log('[NextAuth Debug]', ...args);

export const authOptions = {
  adapter: MongoDBAdapter(client),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        // debug('Sending verification request to:', identifier);
        const { host } = new URL(url);
        const postmarkClient = new ServerClient(process.env.AUTH_POSTMARK_KEY);
        try {
          const result = await postmarkClient.sendEmail({
            From: provider.from,
            To: identifier,
            Subject: `Sign in to ${host}`,
            TextBody: text({ url, host }),
            HtmlBody: emailHtml({ url, host }),
          });
          // debug('Email sent successfully:', result);
          if (result.ErrorCode) {
            throw new Error(
              `Email could not be sent. Error: ${result.Message}`
            );
          }
        } catch (error) {
          // debug('Error sending email:', error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/sign-up',
    verifyRequest: '/auth/verify-request',
  },
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt({ token, user }) {
      debug('JWT callback:', { token, user });
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {},
    async redirect({ url, baseUrl }) {
      try {
        const decodedUrl = decodeURIComponent(url);
        if (decodedUrl.startsWith('/')) return `${baseUrl}${decodedUrl}`;
        else if (new URL(decodedUrl).origin === baseUrl) return decodedUrl;
      } catch (e) {
        console.error('Error decoding URL', e);
      }
      return baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);

debug('NextAuth handler initialized');

export { handler as GET, handler as POST };
