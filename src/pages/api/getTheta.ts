// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "@/db/drizzle";
import { apartmentsForSale } from "@/db/schema/apartmentsForSale";
import { theta } from "@/db/schema/theta";
import { top5locations } from "@/top5Locations";
import { sql, eq, desc, or, and, isNull, gt, lt, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   res.status(200).json({ name: 'John Doe' })
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await db
      .select()
      .from(theta)
      .orderBy(desc(theta.id))
      .limit(1);
    // Extract the data from the result
    const data = result;

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
