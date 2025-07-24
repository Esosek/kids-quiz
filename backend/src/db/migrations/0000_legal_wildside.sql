CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"nickname" varchar(256) NOT NULL,
	"hashed_password" varchar DEFAULT 'unset' NOT NULL,
	"currency" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "users_nickname_unique" UNIQUE("nickname")
);
