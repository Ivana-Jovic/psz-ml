import Image from "next/image";
import { Inter } from "next/font/google";
import Task2 from "@/components/task2";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { sql } from "drizzle-orm";
import { housesForRent, HousesForRent } from "@/db/schema/housesForRent";
import { housesForSale } from "@/db/schema/housesForSale";
import { apartmentsForSale } from "@/db/schema/apartmentsForSale";

type Repo = {
  data: Pick<HousesForRent, "title">[];
  numOfRentedProperties: number;
};

export const getServerSideProps: GetServerSideProps<Repo> = async () => {
  const pool = new Pool({ connectionString: process.env.DB_CONNECTION });
  const db = drizzle(pool);
  // todo promise all
  const [
    result,
    numOfHousesForRent,
    // numOfHousesForSale,
    // numOfApartmentsForSale,
    // numOfApartmentsForRent,
    // result, result2
  ] = await Promise.all([
    db.select({ title: housesForRent.title }).from(housesForRent).limit(5),
    // db.execute(sql`Select * from houses_for_rent limit 5`),
    // 2.a) izlistati koliki je broj nekretnina za prodaju, a koliki je broj koji se iznajmljuju;
    db.select({ count: sql<number>`count(*)` }).from(housesForRent),
    // db.select({ count: sql<number>`count(*)` }).from(housesForSale),
    // db.select({ count: sql<number>`count(*)` }).from(apartmentsForRent),
    // db.select({ count: sql<number>`count(*)` }).from(apartmentsForSale),
    // 2.b) izlistati koliko nekretnina se prodaje u svakom od gradova
    // db
    //   .select({ city: housesForSale.city, count: sql<number>`count(*)` })
    //   .from(housesForSale)
    //   .groupBy(housesForSale.city),
    // db
    //   .select({ city: apartmentsForSale.city, count: sql<number>`count(*)` })
    //   .from(apartmentsForSale)
    //   .groupBy(apartmentsForSale.city),
    // ,
    // db.execute(sql`Select city, count(*) as property_count
    //   from (
    //     select city from apartments_for_sale
    //     union all
    //     select city from houses_for_sale
    //   ) as properties_for_sale
    //   group by city
    // `),
    // 2.c) izlistati koliko je uknjiženih, a koliko neuknjiženih kuća, a koliko stanova
    //   todo kako sad za neuknjizene jer moze biti undef
    //db.execute(sql`Select count(*) as property_count
    //     from (
    //       select * from houses_for_rent
    //       union
    //       select * from houses_for_sale
    //     ) as houses
    //     where registered = 'true'
    //   `),
    //   db.execute(sql`Select count(*) as property_count
    //     from (
    //       select * from apartments_for_sale
    //       union
    //       select * from apartments_for_rent
    //     ) as apartments
    //     where registered = 'true'
    // `),
    //TODO odvoj querije
    //2.d) prikazati rang listu prvih 30 najskupljih kuća koje se prodaju, i 30 najskupljih stanova koji se prodaju u Srbiji;
    //   db.execute(sql`Select *
    //     from (
    //       select * from apartments_for_sale
    //       union
    //       select * from apartments_for_rent
    //     ) as apartments
    //     order by price desc
    //     limit 30
    // `), isto i za kuce
    //3.e) prikazati rang listu prvih 100 najvećih kuća i 100 najvećih stanova po površini (kvadraturi)
    //   db.execute(sql`Select *
    //     from (
    //       select * from apartments_for_sale
    //       union
    //       select * from apartments_for_rent
    //     ) as apartments
    //     order by size desc
    //     limit 100
    // `), isto i za kuce
    //3.f) prikazati rang listu svih nekretnina izgrađenih u 2022. ili 2023. godini, i izlistati ih opadajuće prema ceni prodaje, odnosno ceni iznajmljivanja;
    //   db.execute(sql`Select *
    //     from (
    //       select * from apartments_for_sale
    //       where year_of_construction=2022 or year_of_construction=2023
    //       union
    //       select * from houses_for_sale
    //       where year_of_construction=2022 or year_of_construction=2023
    //       union
    //       select * from apartments_for_rent
    //       where year_of_construction=2022 or year_of_construction=2023
    //       union
    //       select * from houses_for_rent
    //       where year_of_construction=2022 or year_of_construction=2023
    //     ) as properties
    //     order by price desc
    // `), isto i za rentu
  ]);
  // console.log((result2.rows as HousesForRent[])[0]);
  const numOfRentedProperties: number = numOfHousesForRent[0].count;
  return { props: { data: result, numOfRentedProperties } };
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
        <Task2 data={data} numOfRentedProperties={0} />
      </div>
    </main>
  );
}
