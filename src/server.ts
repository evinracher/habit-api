import express from 'express'
import authRoutes from './routes/authRoutes.ts'
import userRoutes from './routes/userRoutes.ts'
import habitRoutes from './routes/habitRoutes.ts'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { isTest } from '../env.ts'
import { errorHandler } from './middlewares/errorHandler.ts'

const app = express()
app.use(helmet())
app.use(cors({
    origin: ["localhost"]
}))
app.use(express.json()) // Middleware to handle the post requests
// Interprets encoded URLs, based on the content type
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev', {
    skip: () => isTest(), // skip request logging when testing
}))

app.get('/health', (req, res) => {
  res.json({
    message: 'Server up',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/habits', habitRoutes)

app.use(errorHandler)

export default app
