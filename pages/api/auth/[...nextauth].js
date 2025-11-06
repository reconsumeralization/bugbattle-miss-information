import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import users from '../../../data/users.json';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { 
          label: "Email", 
          type: "email", 
          placeholder: "student@greenplanet.edu" 
        },
        password: { 
          label: "Password", 
          type: "password" 
        }
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }

        // Find user in our mock database
        const user = users.find(u => u.email === credentials.email);

        // Verify password (in production, use hashed passwords!)
        if (user && user.password === credentials.password) {
          return { 
            id: user.id, 
            name: user.name, 
            email: user.email 
          };
        } else {
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'green-planet-secret-key-change-in-production',
};

export default NextAuth(authOptions); 