import { Router } from 'express'
import { login, register } from '../controllers/authController.ts'
import { validateBody } from '../middlewares/validation.ts'
import { insertUserSchema } from '../db/schema.ts' // You can create a custom schema for validations like password should contains special characters (*,+)
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('invalid email'),
  password: z.string().min(1, 'password is required'),
})

const router = Router()

router.post('/register', validateBody(insertUserSchema), register)

router.post('/login', validateBody(loginSchema), login)

export default router
