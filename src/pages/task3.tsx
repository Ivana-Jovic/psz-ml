import Image from "next/image";
import { Inter } from "next/font/google";
import Task2 from "@/components/task2";
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
import { db } from "@/db/drizzle";

type Repo = {
  //   top10PartsOfBelgrade: string[];
};

export const getServerSideProps: GetServerSideProps<Repo> = async () => {
  //   const [top10PartsOfBelgrade] = await Promise.all([
  //     db.execute<HousesForRent>(sql`Select location, count(*) as count
  //         from (
  //             select * from houses_for_sale
  //             union
  //             select * from houses_for_rent
  //             union
  //             select * from apartments_for_rent
  //             union
  //             select * from apartments_for_sale
  //         ) as properties
  //         where city = 'beograd'and location != 'beograd'
  //         group by location
  //         order by count desc
  //         limit 10
  //   `),
  //   ]);
  return {
    props: {
      //   top10PartsOfBelgrade,
      //   numOfPropertiesForRent,
    },
  };
};
export default function Task3({}: //   top10PartsOfBelgrade,
InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 `}
    >
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        Hello
        {/* {top10PartsOfBelgrade[0]} */}
      </div>
    </main>
  );
}
