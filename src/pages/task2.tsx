import Image from "next/image";
import { Inter } from "next/font/google";
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
import Card from "@/components/card";
import TableApartments from "@/components/tableApartments";
import TableHouses from "@/components/tableHouses";

type Count = {
  count: number;
};
type CountCity = {
  count: number;
  city: string | null;
};
type Repo = {
  // data: Pick<HousesForRent, "title">[];
  numOfPropertiesForRent: number;
  numOfPropertiesForSale: number;
  numOfHousesForRent: number; // 2.a) - 4 queries
  numOfHousesForSale: number;
  numOfApartmentsForRent: number;
  numOfApartmentsForSale: number;
  numOfHousesForSaleCity: CountCity[]; // 2.b) - 2
  numOfApartmentsForSaleCity: CountCity[];
  numOfHousesForRentRegistered: number; // 2.c) - 8
  numOfHousesForSaleRegistered: number;
  numOfHousesForRentUnRegistered: number;
  numOfHousesForSaleUnRegistered: number;
  numOfApartmentsForRentRegistered: number;
  numOfApartmentsForSaleRegistered: number;
  numOfApartmentsForRentUnRegistered: number;
  numOfApartmentsForSaleUnRegistered: number;
  top30PriceHousesForSale: HousesForSale[]; // 2.d) - 2
  top30PriceApartmentsForSale: ApartmentsForSale[];
  top100SizeHouses: HousesForRent[]; // 2.e) - 2
  top100SizeApartments: ApartmentsForRent[];
  constructionYearHousesRent: HousesForRent[]; // 2)f - 4
  constructionYearHousesSale: HousesForSale[];
  constructionYearApartmentsRent: ApartmentsForRent[];
  constructionYearApartmentsSale: ApartmentsForSale[];
  top30NumOfRoomsHouses: HousesForRent[]; // 2)g1 - 2
  top30NumOfRoomsApartments: ApartmentsForRent[];
  top30SizeApartments: ApartmentsForRent[]; // 2)g2 - 1
  top30LandSizeHouses: HousesForRent[];
};

