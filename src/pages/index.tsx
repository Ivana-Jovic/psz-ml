import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { sql, eq, desc, or, and } from "drizzle-orm";
import { housesForRent, HousesForRent } from "@/db/schema/housesForRent";
import { housesForSale, HousesForSale } from "@/db/schema/housesForSale";
import {
  apartmentsForSale,
  ApartmentsForSale,
} from "@/db/schema/apartmentsForSale";
import {
  apartmentsForRent,
  ApartmentsForRent,
} from "@/db/schema/apartmentsForRent";
import Link from "next/link";

//todo check if uopste valid
// todo dodaj valid offer polje
// todo landsurface nije lepo scrapovano
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="px-10 flex flex-col gap-20 justify-center items-center min-h-screen">
        <Link href={"/task2"} className="btn">
          Go to task2
        </Link>
        <Link href={"/task3"} className="btn">
          Go to task3
        </Link>
      </div>
    </main>
  );
}
