import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '../lib/prisma.js';
import { env } from '../lib/env.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${env.BACKEND_URL || 'http://localhost:4000'}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(new Error('No email found in Google profile'));
        }

        // 1. Try to find user by googleId
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        // 2. If not found by googleId, try by email
        if (!user) {
          user = await prisma.user.findUnique({
            where: { email },
          });

          if (user) {
            // Link googleId to existing account
            user = await prisma.user.update({
              where: { email },
              data: { googleId: profile.id },
            });
          }
        }

        // 3. If still no user, create a new one
        if (!user) {
          user = await prisma.user.create({
            data: {
              name: profile.displayName,
              email: email,
              googleId: profile.id,
              // passwordHash remains null
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

// We don't need sessions for JWT based auth, but passport requires these if used
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
