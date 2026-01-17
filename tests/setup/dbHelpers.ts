import {db} from '../../src/db/connection.ts'
import {users, habits, entries, type User, type Habit, habitTags} from '../../src/db/schema.ts';
import { generateToken } from '../../src/utils/jwt.ts';
import { hashPassword } from '../../src/utils/password.ts';

export const createTestUser = async (userData: Partial<User> = {}) => {
  const defaultUserData = {
    email: `test-${Date.now()}@example.com`,
    username: 'test-user',
    password: 'adminpassword1234',
    firstName: 'Test',
    lastName: 'User',
    ...userData
  }

  const hashedPassword = await hashPassword(defaultUserData.password);
  
  const [user] = await db.insert(users).values({
    ...defaultUserData,
    password: hashedPassword
  }).returning();
  
  const token = generateToken({
    id: user.id,
    email: user.email,
    username: user.username,
  })

  return {token, user, rawPassword: defaultUserData.password}
}

export const createTestHabit = async (userId: string, habitData: Partial<Habit> = {}) => {
  const defaultData = {
    name: `Test habit ${Date.now()}`,
    description: 'Test habit',
    frequency: 'daily',
    targetCount: 1,
    ...habitData,
  }

  const [habit] = await db.insert(habits).values({
    userId,
    ...defaultData
  }).returning()

  return habit;
}

export const cleanUpDB = async () => {
  await db.delete(entries);
  await db.delete(users);
  await db.delete(habitTags);
  await db.delete(habits);
}