// import { PrismaClient } from '@prisma/client';

import {prisma} from './prismaClient';
import app from './app';


// const prisma = new PrismaClient();

async function main() {
  // Test the database connection
  try{
  await prisma.$connect();
  console.log('Database connected successfully');
  } catch (err){
    if (err instanceof Error) {
      console.error('Could not connect to the database');
      console.error(err.message);
    }
  }

  // Get the PORT from the environment or use a default value
  const PORT = process.env.PORT || 5000;

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

async function shutdown()  {
  console.log('\nShutting down the server...');
  await prisma.$disconnect();
  console.log('Prisma connection closed. Goodbye!');
  process.exit(0);
}



// Handle graceful shutdown
process.on('SIGINT', shutdown);

process.on('SIGTERM', shutdown);

// Run the main function
main().catch((error) => {
  console.error('Error during startup:', error);
  process.exit(1);
});
