import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma-client';

// GET /api/family - Get family information by access code
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accessCode = searchParams.get('accessCode');

    if (!accessCode) {
      return NextResponse.json(
        { error: 'Access code is required' },
        { status: 400 }
      );
    }

    const family = await prisma.family.findUnique({
      where: { accessCode },
      include: {
        foods: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!family) {
      return NextResponse.json({ error: 'Family not found' }, { status: 404 });
    }

    return NextResponse.json(family);
  } catch (error) {
    console.error('Error reading family data:', error);
    return NextResponse.json(
      { error: 'Failed to read family data' },
      { status: 500 }
    );
  }
}
