import { db } from '../../src/db/connection.ts'
import { users, habits, entries, tags, habitTags } from '../../src/db/schema.ts'

import { sql } from 'drizzle-orm'
import { execSync } from 'node:child_process'

// Clean up the DB. This is one of the way to do it. We use this one to showcase this feature
const cleanUp = async () => {
  await db.execute(sql`DROP TABLE IF EXISTS ${entries} CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS ${tags} CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS ${habitTags} CASCADE`)
}

export default async function setup() {
  try {
    console.log('Setting up the test db 💻')
    await cleanUp()

    console.log('Pushing schema using drizzle-kit...')
    console.log('APP_STAGE', process.env.APP_STAGE)
    console.log('DATABASE_URL', process.env.DATABASE_URL)
    // Execute terminal commands
    // child_process opens a new terminal
    execSync(
      `npx drizzle-kit push --url="${process.env.DATABASE_URL}" --schema="./src/db/schema.ts" --dialect="postgresql"`,
      {
        stdio: 'inherit', // inherit output
        cwd: process.cwd(),
      }
    )

    console.log('Test DB created')
  } catch (error) {
    console.error('FAILED TO SETUP TEST DB', error)
    throw error
  }

  return async () => {
    try {
      await cleanUp()
      process.exit(0)
    } catch (error) {
      console.error('FAILED TO CLEAN UP TEST DB', error)
    }
  }
}
