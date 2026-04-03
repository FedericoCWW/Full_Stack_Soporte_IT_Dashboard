import express from "express";
import { areas } from "../db/schema/schema";
import { ilike, sql } from "drizzle-orm";
import { db } from "../db";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search } = req.query;

    const whereClause = search ? ilike(areas.nombre, `%${search}%`) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(areas)
      .where(whereClause);

    const total = Number(countResult[0]?.count ?? 0);

    const rows = await db
      .select({
        id: areas.id,
        name: areas.nombre,
        code: areas.codigo,
        type: areas.tipo,
      })
      .from(areas)
      .where(whereClause);

    res.status(200).json({
      data: rows,
      pagination: {
        page: 1,
        limit: total,
        total,
        totalPages: 1,
      },
    });
  } catch (e) {
    console.error(`Error: ${e}`);
    res.status(500).json({ error: "Error al obtener las areas" });
  }
});

export default router;
