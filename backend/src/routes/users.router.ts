import { Router } from 'express';
import { createUser, getAllUsers, getUserById, deleteUser, updateUser } from '../controllers/users.controller';

const router = Router();

router.get('/', (req, res) => {
  getAllUsers(req, res);
});

router.get('/:id', (req, res) => {
  getUserById(req, res);
});

router.post('/', (req, res) => {
  createUser(req, res);
});

router.put('/:id', (req, res) => {
  updateUser(req, res);
});

router.delete('/:id', (req, res) => {
  deleteUser(req, res);
});

export default router;