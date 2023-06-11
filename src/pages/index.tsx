import Image from "next/image";
import { Inter } from "next/font/google";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { housesForRent, HousesForRent } from "@/db/schema/housesForRent";
import { sql } from "drizzle-orm";

type Repo = {
  data: Pick<HousesForRent, "title">[];
};

export const getServerSideProps: GetServerSideProps<Repo> = async () => {
  const pool = new Pool({ connectionString: process.env.DB_CONNECTION });
  const db = drizzle(pool);
  // todo promise all
  const [result, result2] = await Promise.all([
    db.select({ title: housesForRent.title }).from(housesForRent).limit(5),
    db.execute(sql`Select * from houses_for_rent limit 5`),
  ]);
  console.log((result2.rows as HousesForRent[])[0]);
  return { props: { data: result } };
};

const inter = Inter({ subsets: ["latin"] });

export default function Home({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        Hello, {data[0].title}
      </div>
    </main>
  );
}
