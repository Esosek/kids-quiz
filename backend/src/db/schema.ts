import { pgTable, timestamp, uuid, varchar, integer } from 'drizzle-orm/pg-core'

export type User = Pick<
  typeof users.$inferSelect,
  'id' | 'nickname' | 'currency'
>

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  nickname: varchar('nickname', { length: 256 }).unique().notNull(),
  hashedPassword: varchar('hashed_password').default('unset').notNull(),
  currency: integer('currency').default(0).notNull(),
})