export const getServerSideProps: GetServerSideProps<Repo> = async () => {
  const pool = new Pool({ connectionString: process.env.DB_CONNECTION });
  const db = drizzle(pool);
  // Redosled:
  // houses apartments
  // rent sale
  const [
    // result,
    numOfHousesForRent, // 2.a) - 4 queries
    numOfHousesForSale,
    numOfApartmentsForRent,
    numOfApartmentsForSale,
    numOfHousesForSaleCity, // 2.b) - 2
    numOfApartmentsForSaleCity,
    numOfHousesForRentRegistered, // 2.c) - 8
    numOfHousesForSaleRegistered,
    numOfHousesForRentUnRegistered,
    numOfHousesForSaleUnRegistered,
    numOfApartmentsForRentRegistered,
    numOfApartmentsForSaleRegistered,
    numOfApartmentsForRentUnRegistered,
    numOfApartmentsForSaleUnRegistered,
    top30PriceHousesForSale, // 2.d) - 2
    top30PriceApartmentsForSale,
    top100SizeHouses, // 2.e) - 2
    top100SizeApartments,
    constructionYearHousesRent, // 2)f - 4
    constructionYearHousesSale,
    constructionYearApartmentsRent,
    constructionYearApartmentsSale,
    top30NumOfRoomsHouses, // 2)g1 - 2
    top30NumOfRoomsApartments,
    top30SizeApartments, // 2)g2 - 1
    top30LandSizeHouses, // 2)g3 - 1
    // result, result2
  ] = await Promise.all([
    // db.select({ title: housesForRent.title }).from(housesForRent).limit(5),

    // -------------------------- 2.a) --------------------------
    // 2.a) izlistati koliki je broj nekretnina za prodaju, a koliki je broj koji se iznajmljuju;
    db.select({ count: sql<number>`count(*)` }).from(housesForRent),
    db.select({ count: sql<number>`count(*)` }).from(housesForSale),
    db.select({ count: sql<number>`count(*)` }).from(apartmentsForRent),
    db.select({ count: sql<number>`count(*)` }).from(apartmentsForSale),

    // -------------------------- 2.b) --------------------------
    // 2.b) izlistati koliko nekretnina se prodaje u svakom od gradova
    db
      .select({ city: housesForSale.city, count: sql<number>`count(*)` })
      .from(housesForSale)
      .groupBy(housesForSale.city),
    db
      .select({ city: apartmentsForSale.city, count: sql<number>`count(*)` })
      .from(apartmentsForSale)
      .groupBy(apartmentsForSale.city),

    // -------------------------- 2.c) --------------------------
    // 2.c) izlistati koliko je uknjiženih, a koliko neuknjiženih kuća, a koliko stanova
    // registered can be undefined
    // houses
    db
      .select({ count: sql<number>`count(*)` })
      .from(housesForRent)
      .where(eq(housesForRent.registered, true)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(housesForSale)
      .where(eq(housesForSale.registered, true)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(housesForRent)
      .where(eq(housesForRent.registered, false)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(housesForSale)
      .where(eq(housesForSale.registered, false)),
    //apartments
    db
      .select({ count: sql<number>`count(*)` })
      .from(apartmentsForRent)
      .where(eq(apartmentsForRent.registered, true)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(apartmentsForSale)
      .where(eq(apartmentsForSale.registered, true)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(apartmentsForRent)
      .where(eq(apartmentsForRent.registered, false)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(apartmentsForSale)
      .where(eq(apartmentsForSale.registered, false)),

    // -------------------------- 2.d) --------------------------
    //TODO odvoj querije
    //2.d) prikazati rang listu prvih 30 najskupljih kuća koje se prodaju, i 30 najskupljih stanova koji se prodaju u Srbiji;
    db
      .select()
      .from(housesForSale)
      .orderBy(desc(housesForSale.price))
      .limit(30),
    db
      .select()
      .from(apartmentsForSale)
      .orderBy(desc(apartmentsForSale.price))
      .limit(30),

    // -------------------------- 2.e) --------------------------
    //2.e) prikazati rang listu prvih 100 najvećih kuća i 100 najvećih stanova po površini (kvadraturi)
    db.execute<HousesForRent>(sql`Select *
      from (
        select * from houses_for_sale
        union
        select * from houses_for_rent
      ) as houses
      order by size desc
      limit 100
    `),
    db.execute<ApartmentsForRent>(sql`Select *
        from (
          select * from apartments_for_sale
          union
          select * from apartments_for_rent
        ) as apartments
        order by size desc
        limit 100
    `),

    // -------------------------- 2.f) --------------------------
    //2.f) prikazati rang listu svih nekretnina izgrađenih u 2022. ili 2023. godini, i izlistati ih opadajuće prema ceni prodaje, odnosno ceni iznajmljivanja;
    //   db.execute(sql`  Select *
    //       from (
    //         select * from apartments_for_rent
    //         where year_of_construction=2022 or year_of_construction=2023
    //         union
    //         select * from houses_for_rent
    //         where year_of_construction=2022 or year_of_construction=2023
    //       ) as properties
    //       order by price desc `),
    // houses
    db
      .select()
      .from(housesForRent)
      .where(
        or(
          eq(housesForRent.yearOfConstruction, 2022),
          eq(housesForRent.yearOfConstruction, 2023)
        )
      )
      .orderBy(desc(housesForRent.price)),
    db
      .select()
      .from(housesForSale)
      .where(
        or(
          eq(housesForSale.yearOfConstruction, 2022),
          eq(housesForSale.yearOfConstruction, 2023)
        )
      )
      .orderBy(desc(housesForSale.price)),
    //apartments
    db
      .select()
      .from(apartmentsForRent)
      .where(
        or(
          eq(apartmentsForRent.yearOfConstruction, 2022),
          eq(apartmentsForRent.yearOfConstruction, 2023)
        )
      )
      .orderBy(desc(apartmentsForRent.price)),
    db
      .select()
      .from(apartmentsForSale)
      .where(
        or(
          eq(apartmentsForSale.yearOfConstruction, 2022),
          eq(apartmentsForSale.yearOfConstruction, 2023)
        )
      )
      .orderBy(desc(apartmentsForSale.price)),

    // -------------------------- 2.g) --------------------------
    //2.g) prikazati nekretnine (Top30) koje imaju:
    // ▪ najveći broj soba unutar nekretnine,
    //TODO: vidi i n a drugim mestima da li dodati is not null
    db.execute<HousesForRent>(sql`Select *
      from (
        select * from houses_for_sale
        union
        select * from houses_for_rent
      ) as houses
      where num_of_rooms is not NULL
      order by num_of_rooms desc
      limit 30
    `),
    db.execute<ApartmentsForRent>(sql`Select *
      from (
        select * from apartments_for_sale
        union
        select * from apartments_for_rent
      ) as apartments
      where num_of_rooms is not NULL
      order by num_of_rooms desc
      limit 30
    `),

    // ▪ najveću kvadraturu (samo za stanove),
    db.execute<ApartmentsForRent>(sql`Select *
    from (
      select * from apartments_for_sale
      union
      select * from apartments_for_rent
    ) as apartments
    where size is not NULL
    order by size desc
    limit 30
  `),
    // ▪ najveću površinu zemljišta (samo za kuće)
    db.execute<HousesForRent>(sql`Select *
    from (
      select * from houses_for_sale
      union
      select * from houses_for_rent
    ) as houses
    where land_surface is not NULL
    order by land_surface desc
    limit 30
  `),
    db
      .select()
      .from(apartmentsForSale)
      .orderBy(desc(apartmentsForSale.price))
      .limit(30),
  ]);
  // console.log((result2.rows as HousesForRent[])[0]);
  // console.log(typeof numOfHousesForRent[0].count);
  // console.log(numOfHousesForSaleCity);
  // numOfApartmentsForSaleCity)
  // const tmp = db
  //   .select({ title: housesForRent.title })
  //   .from(housesForRent)
  //   .limit(30);
  // console.log(typeof numOfHousesForRent);
  const numOfPropertiesForRent: number =
    +numOfHousesForRent[0].count + +numOfApartmentsForRent[0].count;
  const numOfPropertiesForSale: number =
    +numOfHousesForSale[0].count + +numOfApartmentsForSale[0].count;
  // console.log(top100SizeHouses.rows);
  return {
    props: {
      numOfPropertiesForRent,
      numOfPropertiesForSale,
      numOfHousesForRent: +numOfHousesForRent[0].count, // 2.a) - 4 queries
      numOfHousesForSale: +numOfHousesForSale[0].count,
      numOfApartmentsForRent: +numOfApartmentsForRent[0].count,
      numOfApartmentsForSale: +numOfApartmentsForSale[0].count,
      numOfHousesForSaleCity: numOfHousesForSaleCity, // 2.b) - 2
      numOfApartmentsForSaleCity: numOfApartmentsForSaleCity,
      numOfHousesForRentRegistered: +numOfHousesForRentRegistered[0].count, // 2.c) - 8
      numOfHousesForSaleRegistered: +numOfHousesForSaleRegistered[0].count,
      numOfHousesForRentUnRegistered: +numOfHousesForRentUnRegistered[0].count,
      numOfHousesForSaleUnRegistered: +numOfHousesForSaleUnRegistered[0].count,
      numOfApartmentsForRentRegistered:
        +numOfApartmentsForRentRegistered[0].count,
      numOfApartmentsForSaleRegistered:
        +numOfApartmentsForSaleRegistered[0].count,
      numOfApartmentsForRentUnRegistered:
        +numOfApartmentsForRentUnRegistered[0].count,
      numOfApartmentsForSaleUnRegistered:
        +numOfApartmentsForSaleUnRegistered[0].count,
      top30PriceHousesForSale, // 2.d) - 2
      top30PriceApartmentsForSale,
      top100SizeHouses: top100SizeHouses.rows, // 2.e) - 2
      top100SizeApartments: top100SizeApartments.rows,
      constructionYearHousesRent, // 2)f - 4
      constructionYearHousesSale,
      constructionYearApartmentsRent,
      constructionYearApartmentsSale,
      top30NumOfRoomsHouses: top30NumOfRoomsHouses.rows, // 2)g1 - 2
      top30NumOfRoomsApartments: top30NumOfRoomsApartments.rows,
      top30SizeApartments: top30SizeApartments.rows, // 2)g2 - 1
      top30LandSizeHouses: top30LandSizeHouses.rows, // 2)g3 - 1},
    },
  };
  // const inter = Inter({ subsets: ["latin"] });
};
export default function Task2({
  numOfPropertiesForRent,
  numOfPropertiesForSale,
  numOfHousesForRent, // 2.a) - 4 queries
  numOfHousesForSale,
  numOfApartmentsForRent,
  numOfApartmentsForSale,
  numOfHousesForSaleCity, // 2.b) - 2
  numOfApartmentsForSaleCity,
  numOfHousesForRentRegistered, // 2.c) - 8
  numOfHousesForSaleRegistered,
  numOfHousesForRentUnRegistered,
  numOfHousesForSaleUnRegistered,
  numOfApartmentsForRentRegistered,
  numOfApartmentsForSaleRegistered,
  numOfApartmentsForRentUnRegistered,
  numOfApartmentsForSaleUnRegistered,
  top30PriceHousesForSale, // 2.d) - 2
  top30PriceApartmentsForSale,
  top100SizeHouses, // 2.e) - 2
  top100SizeApartments,
  constructionYearHousesRent, // 2)f - 4
  constructionYearHousesSale,
  constructionYearApartmentsRent,
  constructionYearApartmentsSale,
  top30NumOfRoomsHouses, // 2)g1 - 2
  top30NumOfRoomsApartments,
  top30SizeApartments, // 2)g2 - 1
  top30LandSizeHouses, // 2)g3 - 1},
}: // data,

InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        {/* <Task2 data={data} numOfRentedProperties={0} /> */}
        {/* {numOfPropertiesForRent}
        <br />
        {numOfPropertiesForSale} */}
        <div className="flex flex-col items-center gap-10 mt-10 px-10 mx-20">
          {/* // -------------------------- 2.a) -------------------------- */}
          <Card
            title="Task 2a)"
            data={
              <>
                <div> numOfPropertiesForRent: {numOfPropertiesForRent}</div>
                <div> numOfPropertiesForSale: {numOfPropertiesForSale}</div>
              </>
            }
          />

          {/* // -------------------------- 2.b) -------------------------- */}
          <Card
            title="Task 2b)"
            data={
              <>
                <div className=" overflow-y-auto max-w-xs max-h-96">
                  <table className="table table-xs table-zebra table-pin-rows table-pin-cols">
                    <thead>
                      <tr>
                        <th></th>
                        <td>City</td>
                        <td>Count</td>
                      </tr>
                    </thead>
                    <tbody>
                      {numOfHousesForSaleCity.map((row, i) => (
                        <>
                          <tr>
                            <th>{i}</th>
                            <td>{row.city}</td>
                            <td>{row.count}</td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            }
          />
          {/* // -------------------------- 2.c) -------------------------- */}
          <Card
            title="Task 2c)"
            data={
              <>
                <div className="text-2xl"> Houses:</div>
                <div>
                  registered:
                  {numOfHousesForRentRegistered + numOfHousesForSaleRegistered}
                </div>
                <div>
                  unregistered:
                  {numOfHousesForRentUnRegistered +
                    numOfHousesForSaleUnRegistered}
                </div>
                <div>
                  undefined registered:
                  {numOfHousesForRent +
                    numOfHousesForSale -
                    numOfHousesForRentUnRegistered -
                    numOfHousesForSaleUnRegistered}
                </div>
                <div className="text-2xl">Apartments:</div>
                <div>
                  registered:
                  {numOfApartmentsForRentRegistered +
                    numOfApartmentsForSaleRegistered}
                </div>
                <div>
                  unregistered:
                  {numOfApartmentsForRentUnRegistered +
                    numOfApartmentsForSaleUnRegistered}
                </div>
                <div>
                  undefined registered:
                  {numOfApartmentsForRent +
                    numOfApartmentsForSale -
                    numOfApartmentsForRentRegistered -
                    numOfApartmentsForSaleRegistered}
                </div>
              </>
            }
          />
          {/* // -------------------------- 2.d) -------------------------- */}
          <Card
            title="Task 2d) houses"
            data={<TableHouses data={top30PriceHousesForSale} />}
          />
          <Card
            title="Task 2d) apartments"
            data={<TableApartments data={top30PriceApartmentsForSale} />}
          />

          {/* // -------------------------- 2.e) -------------------------- */}
          <Card
            title="Task 2e) houses"
            data={<TableHouses data={top100SizeHouses} />}
          />
          <Card
            title="Task 2e) apartments"
            data={<TableApartments data={top100SizeApartments} />}
          />

          {/* // -------------------------- 2.f) -------------------------- */}
          <Card
            title="Task 2f) houses rent"
            data={<TableHouses data={constructionYearHousesRent} />}
          />
          <Card
            title="Task 2f) houses sale"
            data={<TableHouses data={constructionYearHousesSale} />}
          />
          <Card
            title="Task 2f) apartments rent"
            data={<TableApartments data={constructionYearApartmentsRent} />}
          />
          <Card
            title="Task 2f) apartments sale"
            data={<TableApartments data={constructionYearApartmentsSale} />}
          />

          {/* // -------------------------- 2.g) -------------------------- */}
          <Card
            title="Task 2g)1 houses"
            data={<TableHouses data={top30NumOfRoomsHouses} />}
          />
          <Card
            title="Task 2g)1 apartments"
            data={<TableApartments data={top30NumOfRoomsApartments} />}
          />
          <Card
            title="Task 2g)2 apartments"
            data={<TableApartments data={top30SizeApartments} />}
          />
          <Card
            title="Task 2g)3 houses"
            data={<TableHouses data={top30LandSizeHouses} />}
          />
        </div>
      </div>
    </main>
  );
}
