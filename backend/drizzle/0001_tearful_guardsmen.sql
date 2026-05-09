CREATE TYPE "public"."class_status" AS ENUM('activo', 'inactivo', 'archivado');--> statement-breakpoint
CREATE TABLE "clase" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "clase_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"ticket_id" integer NOT NULL,
	"titulo" varchar(255) NOT NULL,
	"descripcion" text NOT NULL,
	"area_id" integer NOT NULL,
	"status" "class_status" DEFAULT 'activo' NOT NULL,
	"user_asignado" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "area" ALTER COLUMN "code" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "area" ALTER COLUMN "tipo" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "tickets" ALTER COLUMN "descripcion" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "user_asignado" text;--> statement-breakpoint
ALTER TABLE "clase" ADD CONSTRAINT "clase_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clase" ADD CONSTRAINT "clase_area_id_area_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."area"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "clase_area_id_idx" ON "clase" USING btree ("area_id");--> statement-breakpoint
CREATE INDEX "clase_user_asignado_idx" ON "clase" USING btree ("user_asignado");--> statement-breakpoint
CREATE INDEX "tickets_area_id_idx" ON "tickets" USING btree ("area_id");--> statement-breakpoint
CREATE INDEX "tickets_user_asignado_idx" ON "tickets" USING btree ("user_asignado");