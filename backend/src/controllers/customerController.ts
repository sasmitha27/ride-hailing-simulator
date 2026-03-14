import { Request, Response } from "express";
import { prisma } from "../prisma";

export async function listCustomers(_req: Request, res: Response): Promise<void> {
  try {
    // If Prisma client doesn't have `customer` due to missing migration, this will throw.
    // Return a helpful error instead of crashing.
    // @ts-ignore
    const customers = await prisma.customer.findMany({ orderBy: { id: "asc" } });
    res.json(customers);
  } catch (err) {
    res.status(501).json({ error: "Customer model not available. Run prisma migrate and generate to enable this endpoint." });
  }
}
