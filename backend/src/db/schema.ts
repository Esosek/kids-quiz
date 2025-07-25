import { pgTable, timestamp, uuid, varchar, integer } from 'drizzle-orm/pg-core'

export type User = typeof users.$inferSelect

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  username: varchar('username', { length: 64 }).unique().notNull(),
  hashedPassword: varchar('hashed_password').default('unset').notNull(),
  currency: integer('currency').default(0).notNull(),
})
