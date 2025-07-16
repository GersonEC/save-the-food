import { PrismaClient } from '@prisma/client';
import foodData from '../src/data/food.json';

const prisma = new PrismaClient();

// Type definitions for the food data
interface FoodItem {
  name: string;
  category: string[];
  location: string;
  expirationDate: string;
  quantity: number;
  image: string;
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.foodCategory.deleteMany();
  await prisma.food.deleteMany();
  await prisma.category.deleteMany();

  // Create categories from the food data
  const categoryNames = new Set<string>();
  (foodData as FoodItem[]).forEach((food) => {
    food.category.forEach((cat) => categoryNames.add(cat));
  });

  const categories = await Promise.all(
    Array.from(categoryNames).map(async (categoryName) => {
      return await prisma.category.create({
        data: {
          name: categoryName,
        },
      });
    })
  );

  console.log(`✅ Created ${categories.length} categories`);

  // Create foods and their category relationships
  for (const foodItem of foodData as FoodItem[]) {
    // Parse expiration date (handle both string and ISO date formats)
    let expirationDate: Date;
    if (foodItem.expirationDate.includes('T')) {
      // ISO date format
      expirationDate = new Date(foodItem.expirationDate);
    } else {
      // Simple date format (e.g., "2025-7-10")
      const [year, month, day] = foodItem.expirationDate.split('-');
      expirationDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day)
      );
    }

    // Create the food item
    const food = await prisma.food.create({
      data: {
        name: foodItem.name,
        location: foodItem.location,
        expirationDate,
        quantity: foodItem.quantity,
        image: foodItem.image,
      },
    });

    // Create category relationships
    for (const categoryName of foodItem.category) {
      const category = categories.find((cat) => cat.name === categoryName);
      if (category) {
        await prisma.foodCategory.create({
          data: {
            foodId: food.id,
            categoryId: category.id,
          },
        });
      }
    }
  }

  console.log(
    `✅ Created ${foodData.length} food items with category relationships`
  );
  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
