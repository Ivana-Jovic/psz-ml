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
import Card from "@/components/card";
import TableApartments from "@/components/tableApartments";
import TableHouses from "@/components/tableHouses";
import Link from "next/link";

//TODO: provera osnovnih polja ili isOk polja za svaki upit- uradjenosamo za 2a)

type CountCity = {
  count: number;
  city: string | null;
};

export type Houses = {
  id: number;
  url: string;
  title: string;
  price: number;
  size: number;
  location: string;
  city: string;
  year_of_construction: number;
  land_surface: number;
  total_floors: number;
  num_of_bathrooms: number;
  num_of_rooms: number;
  registered: boolean;
  elevator: boolean;
  terrace: boolean;
  parking: boolean;
  garage: boolean;
};

export type Apartments = {
  id: number;
  url: string;
  title: string;
  price: number;
  size: number;
  location: string;
  city: string;
  year_of_construction: number;
  floor: number;
  total_floors: number;
  num_of_bathrooms: number;
  num_of_rooms: number;
  registered: boolean;
  elevator: boolean;
  terrace: boolean;
  parking: boolean;
  garage: boolean;
};

type Repo = {
  numOfPropertiesForRent: number;
  numOfPropertiesForSale: number;
  numOfHousesForRent: number; // 2.a) - 4 queries
  numOfHousesForSale: number;
  numOfApartmentsForRent: number;
  numOfApartmentsForSale: number;
  numOfPropertiesForSaleCity: CountCity[]; // 2.b) - 1
  numOfHousesForRentRegistered: number; // 2.c) - 4
  numOfHousesForSaleRegistered: number;
  numOfApartmentsForRentRegistered: number;
  numOfApartmentsForSaleRegistered: number;
  top30PriceHousesForSale: HousesForSale[]; // 2.d) - 2
  top30PriceApartmentsForSale: ApartmentsForSale[];
  top100SizeHouses: Houses[]; // 2.e) - 2
  top100SizeApartments: Apartments[];
  constructionYearHousesRent: HousesForRent[]; // 2)f - 4
  constructionYearHousesSale: HousesForSale[];
  constructionYearApartmentsRent: ApartmentsForRent[];
  constructionYearApartmentsSale: ApartmentsForSale[];
  top30NumOfRoomsHouses: Houses[]; // 2)g1 - 2
  top30NumOfRoomsApartments: Apartments[];
  top30SizeApartments: Apartments[]; // 2)g2 - 1
  top30LandSizeHouses: Houses[];
};

