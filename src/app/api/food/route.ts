import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma-client';

// GET /api/food - Get all food items
export async function GET() {
  try {
    const data = await prisma.food.findMany({
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
    const { name, category, location, expirationDate, quantity, image } =
      requestData;

    // Validate required fields
    if (!name || !category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
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

    // Create the food item
    const food = await prisma.food.create({
      data: {
        name,
        location: location || 'Kitchen',
        expirationDate: parsedExpirationDate,
        quantity: quantity || 1,
        image: image,
        categoryId: categoryRecord.id,
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
    const { id } = requestData;

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
