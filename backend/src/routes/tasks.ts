import express from "express";
import { tickets, areas } from "../db/schema/schema";
import { ilike, or, and, sql, eq, desc } from "drizzle-orm";
import { db } from "../db";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const {
      "filters[0][field]": filterField,
      "filters[0][value]": filterValue,
      "filters[1][field]": filterField2,
      "filters[1][value]": filterValue2,
      "pagination[currentPage]": page = 1,
      "pagination[pageSize]": limit = 10,
    } = req.query;

    const current_page = Math.max(1, parseInt(String(page), 10) || 1);
    const limit_per_page = Math.min(Math.max(1, parseInt(String(limit), 10) || 10), 100);
    const offset = (current_page - 1) * limit_per_page;

    const filterConditions = [];

    const allFilters = [
      { field: filterField, value: filterValue },
      { field: filterField2, value: filterValue2 },
    ];

    for (const f of allFilters) {
      if (!f.field || !f.value) continue;
      if (f.field === "search") {
        filterConditions.push(
          or(
            ilike(tickets.titulo, `%${f.value}%`),
            ilike(tickets.codigo, `%${f.value}%`),
          )
        );
      }
      if (f.field === "area") {
        filterConditions.push(eq(tickets.area_id, parseInt(String(f.value), 10)));
      }
    }

    const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(tickets)
      .leftJoin(areas, eq(tickets.area_id, areas.id))
      .where(whereClause);

    const total = Number(countResult[0]?.count ?? 0);

    const rows = await db
      .select({
        id: tickets.id,
        code: tickets.codigo,
        name: tickets.titulo,
        description: tickets.descripcion,
        estado: tickets.estado,
        CreatedAt: tickets.CreatedAt,
        area: {
          id: areas.id,
          name: areas.nombre,
        },
      })
      .from(tickets)
      .leftJoin(areas, eq(tickets.area_id, areas.id))
      .where(whereClause)
      .orderBy(desc(tickets.CreatedAt))
      .limit(limit_per_page)
      .offset(offset);

    res.status(200).json({
      data: rows,
      pagination: {
        page: current_page,
        limit: limit_per_page,
        total,
        totalPages: Math.ceil(total / limit_per_page),
      },
    });
  } catch (e) {
    console.error(`Error: ${e}`);
    res.status(500).json({ error: "Error al obtener las tareas" });
  }
});

export default router;
