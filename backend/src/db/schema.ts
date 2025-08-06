import { unique } from 'drizzle-orm/pg-core'
import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  integer,
  text,
} from 'drizzle-orm/pg-core'

export type User = typeof users.$inferSelect
export type Category = typeof categories.$inferSelect
export type Subcategory = typeof subcategories.$inferSelect
export type Question = typeof questions.$inferSelect
export type UserUnlock = typeof userUnlocks.$inferSelect
export type UserAnswer = typeof userAnswers.$inferSelect

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 64 }).unique().notNull(),
  hashedPassword: varchar('hashed_password').default('unset').notNull(),
  currency: integer('currency').default(0).notNull(),
  avatar: varchar('avatar').notNull().default('not set'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  label: varchar('label', { length: 64 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const subcategories = pgTable('subcategories', {
  id: uuid('id').primaryKey().defaultRandom(),
  label: varchar('label', { length: 64 }).unique().notNull(),
  unlockPrice: integer('unlock_price').notNull().default(0), // 0 is automatically unlocked on creating user
  categoryId: uuid('category_id').references(() => categories.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const questions = pgTable('questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  text: text('text'),
  correctAnswer: text('correct_answer').notNull(),
  answers: text('answers').array().notNull(),
  imgUrl: varchar('img_url'),
  subcategoryId: uuid('subcategory_id')
    .notNull()
    .references(() => subcategories.id, {
      onDelete: 'cascade',
    }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const userUnlocks = pgTable(
  'user_unlocks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    subcategoryId: uuid('subcategory_id')
      .references(() => subcategories.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return [
      unique('unique_user_subcategory').on(table.userId, table.subcategoryId),
    ]
  }
)

export const userAnswers = pgTable(
  'user_answers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    questionId: uuid('question_id')
      .references(() => questions.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return [unique('unique_user_question').on(table.userId, table.questionId)]
  }
)
