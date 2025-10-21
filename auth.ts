import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma';
import authConfig from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async signIn({ user, account }) {
      if (!user || !account) {
        return false;
      }

      const existingUser = await prisma.user.findUnique({
        where: user.email!,
      });

      if (!existingUser) {
        const newUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
          },

          account: {
            create: {
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
            },
          },
        });

        if (!newUser) {
          return false;
        }
      } else {
        const existingAccount = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
        });

        if (!existingAccount) {
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
            },
          });
        }
      }
    },
    async jwt() {},
    async session() {},
  },
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  ...authConfig,
});
