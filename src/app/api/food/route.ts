import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Food } from '@/domain/Food';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'food.json');

// GET /api/food - Get all food items
export async function GET() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    const food = JSON.parse(data);
    return NextResponse.json(food);
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
    const newFood: Food = await request.json();

    // Read existing data
    const data = await fs.readFile(dataFilePath, 'utf8');
    const food = JSON.parse(data);

    // Add new food item
    food.push({
      name: newFood.name,
      category: newFood.category,
      location: newFood.location || 'Kitchen',
      expirationDate: newFood.expirationDate,
      quantity: newFood.quantity,
    });

    // Write back to file
    await fs.writeFile(dataFilePath, JSON.stringify(food, null, 2));

    return NextResponse.json(
      { message: 'Food added successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding food:', error);
    return NextResponse.json({ error: 'Failed to add food' }, { status: 500 });
  }
}
