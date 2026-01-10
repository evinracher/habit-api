import { Router } from 'express'
import { z } from 'zod'
import { validateBody, validateParams } from '../middlewares/validation.ts'

const createHabitSchema = z.object({
  name: z.string(),
})

const completeHabitSchema = z.object({
  id: z.string(), // Quite redundant, but we can use .min and other utils
})

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'habits' })
})

router.get('/:id', (req, res) => {
  res.json({ message: `habit with id: ${req.params.id}` })
})

router.post('/', validateBody(createHabitSchema), (req, res) => {
  res.status(201).json({ message: 'habit created' })
})

router.delete(':id', (req, res) => {
  res.json({ message: 'habit deleted' })
})

router.post(
  '/:id/complete',
  validateParams(completeHabitSchema),
  validateBody(createHabitSchema),
  (req, res) => {
    res.status(201).json({ message: 'habit completed' })
  }
)

export default router
