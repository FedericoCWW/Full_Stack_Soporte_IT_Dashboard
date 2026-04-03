import express from "express";
import { tickets, areas } from "../db/schema/schema";
import { ilike, or, and, sql, eq, getTableColumns, desc } from "drizzle-orm";
import { db } from "../db";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search, area, page = 1, limit = 10 } = req.query;

    const current_page = Math.max(1, parseInt(String(page), 10) || 1);
    const limit_per_page = Math.min(Math.max(1, parseInt(String(limit), 10) || 10), 100);

    const offset = (current_page - 1) * limit_per_page;
    const filterConditions = [];

    if (search) {
      filterConditions.push(
        or(
          ilike(tickets.titulo, `%${search}%`),
          ilike(tickets.codigo, `%${search}%`),
        ),
      );
    }
    if (area) {
      const areaPatter = `%${String(area).replace(/[%_]/g, '\\$&')}%`;
      filterConditions.push(eq(tickets.area_id, Number(area)));
    }
    const Clausewhere =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;
    const CountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(tickets)
      .leftJoin(areas, eq(tickets.area_id, areas.id))
      .where(Clausewhere);

    const TotalCount = CountResult[0]?.count ?? 0;

    const TicketList = await db
      .select({
        ...getTableColumns(tickets),
        area: { ...getTableColumns(areas) },
      })
      .from(tickets)
      .leftJoin(areas, eq(tickets.area_id, areas.id))
      .where(Clausewhere)
      .orderBy(desc(tickets.CreatedAt))
      .limit(limit_per_page)
      .offset(offset);

    res.status(200).json({
      data: TicketList,
      pagination: {
        page: current_page,
        limit: limit_per_page,
        total: TotalCount,
        totalPages: Math.ceil(TotalCount / limit_per_page)
      }
    });
  } catch (e) {
    console.log(`Error encontrado: ${e}`);
    res.status(500).json({ error: "error al obtener los tickets" });
  }
});

export default router;
