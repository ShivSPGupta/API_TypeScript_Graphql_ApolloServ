import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import {authenticateToken } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/express';

const router = Router();
 const auth = authenticateToken;
/** 
 * Create a new user (Register) 
 * POST /api/users 
 */
router.post('/users', async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

/** 
 * Get all users with Pagination, Sorting, and Filtering 
 * GET /api/users 
 */
router.get('/users', async (req: AuthenticatedRequest, res: Response<any>, next: NextFunction): Promise<any>=> {
  try {
    const { page = 1, limit = 10, sort = 'email', filter = '' } = req.query;

    const query = filter ? { email: { $regex: filter, $options: 'i' } } : {};
    const users = await User.find(query)
      .sort({ [sort as string]: 1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    res.json(users);
  } catch (error) {
    next(error);
  }
});

/** 
 * Get a single user by ID 
 * GET /api/users/:id 
 */
router.get('/users/:id', async (req: Request, res: Response, next: NextFunction) : Promise<any>=> {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

/** 
 * Update a user by ID 
 * PUT /api/users/:id 
 */
router.put('/users/:id', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { name, email, password } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, password },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

/** 
 * Delete a user by ID 
 * DELETE /api/users/:id 
 */
router.delete('/users/:id', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
