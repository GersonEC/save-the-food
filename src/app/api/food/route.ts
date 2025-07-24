import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma-client';

// GET /api/food - Get all food items for a specific access code
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

    const data = await prisma.food.findMany({
      where: {
        accessCode: accessCode,
      },
      include: {
        category: true,
      },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading food data:', error);
    return NextResponse.json(
      { error: 'Failed to read food data' },
      { status: 500 }
    );
  }
}

// POST /api/food - Add a new food item
export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    const {
      name,
      category,
      location,
      expirationDate,
      quantity,
      image,
      accessCode,
    } = requestData;

    // Validate required fields
    if (!name || !category || !accessCode) {
      return NextResponse.json(
        { error: 'Name, category, and access code are required' },
        { status: 400 }
      );
    }

    // Parse expiration date
    let parsedExpirationDate: Date;
    if (expirationDate instanceof Date) {
      parsedExpirationDate = expirationDate;
    } else if (typeof expirationDate === 'string') {
      if (expirationDate.includes('T')) {
        // ISO date format
        parsedExpirationDate = new Date(expirationDate);
      } else {
        // Simple date format (e.g., "2025-7-10")
        const [year, month, day] = expirationDate.split('-');
        parsedExpirationDate = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid expiration date format' },
        { status: 400 }
      );
    }

    // Find or create the category
    let categoryRecord = await prisma.category.findUnique({
      where: { name: category },
    });

    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({
        data: { name: category },
      });
    }

    // Find the family for this access code
    const family = await prisma.family.findUnique({
      where: { accessCode },
    });

    // Create the food item
    const food = await prisma.food.create({
      data: {
        name,
        location: location || 'Kitchen',
        expirationDate: parsedExpirationDate,
        quantity: quantity || 1,
        image: image,
        categoryId: categoryRecord.id,
        accessCode: accessCode,
        familyId: family?.id,
      },
    });

    // Return the created food with category
    const createdFood = await prisma.food.findUnique({
      where: { id: food.id },
      include: {
        category: true,
      },
    });

    return NextResponse.json(
      { message: 'Food added successfully', food: createdFood },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding food:', error);
    return NextResponse.json({ error: 'Failed to add food' }, { status: 500 });
  }
}

// DELETE /api/food - Delete a food item
export async function DELETE(request: NextRequest) {
  try {
    const requestData = await request.json();
    const { id, accessCode } = requestData;

    if (!accessCode) {
      return NextResponse.json(
        { error: 'Access code is required' },
        { status: 400 }
      );
    }

    // Verify the food item belongs to the access code before deleting
    const foodItem = await prisma.food.findFirst({
      where: {
        id: id,
        accessCode: accessCode,
      },
    });

    if (!foodItem) {
      return NextResponse.json(
        { error: 'Food item not found or access denied' },
        { status: 404 }
      );
    }

    // Delete the food item
    await prisma.food.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Food deleted successfully' });
  } catch (error) {
    console.error('Error deleting food:', error);
    return NextResponse.json(
      { error: 'Failed to delete food' },
      { status: 500 }
    );
  }
}
