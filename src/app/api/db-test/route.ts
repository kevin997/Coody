import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Database diagnostic endpoint
 * Shows how many users exist in the database
 * REMOVE THIS AFTER DEBUGGING!
 */
export async function GET() {
  try {
    // Count users
    const userCount = await prisma.user.count();
    
    // Get database URL (hide password)
    const dbUrl = process.env.DATABASE_URL?.replace(
      /:([^:@]+)@/,
      ':****@'
    );

    return NextResponse.json({
      success: true,
      database: dbUrl,
      userCount,
      message: `Database connected. Found ${userCount} users.`,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Database error',
    }, { status: 500 });
  }
}
