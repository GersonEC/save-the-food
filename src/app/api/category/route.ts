import prisma from '@/lib/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/category - Get all categories
export async function GET() {
  try {
    const data = await prisma.category.findMany();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading category data:', error);
    return NextResponse.json(
      { error: 'Failed to read category data' },
      { status: 500 }
    );
  }
}

// POST /api/category - Add a new category
export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    const { name } = requestData;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Create the category
    const category = await prisma.category.create({
      data: { name },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

// DELETE /api/category - Delete a category
export async function DELETE(request: NextRequest) {
  try {
    const requestData = await request.json();
    const { id } = requestData;

    // Delete the category
    await prisma.category.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