export const getServerSideProps: GetServerSideProps<Repo> = async () => {
  const pool = new Pool({ connectionString: process.env.DB_CONNECTION });
  const db = drizzle(pool);
  // Redosled:
  // houses apartments
  // rent sale
  const [
    numOfHousesForRent, // 2.a) - 4 queries
    numOfHousesForSale,
    numOfApartmentsForRent,
    numOfApartmentsForSale,
    numOfPropertiesForSaleCity, // 2.b) - 1
    numOfHousesForRentRegistered, // 2.c) - 8
    numOfHousesForSaleRegistered,
    numOfApartmentsForRentRegistered,
    numOfApartmentsForSaleRegistered,
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
  ] = await Promise.all([
    // -------------------------- 2.a) --------------------------
    // 2.a) izlistati koliki je broj nekretnina za prodaju, a koliki je broj koji se iznajmljuju;
    db
      .select({ count: sql<number>`count(*)` })
      .from(housesForRent)
      .where(eq(housesForRent.validOffer, true)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(housesForSale)
      .where(eq(housesForSale.validOffer, true)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(apartmentsForRent)
      .where(eq(apartmentsForRent.validOffer, true)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(apartmentsForSale)
      .where(eq(apartmentsForSale.validOffer, true)),

    // -------------------------- 2.b) --------------------------
    // 2.b) izlistati koliko nekretnina se prodaje u svakom od gradova
    db.execute<CountCity>(sql`Select sale.city, count(*)
    from (
      select h.id, h.city from houses_for_sale as h where h.valid_offer is true
      union
      select a.id, a.city from apartments_for_sale as a where a.valid_offer is true
    ) as sale 
    group by sale.city
    order by count desc
  `),

    // -------------------------- 2.c) --------------------------
    // 2.c) izlistati koliko je uknjiženih, a koliko neuknjiženih kuća, a koliko stanova
    // registered can be undefined
    // houses
    db
      .select({ count: sql<number>`count(*)` })
      .from(housesForRent)
      .where(
        and(
          eq(housesForRent.registered, true),
          eq(housesForRent.validOffer, true)
        )
      ),
    db
      .select({ count: sql<number>`count(*)` })
      .from(housesForSale)
      .where(
        and(
          eq(housesForSale.registered, true),
          eq(housesForSale.validOffer, true)
        )
      ),
    //apartments
    db
      .select({ count: sql<number>`count(*)` })
      .from(apartmentsForRent)
      .where(
        and(
          eq(apartmentsForRent.registered, true),
          eq(apartmentsForRent.validOffer, true)
        )
      ),
    db
      .select({ count: sql<number>`count(*)` })
      .from(apartmentsForSale)
      .where(
        and(
          eq(apartmentsForSale.registered, true),
          eq(apartmentsForSale.validOffer, true)
        )
      ),

    // -------------------------- 2.d) --------------------------
    //2.d) prikazati rang listu prvih 30 najskupljih kuća koje se prodaju, i 30 najskupljih stanova koji se prodaju u Srbiji;
    db
      .select()
      .from(housesForSale)
      .where(eq(housesForSale.validOffer, true))
      .orderBy(desc(housesForSale.price))
      .limit(30),
    db
      .select()
      .from(apartmentsForSale)
      .where(eq(apartmentsForSale.validOffer, true))
      .orderBy(desc(apartmentsForSale.price))
      .limit(30),

    // -------------------------- 2.e) --------------------------
    //2.e) prikazati rang listu prvih 100 najvećih kuća i 100 najvećih stanova po površini (kvadraturi)
    db.execute<Houses>(sql`Select *
      from (
        select * from houses_for_sale where valid_offer = true
        union
        select * from houses_for_rent where valid_offer = true
      ) as houses
      order by size desc
      limit 100
    `),
    db.execute<Apartments>(sql`Select *
        from (
          select * from apartments_for_sale where valid_offer = true
          union
          select * from apartments_for_rent where valid_offer = true
        ) as apartments
        order by size desc
        limit 100
    `),

    // -------------------------- 2.f) --------------------------
    //2.f) prikazati rang listu svih nekretnina izgrađenih u 2022. ili 2023. godini, i izlistati ih opadajuće prema ceni prodaje, odnosno ceni iznajmljivanja;
    db
      .select()
      .from(housesForRent)
      .where(
        and(
          or(
            eq(housesForRent.yearOfConstruction, 2022),
            eq(housesForRent.yearOfConstruction, 2023)
          ),
          eq(housesForRent.validOffer, true)
        )
      )
      .orderBy(desc(housesForRent.price)),
    db
      .select()
      .from(housesForSale)
      .where(
        and(
          or(
            eq(housesForSale.yearOfConstruction, 2022),
            eq(housesForSale.yearOfConstruction, 2023)
          ),
          eq(housesForSale.validOffer, true)
        )
      )
      .orderBy(desc(housesForSale.price)),
    //apartments
    db
      .select()
      .from(apartmentsForRent)
      .where(
        and(
          or(
            eq(apartmentsForRent.yearOfConstruction, 2022),
            eq(apartmentsForRent.yearOfConstruction, 2023)
          ),
          eq(apartmentsForRent.validOffer, true)
        )
      )
      .orderBy(desc(apartmentsForRent.price)),
    db
      .select()
      .from(apartmentsForSale)
      .where(
        and(
          or(
            eq(apartmentsForSale.yearOfConstruction, 2022),
            eq(apartmentsForSale.yearOfConstruction, 2023)
          ),
          eq(apartmentsForSale.validOffer, true)
        )
      )
      .orderBy(desc(apartmentsForSale.price)),

    // -------------------------- 2.g) --------------------------
    //2.g) prikazati nekretnine (Top30) koje imaju:
    // ▪ najveći broj soba unutar nekretnine,
    //TODO: vidi i n a drugim mestima da li dodati is not null
    db.execute<Houses>(sql`Select *
      from (
        select * from houses_for_sale where valid_offer = true
        union
        select * from houses_for_rent where valid_offer = true
      ) as houses
      where num_of_rooms is not NULL
      order by num_of_rooms desc
      limit 30
    `),
    db.execute<Apartments>(sql`Select *
      from (
        select * from apartments_for_sale where valid_offer = true
        union
        select * from apartments_for_rent where valid_offer = true
      ) as apartments
      where num_of_rooms is not NULL
      order by num_of_rooms desc
      limit 30
    `),

    // ▪ najveću kvadraturu (samo za stanove),
    db.execute<Apartments>(sql`Select *
    from (
      select * from apartments_for_sale where valid_offer = true
      union
      select * from apartments_for_rent where valid_offer = true
    ) as apartments
    where size is not NULL
    order by size desc
    limit 30
  `),
    // ▪ najveću površinu zemljišta (samo za kuće)
    db.execute<Houses>(sql`Select *
    from (
      select * from houses_for_sale where valid_offer = true
      union
      select * from houses_for_rent where valid_offer = true
    ) as houses
    where land_surface is not NULL
    order by land_surface desc
    limit 30
  `),
  ]);

  const numOfPropertiesForRent: number =
    +numOfHousesForRent[0].count + +numOfApartmentsForRent[0].count;
  const numOfPropertiesForSale: number =
    +numOfHousesForSale[0].count + +numOfApartmentsForSale[0].count;

  return {
    props: {
      numOfPropertiesForRent,
      numOfPropertiesForSale,
      numOfHousesForRent: +numOfHousesForRent[0].count, // 2.a) - 4 queries
      numOfHousesForSale: +numOfHousesForSale[0].count,
      numOfApartmentsForRent: +numOfApartmentsForRent[0].count,
      numOfApartmentsForSale: +numOfApartmentsForSale[0].count,
      numOfPropertiesForSaleCity: numOfPropertiesForSaleCity.rows, // 2.b) - 1
      numOfHousesForRentRegistered: +numOfHousesForRentRegistered[0].count, // 2.c) - 4
      numOfHousesForSaleRegistered: +numOfHousesForSaleRegistered[0].count,
      numOfApartmentsForRentRegistered:
        +numOfApartmentsForRentRegistered[0].count,
      numOfApartmentsForSaleRegistered:
        +numOfApartmentsForSaleRegistered[0].count,
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
};
export default function Task2({
  numOfPropertiesForRent,
  numOfPropertiesForSale,
  numOfHousesForRent, // 2.a) - 4 queries
  numOfHousesForSale,
  numOfApartmentsForRent,
  numOfApartmentsForSale,
  numOfPropertiesForSaleCity, // 2.b) - 1
  numOfHousesForRentRegistered, // 2.c) - 4
  numOfHousesForSaleRegistered,
  numOfApartmentsForRentRegistered,
  numOfApartmentsForSaleRegistered,
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
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="flex flex-col items-center gap-10 mt-10 px-10 mx-20">
          <Link href={"/task3"} className="btn">
            Go to task3
          </Link>
          {/* // -------------------------- 2.a) -------------------------- */}
          <Card
            title="Task 2a)"
            data={
              <>
                <div>
                  Number of properties for rent: {numOfPropertiesForRent}
                </div>
                <div>
                  Number of properties for sale: {numOfPropertiesForSale}
                </div>
              </>
            }
          />

          {/* // -------------------------- 2.b) -------------------------- */}
          <Card
            title="Task 2b) - koliko nekretnina se prodaje u svakom od gradova"
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
                      {numOfPropertiesForSaleCity?.map((row, i) => (
                        <tr key={row.city}>
                          <th>{i}</th>
                          <td>{row.city}</td>
                          <td>{row.count}</td>
                        </tr>
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
                  {numOfHousesForRent +
                    numOfHousesForSale -
                    numOfHousesForRentRegistered -
                    numOfHousesForSaleRegistered}
                </div>
                <div className="text-2xl">Apartments:</div>
                <div>
                  registered:
                  {numOfApartmentsForRentRegistered +
                    numOfApartmentsForSaleRegistered}
                </div>
                <div>
                  unregistered:
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
            title="Task 2d) houses - top 30 najskupljih kuća koje se prodaju"
            data={<TableHouses data={top30PriceHousesForSale} />}
          />
          <Card
            title="Task 2d) apartments -  30 najskupljih stanova koje se prodaju"
            data={<TableApartments data={top30PriceApartmentsForSale} />}
          />

          {/* // -------------------------- 2.e) -------------------------- */}
          <Card
            title="Task 2e) houses - top 100 najvećih kuća po površini"
            data={<TableHouses data={top100SizeHouses} />}
          />
          <Card
            title="Task 2e) apartments - top 100 najvećih stanova po površini"
            data={<TableApartments data={top100SizeApartments} />}
          />

          {/* // -------------------------- 2.f) -------------------------- */}
          <Card
            title="Task 2f) houses rent - izgrađenih u 2022. ili 2023. godini, i izlistati ih 
            opadajuće prema ceni"
            data={<TableHouses data={constructionYearHousesRent} />}
          />
          <Card
            title="Task 2f) houses sale - izgrađenih u 2022. ili 2023. godini, i izlistati ih 
            opadajuće prema ceni"
            data={<TableHouses data={constructionYearHousesSale} />}
          />
          <Card
            title="Task 2f) apartments rent - izgrađenih u 2022. ili 2023. godini, i izlistati ih 
            opadajuće prema ceni"
            data={<TableApartments data={constructionYearApartmentsRent} />}
          />
          <Card
            title="Task 2f) apartments sale - izgrađenih u 2022. ili 2023. godini, i izlistati ih 
            opadajuće prema ceni"
            data={<TableApartments data={constructionYearApartmentsSale} />}
          />

          {/* // -------------------------- 2.g) -------------------------- */}
          <Card
            title="Task 2g)1 houses - top 30: najveći broj soba"
            data={<TableHouses data={top30NumOfRoomsHouses} />}
          />
          <Card
            title="Task 2g)1 apartments - top 30:  najveći broj soba"
            data={<TableApartments data={top30NumOfRoomsApartments} />}
          />
          <Card
            title="Task 2g)2 apartments - top 30: najveću kvadraturu"
            data={<TableApartments data={top30SizeApartments} />}
          />
          <Card
            title="Task 2g)3 houses - top 30: najveću površinu zemljišta"
            data={<TableHouses data={top30LandSizeHouses} />}
          />
        </div>
      </div>
    </main>
  );
}
