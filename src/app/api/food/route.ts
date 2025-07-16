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
    const newFood = {
      ...requestData,
      expirationDate: requestData.expirationDate as string,
    };

    // Parse expiration date
    let expirationDate: Date;
    const expirationDateStr = newFood.expirationDate;
    if (expirationDateStr.includes('T')) {
      // ISO date format
      expirationDate = new Date(expirationDateStr);
    } else {
      // Simple date format (e.g., "2025-7-10")
      const [year, month, day] = expirationDateStr.split('-');
      expirationDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day)
      );
    }

    // Find or create the category
    let category = await prisma.category.findUnique({
      where: { name: newFood.category },
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: newFood.category },
      });
    }

    // Create the food item
    const food = await prisma.food.create({
      data: {
        name: newFood.name,
        location: newFood.location || 'Kitchen',
        expirationDate,
        quantity: newFood.quantity || 1,
        image: newFood.image,
        categoryId: category.id,
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
