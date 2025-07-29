import { pgTable, timestamp, uuid, varchar, integer } from 'drizzle-orm/pg-core'

export type User = typeof users.$inferSelect
export type Category = typeof categories.$inferSelect

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

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  label: varchar('label', { length: 64 }).unique().notNull(),
})

export const subcategories = pgTable('subcategories', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  label: varchar('label', { length: 64 }).unique().notNull(),
  categoryId: uuid('category_id').references(() => categories.id, {
    onDelete: 'set null',
  }),
})
