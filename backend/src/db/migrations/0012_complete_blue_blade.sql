ALTER TABLE "subcategories" ADD COLUMN "image_url" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_image_url_unique" UNIQUE("image_url");