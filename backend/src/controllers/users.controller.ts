// import { PrismaClient, Role } from '@prisma/client';
import { prisma, Role } from '../prismaClient';
import { Request, Response } from 'express';


// const prisma = new PrismaClient();

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role, // Defaults to USER if not provided
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: 'Failed to create user', details: error.message });
    }
    res.status(500).json({ error: 'Unknown error occurred during creation' });
  }
};


// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: 'Failed to retrieve users', details: error.message });
    }
    res.status(500).json({ error: 'Unknown error occurred during retrieval' });
  }
};

// Get a single user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: 'Failed to retrieve user', details: error.message });
    }
    res.status(500).json({ error: 'Unknown error occurred during retrieval' });
  }
};

// Update a user by ID
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: 'Failed to retrieve user', details: error.message });
      }
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { name, email, password, role } = req.body;

    const data: { name?: string; email?: string; password?: string; role?: Role } = {};
    if (name) data.name = name;
    if (email) data.email = email;
    if (password) data.password = password;
    if (role) data.role = role;

    // Perform the update
    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: 'Failed to update user', details: error.message });
    }
    res.status(500).json({ error: 'Unknown error occurred during update' });
  }
};

// Delete a user by ID
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(204).json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: 'Failed to delete user', details: error.message });
    }
    res.status(500).json({ error: 'Unknown error occurred during deletion' });
  }
};
