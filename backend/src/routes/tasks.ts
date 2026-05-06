import express from "express";
import type { Request } from "express";
import { tickets, areas } from "../db/schema/schema";
import { ilike, or, and, sql, eq, desc, asc } from "drizzle-orm";
import { db } from "../db";

const router = express.Router();

type ParsedFilter = { field?: string; value?: unknown };

function getNestedFilters(req: Request): ParsedFilter[] {
  const raw = req.query.filters;
  if (Array.isArray(raw)) {
    return raw.map((f) =>
      f && typeof f === "object" ? (f as ParsedFilter) : {},
    );
  }
  if (raw && typeof raw === "object") {
    return Object.values(raw as Record<string, ParsedFilter>).filter(Boolean);
  }

  const flat: ParsedFilter[] = [];
  for (let i = 0; i < 32; i++) {
    const fieldKey = `filters[${i}][field]`;
    if (req.query[fieldKey] === undefined) break;
    flat.push({
      field: String(req.query[fieldKey]),
      value: req.query[`filters[${i}][value]`],
    });
  }
  return flat;
}

function getPagination(req: Request): { page: number; limit: number } {
  const pag = req.query.pagination;
  if (pag && typeof pag === "object" && pag !== null && !Array.isArray(pag)) {
    const p = pag as Record<string, unknown>;
    const page = Math.max(1, parseInt(String(p.currentPage ?? 1), 10) || 1);
    const limit = Math.min(
      Math.max(1, parseInt(String(p.pageSize ?? 10), 10) || 10),
      100,
    );
    return { page, limit };
  }

  const page = Math.max(
    1,
    parseInt(String(req.query["pagination[currentPage]"] ?? 1), 10) || 1,
  );
  const limit = Math.min(
    Math.max(1, parseInt(String(req.query["pagination[pageSize]"] ?? 10), 10) || 10),
    100,
  );
  return { page, limit };
}

type SortPart = { field?: string; order?: string };

function getSorters(req: Request): SortPart[] {
  const raw = req.query.sorters;
  if (Array.isArray(raw)) {
    return raw.map((s) =>
      s && typeof s === "object" ? (s as SortPart) : {},
    );
  }
  if (raw && typeof raw === "object") {
    return Object.values(raw as Record<string, SortPart>).filter(Boolean);
  }

  const flat: SortPart[] = [];
  for (let i = 0; i < 8; i++) {
    const fieldKey = `sorters[${i}][field]`;
    if (req.query[fieldKey] === undefined) break;
    flat.push({
      field: String(req.query[fieldKey]),
      order: String(req.query[`sorters[${i}][order]`] ?? "desc"),
    });
  }
  return flat;
}

router.get("/", async (req, res) => {
  try {
    const { page: current_page, limit: limit_per_page } = getPagination(req);
    const offset = (current_page - 1) * limit_per_page;

    const filterConditions = [];

    for (const f of getNestedFilters(req)) {
      if (!f.field || f.value === undefined || f.value === "") continue;
      if (f.field === "search") {
        filterConditions.push(
          or(
            ilike(tickets.titulo, `%${f.value}%`),
            ilike(tickets.codigo, `%${f.value}%`),
          ),
        );
      }
      if (f.field === "area") {
        filterConditions.push(
          eq(tickets.area_id, parseInt(String(f.value), 10)),
        );
      }
    }

    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(tickets)
      .leftJoin(areas, eq(tickets.area_id, areas.id))
      .where(whereClause);

    const total = Number(countResult[0]?.count ?? 0);

    const sorters = getSorters(req);
    const primarySort = sorters[0];
    const orderCol =
      primarySort?.field === "id"
        ? tickets.id
        : primarySort?.field === "code"
          ? tickets.codigo
          : primarySort?.field === "name"
            ? tickets.titulo
            : tickets.CreatedAt;
    const orderFn =
      primarySort?.order === "asc" ? asc(orderCol) : desc(orderCol);

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
      .orderBy(orderFn)
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
