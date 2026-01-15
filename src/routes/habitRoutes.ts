import { Router } from 'express'
import { z } from 'zod'
import { validateBody, validateParams } from '../middlewares/validation.ts'
import { authenticateToken } from '../middlewares/auth.ts'
import { createHabit, getUserHabits, updateHabit } from '../controllers/habitController.ts'

// TODO: complete controllers

const createHabitSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  frequency: z.string(),
  targetCount: z.number().optional(),
  tagIds: z.array(z.string()).optional(),
})

const completeHabitSchema = z.object({
  id: z.string(), // Quite redundant, but we can use .min and other utils
})

const router = Router();

router.use(authenticateToken); // Apply middleware to all the endpoints in this router

router.get('/', getUserHabits);

router.get('/:id', (req, res) => {
  res.json({ message: `habit with id: ${req.params.id}` })
});

router.post('/', validateBody(createHabitSchema), createHabit);

router.delete('/:id', (req, res) => {
  res.json({ message: 'habit deleted' })
});

router.patch('/:id', updateHabit);

router.post(
  '/:id/complete',
  validateParams(completeHabitSchema),
  validateBody(createHabitSchema),
  (req, res) => {
    res.status(201).json({ message: 'habit completed' })
  }
);

export default router
