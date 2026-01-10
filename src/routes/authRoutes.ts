import { Router } from 'express'
import { register } from '../controllers/authController.ts'
import { validateBody } from '../middlewares/validation.ts'
import { insertUserSchema } from '../db/schema.ts' // You can create a custom schema for validations like password should contains special characters (*,+)

const router = Router()

router.post('/register', validateBody(insertUserSchema), register)

router.post('/login', (req, res) => {
  res.status(201).json({ message: 'User logged in' })
})

export default router
