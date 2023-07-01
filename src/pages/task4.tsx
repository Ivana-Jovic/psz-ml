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
const Task4 = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex flex-col items-center gap-10">
        <Link href={"/"} className="btn">
          Go to home
        </Link>
      </div>
    </main>
  );
};

export default Task4;
