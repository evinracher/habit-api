import request from 'supertest' // Test the server without turning it out
import app from '../src/server.ts'
import {
  createTestHabit,
  cleanUpDB,
  createTestUser,
} from './setup/dbHelpers.ts'

describe('Authentication Endpoints', () => {
  afterEach(async () => {
    await cleanUpDB()
  })

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const mockUser = {
        email: `test-${Date.now()}@example.com`,
        username: 'test-user',
        password: 'adminpassword1234',
        firstName: 'Test',
        lastName: 'User',
      }
      
      const response = await request(app).post('/api/auth/register').send(mockUser);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).not.toHaveProperty('password');
    })
  })

  describe('POST /api/auth/login', () => {
    it('should log in with valid credentials', async () => {
      const testUser = await createTestUser();
      const credentials = {
        email: testUser.user.email,
        password: testUser.rawPassword
      }

      const response = await request(app).post("/api/auth/login").send(credentials);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("token");
      expect(response.body.user).not.toHaveProperty('password');
    })
  })
})
