# Database Setup Guide

This guide will help you set up the Prisma database to replicate your `food.json` data structure.

## Prerequisites

- Node.js and npm installed
- Prisma CLI (already included in dependencies)

## Setup Steps

### 1. Environment Configuration

Create a `.env` file in the root directory with the following content:

```env
# Database
DATABASE_URL="file:./dev.db"

# Environment
NODE_ENV="development"
```

### 2. Database Schema

The Prisma schema (`prisma/schema.prisma`) includes three models:

- **Food**: Main food items with name, location, expiration date, and quantity
- **Category**: Food categories (Frutta, Verdura, Avanzi, Altro, etc.)
- **FoodCategory**: Junction table for many-to-many relationship between foods and categories

### 3. Database Operations

Run the following commands to set up and populate your database:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Seed database with food.json data
npm run db:seed
```

### 4. Database Structure

The schema replicates your `food.json` structure with the following improvements:

- **Normalized categories**: Categories are stored separately to avoid duplication
- **Proper relationships**: Many-to-many relationship between foods and categories
- **Better data types**:
  - `expirationDate` as `DateTime` instead of string
  - `quantity` as `Int` with default value of 1
  - `image` as `String` optional with default value empty string
  - `id` fields for proper relationships
- **Timestamps**: `createdAt` and `updatedAt` fields for tracking

### 5. Data Migration

The seed script (`prisma/seed.ts`) will:

1. Clear existing data
2. Extract unique categories from your `food.json`
3. Create category records
4. Create food records with proper date parsing
5. Create relationships between foods and categories

### 6. Usage in Your Application

You can now use Prisma Client in your application:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all foods with their categories
const foods = await prisma.food.findMany({
  include: {
    categories: {
      include: {
        category: true,
      },
    },
  },
});

// Get foods by category
const fruits = await prisma.food.findMany({
  where: {
    categories: {
      some: {
        category: {
          name: 'Frutta',
        },
      },
    },
  },
});
```

## Categories from Your Data

Based on your `food.json`, the following categories will be created:

- Frutta
- Verdura
- Avanzi
- Altro

## Notes

- The database uses SQLite for simplicity (can be changed to PostgreSQL/MySQL in production)
- Date parsing handles both ISO format and simple date strings
- All relationships are properly indexed for performance
- Cascade deletes ensure data integrity
