ALTER TABLE "questions" RENAME COLUMN "answer" TO "correct_answer";--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "answers" text[] NOT NULL;