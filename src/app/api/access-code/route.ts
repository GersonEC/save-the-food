import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma-client';

// POST /api/access-code - Create a new access code
export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    const { familyName } = requestData;

    if (!familyName || !familyName.trim()) {
      return NextResponse.json(
        { error: 'Family name is required' },
        { status: 400 }
      );
    }

    // Generate a random 4-digit access code
    const generateAccessCode = (): string => {
      return Math.floor(1000 + Math.random() * 9000).toString();
    };

    let accessCode: string = '';
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    // Try to generate a unique access code
    while (!isUnique && attempts < maxAttempts) {
      accessCode = generateAccessCode();

      // Check if this access code already exists
      const existingFamily = await prisma.family.findUnique({
        where: { accessCode },
      });

      if (!existingFamily) {
        isUnique = true;
      } else {
        attempts++;
      }
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: 'Unable to generate unique access code. Please try again.' },
        { status: 500 }
      );
    }

    // Find or create a default category
    let categoryRecord = await prisma.category.findUnique({
      where: { name: 'Default' },
    });

    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({
        data: { name: 'Default' },
      });
    }

    // Create the family record
    await prisma.family.create({
      data: {
        name: familyName.trim(),
        accessCode: accessCode!,
      },
    });

    return NextResponse.json(
      {
        message: 'Access code created successfully',
        accessCode: accessCode,
        familyName: familyName.trim(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating access code:', error);
    return NextResponse.json(
      { error: 'Failed to create access code' },
      { status: 500 }
    );
  }
}

// GET /api/access-code - Validate an access code
export async function GET(request: NextRequest) {
  try {
    const accessCode = request.nextUrl.searchParams.get('code');

    if (!accessCode) {
      return NextResponse.json(
        { error: 'Access code is required' },
        { status: 400 }
      );
    }

    // Check if the access code exists
    const family = await prisma.family.findUnique({
      where: { accessCode },
    });

    if (!family) {
      return NextResponse.json(
        { error: 'Invalid access code' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Access code is valid',
      familyName: family.name,
    });
  } catch (error) {
    console.error('Error validating access code:', error);
    return NextResponse.json(
      { error: 'Failed to validate access code' },
      { status: 500 }
    );
  }
}
