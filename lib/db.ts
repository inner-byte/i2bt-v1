import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;

export async function connectToDatabase() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to database');
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw new Error('Database connection failed');
  }
}

export async function disconnectFromDatabase() {
  try {
    await prisma.$disconnect();
    console.log('Successfully disconnected from database');
  } catch (error) {
    console.error('Failed to disconnect from database:', error);
    throw new Error('Database disconnection failed');
  }
}

// Helper function to handle database errors
export function handleDatabaseError(error: unknown): never {
  console.error('Database error:', error);
  
  if (error instanceof Error) {
    // Check for specific Prisma errors and provide appropriate messages
    if (error.message.includes('Unique constraint')) {
      throw new Error('This record already exists');
    }
    if (error.message.includes('Foreign key constraint')) {
      throw new Error('Referenced record does not exist');
    }
    if (error.message.includes('Record not found')) {
      throw new Error('Record not found');
    }
    throw new Error(error.message);
  }
  
  throw new Error('An unexpected database error occurred');
}
