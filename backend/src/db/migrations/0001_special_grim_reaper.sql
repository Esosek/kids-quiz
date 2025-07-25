ALTER TABLE "users" RENAME COLUMN "nickname" TO "username";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_nickname_unique";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");