// import { PrismaClient, Role } from '@prisma/client';
import { prisma, Role } from '../prismaClient';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/users.controller';
import { Request, Response } from 'express';

// const prisma = new PrismaClient();

describe('User CRUD Operations', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonSpy: jest.SpyInstance;

  // beforeAll(async () => {
  //   // Reset the test database
  //   execSync('npx prisma migrate reset --force --skip-seed', { stdio: 'inherit' });
  //   await prisma.$connect();
  // });

  // afterAll(async () => {
  //   await prisma.$disconnect();
  // });

  beforeEach(() => {
    jsonSpy = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(), // Mock 'status' to enable chaining
      json: jsonSpy, // Mock 'json' to capture response data
    } as unknown as Partial<Response>;
  });

  afterEach(async () => {
    // Clear all user data after each test
    await prisma.user.deleteMany();
  });


  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      mockRequest = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: Role.USER,
        },
      };

      await createUser(mockRequest as Request, mockResponse as Response);

      const createdUser = await prisma.user.findUnique({ where: { email: 'test@example.com' } });

      expect(createdUser).not.toBeNull();
      expect(createdUser?.email).toBe('test@example.com');
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(jsonSpy).toHaveBeenCalledWith(expect.objectContaining({ email: 'test@example.com' }));
    });

    it('should return an error if the email already exists', async () => {
      // Pre-create a user
      await prisma.user.create({
        data: {
          name: 'Existing User',
          email: 'test@example.com',
          password: 'password123',
          role: Role.USER,
        },
      });

      mockRequest = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: Role.USER,
        },
      };

      await createUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({ error: 'Email already exists' });
    });
  });

  describe('getAllUsers', () => {
    it('should return a list of users', async () => {
      await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: Role.USER,
        },
      });

      await getAllUsers(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith([
        expect.objectContaining({ email: 'test@example.com' }),
      ]);
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: Role.USER,
        },
      });

      mockRequest = { params: { id: user.id } };

      await getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith(expect.objectContaining({ id: user.id }));
    });

    it('should return 404 if user not found', async () => {
      mockRequest = { params: { id: 'nonexistent-id' } };

      await getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(jsonSpy).toHaveBeenCalledWith({ error: 'User not found' });
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: Role.USER,
        }
      });

      mockRequest = {
        params: { id: user.id },
        body: { name: 'Updated User' },
      };

      await updateUser(mockRequest as Request, mockResponse as Response);

      const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });

      expect(updatedUser?.name).toBe('Updated User');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith(expect.objectContaining({ name: 'Updated User' }));

    });
    it('should return 404 if user not found', async () => {
      mockRequest = { params: { id: 'nonexistent-id' }, body: {} };

      await updateUser(mockRequest as Request, mockResponse as Response);

      expect(jsonSpy).toHaveBeenCalledWith({ error: 'User not found' });
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });


  });


  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: Role.USER,
        }
      });



      mockRequest = { params: { id: user.id } };

      await deleteUser(mockRequest as Request, mockResponse as Response);

      const deletedUser = await prisma.user.findUnique({ where: { id: user.id } });

      expect(deletedUser).toBeNull();
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      // expect(jsonSpy).toHaveBeenCalledWith({})


    });






    it('should return 404 if user not found', async () => {
      mockRequest = { params: { id: 'nonexistent-id' } };

      await deleteUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(jsonSpy).toHaveBeenCalledWith({ error: 'User not found' });
    });
  });
  // Tests for updateUser and deleteUser can follow a similar pattern
});
