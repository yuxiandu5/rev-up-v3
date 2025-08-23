import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { registerSchema } from '@/lib/validations';
import { hashPassword, generateToken, hashToken, addDays } from '@/lib/crypto';
import { sendEmail, generateVerificationEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';
import { TokenType } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    // Parse and validate input
    const body = await request.json();
    const { email, password } = registerSchema.parse(body);
    
    // Normalize email to lowercase for consistent storage
    const normalizedEmail = email.toLowerCase().trim();

    // Hash password with Argon2id first (expensive operation)
    const passwordHash = await hashPassword(password);

    // Generate email verification token
    const verificationToken = generateToken();
    const tokenHash = hashToken(verificationToken);

    // Create user and verification token in a transaction to prevent race conditions
    const user = await prisma.$transaction(async (tx) => {
      // Check if user already exists (within transaction)
      const existingUser = await tx.user.findUnique({
        where: { email: normalizedEmail }
      });

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create user
      const newUser = await tx.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          isActive: true,
        }
      });

      // Create OneTimeToken for EMAIL_VERIFY
      await tx.oneTimeToken.create({
        data: {
          userId: newUser.id,
          type: TokenType.EMAIL_VERIFY,
          tokenHash,
          expiresAt: addDays(new Date(), 1), // 24 hours
          userAgent: request.headers.get('user-agent'),
          ipAddress: request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown',
        }
      });

      return newUser;
    });

    // Send verification email
    const emailOptions = generateVerificationEmail(normalizedEmail, verificationToken);
    await sendEmail(emailOptions);

    // Return success (201 Created)
    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);

    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    // Handle database errors and duplicate email
    if (error instanceof Error && 
        (error.message.includes('Unique constraint') || 
          error.message.includes('User with this email already exists'))) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
