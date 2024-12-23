import request from 'supertest';
import app from '../../src/app'; // Import your Express app
import { prisma } from '../../src/prismaClient';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();


describe('User Routes', () => {
  beforeAll(async () => {
    await prisma.$connect(); // Connect to the test database
  });

  afterAll(async () => {
    await prisma.$disconnect(); // Disconnect from the test database
  });

  beforeEach(async () => {
    await prisma.user.deleteMany(); // Clear the user table before each test
  });
  afterEach(async () => {
    await prisma.user.deleteMany(); // Clear user table
    jest.restoreAllMocks(); // Restore original implementations of mocked methods
  });
  

  // afterEach(async () => {
  //   it('should handle database errors correctly (instanceof Error)', async () => {
  //     // Mock Prisma to throw an instance of `Error`
  //     jest.spyOn(prisma.user, 'findMany').mockImplementationOnce(() => {
  //       throw new Error('Database error');
  //     });

  //     const response = await request(app).get('/users');

  //     expect(response.status).toBe(500);
  //     expect(response.body).toEqual({
  //       error: 'Failed to retrieve users',
  //       details: 'Database error',
  //     });
  //   });
  // });


  describe('POST /users', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'USER',
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('test@example.com');
    });

    it('should return 400 if email already exists', async () => {
      await prisma.user.create({
        data: {
          name: 'Existing User',
          email: 'test@example.com',
          password: 'password123',
          role: 'USER',
        },
      });

      const response = await request(app)
        .post('/users')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'USER',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email already exists');
    });
    it('should handle database errors correctly (instanceof Error)', async () => {
      // Mock Prisma's `findMany` to throw an error
      jest.spyOn(prisma.user, 'create').mockImplementationOnce(() => {
        throw new Error('Database error');
      });
    
      const response = await request(app).post('/users').send({
        name: 'Test User',
        email: 'test@example.com',
      });
      // Assertions for error handling
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Failed to create user',
        details: 'Database error',
      });
    });
    
  
    it('should handle unknown errors correctly', async () => {
      // Mock Prisma to throw a non-Error object
      jest.spyOn(prisma.user, 'create').mockImplementationOnce(() => {
        throw 'Unknown error';
      });
  
      const response = await request(app).post('/users').send({
        name: 'Test User',
        email: 'test@example.com',
      });
  
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Unknown error occurred during creation',
      });
    });
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      await prisma.user.createMany({
        data: [
          { name: 'User 1', email: 'user1@example.com', password: 'password1', role: 'USER' },
          { name: 'User 2', email: 'user2@example.com', password: 'password2', role: 'USER' },
        ],
      });

      const response = await request(app).get('/users');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('email', 'user1@example.com');
    });

  
    it('should handle database errors correctly (instanceof Error)', async () => {
      // Mock Prisma's `findMany` to throw an error
      jest.spyOn(prisma.user, 'findMany').mockImplementationOnce(() => {
        throw new Error('Database error');
      });
    
      const response = await request(app).get('/users');
      // Assertions for error handling
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Failed to retrieve users',
        details: 'Database error',
      });
    });
    
  
    it('should handle unknown errors correctly', async () => {
      // Mock Prisma to throw a non-Error object
      jest.spyOn(prisma.user, 'findMany').mockImplementationOnce(() => {
        throw 'Unknown error';
      });
  
      const response = await request(app).get('/users');
  
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Unknown error occurred during retrieval',
      });
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user by ID', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'USER',
        },
      });

      const response = await request(app).get(`/users/${user.id}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('test@example.com');
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app).get('/users/nonexistent-id');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });

    it('should handle database errors correctly (instanceof Error)', async () => {
      // Mock Prisma's `findMany` to throw an error
      jest.spyOn(prisma.user, 'findUnique').mockImplementationOnce(() => {
        throw new Error('Database error');
      });
      const response = await request(app).get('/users/nonexistent-id');
    
      // Assertions for error handling
      expect(response.status).toBe(500);
      expect(response.body.error).toContain('Failed to retrieve user');
    });
    
  
    it('should handle unknown errors correctly', async () => {
      // Mock Prisma to throw a non-Error object
      jest.spyOn(prisma.user, 'findUnique').mockImplementationOnce(() => {
        throw 'Unknown error';
      });
  
      const response = await request(app).get('/users/nonexistent-id');

  
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Unknown error occurred during retrieval',
      });
    });
  });

  describe('PUT /users/:id', () => {
    it('should update a user by ID', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'Old Name',
          email: 'old@example.com',
          password: 'password123',
          role: 'USER',
        },
      });

      const response = await request(app)
        .put(`/users/${user.id}`)
        .send({
          name: 'New Name',
          email: 'new@example.com',
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('New Name');
      expect(response.body.email).toBe('new@example.com');
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app)
        .put('/users/nonexistent-id')
        .send({
          name: 'New Name',
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });

    it('should handle database errors correctly (instanceof Error)', async () => {
      // Mock Prisma's `findMany` to throw an error
      jest.spyOn(prisma.user, 'findUnique').mockImplementationOnce(() => {
        throw new Error('Database error');
      });
      const response = await request(app).put('/users/nonexistent-id');
    
      // Assertions for error handling
      expect(response.status).toBe(500);
      expect(response.body.error).toContain('Failed to retrieve user');
    });

    it('should handle database errors correctly (instanceof Error)', async () => {
      // Mock Prisma's `findMany` to throw an error
      jest.spyOn(prisma.user, 'update').mockImplementationOnce(() => {
        throw new Error('Database error');
      });
      const user = await prisma.user.create({
        data: {
          name: 'Old Name',
          email: 'old@example.com',
          password: 'password123',
          role: 'USER',
        },
      });

      const response = await request(app).put(`/users/${user.id}`)
      // Assertions for error handling
      expect(response.status).toBe(500);
      expect(response.body.error).toContain('Failed to update user');
    });
    
  
    it('should handle unknown errors correctly', async () => {
      // Mock Prisma to throw a non-Error object
      jest.spyOn(prisma.user, 'update').mockImplementationOnce(() => {
        throw 'Unknown error';
      });
      const user = await prisma.user.create({
        data: {
          name: 'Old Name',
          email: 'old@example.com',
          password: 'password123',
          role: 'USER',
        },
      });

      const response = await request(app).put(`/users/${user.id}`)
  
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Unknown error occurred during update',
      });
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user by ID', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'USER',
        },
      });

      const response = await request(app).delete(`/users/${user.id}`);

      expect(response.status).toBe(204);

      const deletedUser = await prisma.user.findUnique({ where: { id: user.id } });
      expect(deletedUser).toBeNull();
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app).delete('/users/nonexistent-id');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });


    it('should handle database errors correctly (instanceof Error)', async () => {
      // Mock Prisma's `findMany` to throw an error
      jest.spyOn(prisma.user, 'findUnique').mockImplementationOnce(() => {
        throw new Error('Database error');
      });
      const response = await request(app).delete('/users/nonexistent-id');
    
      // Assertions for error handling
      expect(response.status).toBe(500);
      expect(response.body.error).toContain('Failed to delete user');
    });
    
  
    it('should handle unknown errors correctly', async () => {
      // Mock Prisma to throw a non-Error object
      jest.spyOn(prisma.user, 'findUnique').mockImplementationOnce(() => {
        throw 'Unknown error';
      });
  
      const response = await request(app).delete('/users/nonexistent-id');

  
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Unknown error occurred during deletion',
      });
    });
  });
});

