import {relations } from "drizzle-orm";
import { integer, pgTable, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

export const estadoTicketEnum = pgEnum('estado_ticket', ['Abierto', 'En proceso', 'Cerrado', 'Pendiente tecnologia', 'Pendiente de obra', 'Pendiente usuario']);

const timestamps = {
    CreatedAt: timestamp('created_at').defaultNow().notNull(),
    UpdatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()).notNull(),
}

export const areas = pgTable('area',{
    'id': integer('id').primaryKey().generatedAlwaysAsIdentity(),
    'codigo': varchar('code', {length:40}).notNull().unique(),
    'nombre': varchar('nombre', {length:255}).notNull(),
    'tipo': varchar('tipo', {length:20}).notNull(),
    ...timestamps
});

export const tickets = pgTable('tickets',{
    'id': integer('id').primaryKey().generatedAlwaysAsIdentity(),
    'area_id': integer('area_id').notNull().references(() => areas.id, {onDelete: 'restrict'}),
    'titulo': varchar('titulo', {length:255}).notNull(),
    'descripcion': varchar('descripcion', {length:255}).notNull(),
    'codigo': varchar('codigo', {length:20}).notNull(),
    'estado': estadoTicketEnum('estado').default('Abierto'),
    ...timestamps
});


// many() se usa para establecer relaciones de varias entre diferentes entidades.
export const areasRelaciones = relations(areas, ({ many }) => ({ tickets:many(tickets) }));
export const ticketsRelaciones = relations(tickets, ({ one,  many }) => ({ areas: one(areas, {
    fields: [tickets.area_id], 
    references: [areas.id],
    }) 
}));

export type Area = typeof areas.$inferSelect;   //siempre sincronizado con la db.
export type NewArea = typeof areas.$inferInsert;
export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;