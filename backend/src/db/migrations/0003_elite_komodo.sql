CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"text" text,
	"answer" text NOT NULL,
	"img_url" varchar,
	"subcategory_id" uuid NOT NULL,
	CONSTRAINT "questions_answer_unique" UNIQUE("answer")
);
--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_subcategory_id_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."subcategories"("id") ON DELETE cascade ON UPDATE no action;