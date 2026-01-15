import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middlewares/auth.ts'
import { db } from '../db/connection.ts'
import { habits, entries, habitTags } from '../db/schema.ts'
import { eq, and, desc, inArray } from 'drizzle-orm'

export const createHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, frequency, targetCount, tagIds } = req.body

    const result = await db.transaction(async (transaction) => {
      const [newHabit] = await transaction
        .insert(habits)
        .values({
          userId: req.user.id,
          name,
          description,
          frequency,
          targetCount,
        })
        .returning()

      if (tagIds && tagIds.length > 0) {
        // We can do the length part in the validation middleware
        const habitTagValues = tagIds.map((tagId) => ({
          habitId: newHabit.id,
          tagId,
        }))
        await transaction.insert(habitTags).values(habitTagValues)
      }

      return newHabit
    })

    res.status(201).json({ message: 'Habit created', habit: result })
  } catch (error) {
    console.error('Create habit error',error)
    res.status(500).json({ error: 'Failed to create habit' })
  }
}

export const getUserHabits = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userHabitsWithTags = await db.query.habits.findMany({
      where: eq(habits.userId, req.user.id),
      with: {
        habitTags: {
          with: {
            tag: true,
          },
        },
      },
      orderBy: [desc(habits.createdAt)],
    })

    // We could use transformers in the DB level instead
    const habitsWithTags = userHabitsWithTags.map((habit) => ({
      ...habit,
      tags: habit.habitTags.map((habitTag) => habitTag.tag),
      habitTags: undefined, // remove the fill when stringify
    }))

    res.json({
      habits: habitsWithTags,
    })
  } catch (error) {
    console.error('Getting habits error', error)
    res.status(500).json({ error: 'Failed to get habits' })
  }
}

export const updateHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id
    const userId = req.user.id
    const { tagIds, ...updates } = req.body // We will ignore tagId, because it is for another table

    const result = await db.transaction(async (transaction) => {
      const [updatedHabit] = await transaction
        .update(habits)
        .set({ ...updates, updatedAt: new Date() })
        .where(
          and(
            eq(habits.id, id),
            eq(habits.userId, userId) // Authorization to update the habit (it belongs to the user)
          )
        )
        .returning()

      if (!updatedHabit) {
        // throw new Error("Habit not found")
        return res.status(401).end()
      }

      if (tagIds !== undefined) {
        await transaction.delete(habitTags).where(eq(habitTags.habitId, id)) // Delete tagIds from habits (client need to send it)
        if (tagIds.length > 0) {
          const habitTagValues = tagIds.map((tagId) => ({
            habitId: id,
            tagId,
          }))
          await transaction.insert(habitTags).values(habitTagValues)
        }
      }

      return updateHabit
    })

    res.json({
      message: 'Habit was updated',
      habit: result,
    })
  } catch (error) {
    console.error('Update habit error', error)
    res.status(500).json({ error: 'Failed to update habit' })
  }
}
