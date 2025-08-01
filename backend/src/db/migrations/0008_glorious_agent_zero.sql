ALTER TABLE "user_unlocks" DROP CONSTRAINT "user_unlocks_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_unlocks" DROP CONSTRAINT "user_unlocks_subcategory_id_subcategories_id_fk";
--> statement-breakpoint
ALTER TABLE "user_unlocks" ADD CONSTRAINT "user_unlocks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_unlocks" ADD CONSTRAINT "user_unlocks_subcategory_id_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."subcategories"("id") ON DELETE cascade ON UPDATE no action;