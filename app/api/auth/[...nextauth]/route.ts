import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // For demo purposes, auto-create user on login
        // In production, you'd verify password hash
        let user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          // Auto-create user for demo
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split('@')[0],
              password: credentials.password // In production: hash this!
            }
          })

          // Create profile
          await prisma.userProfile.create({
            data: {
              userId: user.id,
              primaryGoals: 'Build confidence,Improve health,Grow career',
              currentFocusArea: 'Building positive habits',
              negativeWords: "can't,impossible,failure"
            }
          })
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
