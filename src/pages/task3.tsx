import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
} from "recharts";
import RePieChart from "@/components/pieChart";
import PieChartTask3E from "@/components/pieChartTask3E";
import PieChartTask3F from "@/components/pieChartTask3F";

type LocationCount = {
  location: string;
  count: number;
};

type SizeRangeCount = {
  size_range: string;
  count: number;
};

export type RangeCount = {
  range: string;
  count: number;
};

type CityRentCounSaleCount = {
  city: string;
  sale_count: number;
  rent_count: number;
};

export type LocationRentSaleCount = {
  location: string;
  isRent: boolean;
  count: number;
};
export type GarageCount = {
  count_parking: number;
  total_count: number;
};
type Repo = {
  top10PartsOfBelgradeProperties: LocationCount[];
  sizeRangeApartmentsForSale: SizeRangeCount[];
  yearOfConstrustionRangeProperties: RangeCount[];
  ratioSaleRentPropertiesCount: CityRentCounSaleCount[];
  priceRangePropertiesForSale: RangeCount[];
  garageCountPropertiesforSale: GarageCount[];
};
// todo u task2 treba proveratvati za upite is not null
export const getServerSideProps: GetServerSideProps<Repo> = async () => {
  const [
    top10PartsOfBelgradeProperties,
    sizeRangeApartmentsForSale,
    yearOfConstrustionRangeProperties,
    ratioSaleRentPropertiesCount,
    priceRangePropertiesForSale,
    garageCountPropertiesforSale,
  ] = await Promise.all([
    db.execute<LocationCount>(sql`Select location, count(*) as count
          from (
              select * from houses_for_sale
              union
              select * from houses_for_rent
              union
              select * from apartments_for_rent
              union
              select * from apartments_for_sale
          ) as properties
          where city = 'beograd'and location != 'beograd'
          group by location
          order by count desc
          limit 10
    `),
    db.execute<SizeRangeCount>(sql`
    select 
    case 
      when size <= 35 then '0-35'
      when size <= 50 then '36-50'
      when size <= 65 then '51-65'
      when size <= 80 then '66-80'
      when size <= 95 then '81-95'
      when size <= 110 then '96-110'
      else '111+'
    end as size_range,
    count(*) as count
    from
      apartments_for_sale
    where size is not null
    group by
      size_range
    order by
      size_range
    `),
    // -------------------------- 3.c) --------------------------
    // c) Broj izgrađenih nekretnina po dekadama (1951-1960, 1961-1970, 1971-1980, 1981-1990,
    //   1991-2000, 2001-2010, 2011-2020), a obuhvatiti i sekcije za prodaju i za iznajmljivanje.
    db.execute<RangeCount>(sql`
    select 
    case
      when year_of_construction >= 1951 and year_of_construction <= 1960 then '1951-1960'
      when year_of_construction <= 1970 then '1961-1970'
      when year_of_construction <= 1980 then '1971-1980'
      when year_of_construction <= 1990 then '1981-1990'
      when year_of_construction <= 2000 then '1991-2000'
      when year_of_construction <= 2010 then '2001-2010'
      when year_of_construction <= 2020 then '2011-2020'
      else 'Other'
    end as range,
    count(*) as count
    from (
      select * from houses_for_sale
      union
      select * from houses_for_rent
      union
      select * from apartments_for_rent
      union
      select * from apartments_for_sale
    ) as properties
    where year_of_construction is not null
    group by
      range
    order by
      range
    `),
    // -------------------------- 3.d) --------------------------
    // d) Broj (i procentualni odnos) nekretnina koje se prodaju i nekretnina koje se iznajmljuju, za
    // prvih 5 gradova sa najvećim brojem nekretnina (za svaki grad posebno prikazati grafikon
    //   BROJ_ZA_PRODAJU : BROJ_ZA_IZNAJMLJIVANJE).
    db.execute<CityRentCounSaleCount>(sql`
    with top_cities as (
      select city
      from (
        select * from houses_for_sale
        union
        select * from houses_for_rent
        union
        select * from apartments_for_rent
        union
        select * from apartments_for_sale
      ) as properties
      where city is not null
      group by
        city
      order by count(*) desc
      limit 5
    )
    select sale.city, sale.count as sale_count, rent.count as rent_count
    from (
      select city, count(*)
      from (
        select * from houses_for_sale
        union
        select * from apartments_for_sale
      ) as properties_for_sale
      where city in (select city from top_cities)
      group by
        city
      order by count desc
      limit 5
    ) as sale
    join (
      select city, count(*)
      from (
        select * from houses_for_rent
        union
        select * from apartments_for_rent
      ) as properties_for_sale
      where city in (select city from top_cities)
      group by
        city
      order by count desc
      limit 5
    ) as rent
    on sale.city = rent.city;
    `),
    // -------------------------- 3.e) --------------------------
    // e) Broj (i procentualni odnos) svih nekretnina za prodaju, koje po ceni pripadaju jednom od
    // sledećih opsega:
    // ▪ manje od 49 999 €,
    // ▪ između 50 000 i 99 999 €,
    // ▪ između 100 000 i 149 999 €,
    // ▪ između 150 000 € i 199 999 €,
    // ▪ između 200 000 € i 499 999 €,
    // ▪ 500 000 € ili više.
    db.execute<RangeCount>(sql`
    select 
    case 
      when price <= 49999 then '-49.999'
      when price <= 99999 then '50.000-99.999'
      when price <= 149999 then '100.000-149.999'
      when price <= 199999 then '150.000-199.999'
      when price <= 499999 then '150.000-199.999'
      else '500.000-'
    end as range,
    count(*) as count
    from (
      select * from houses_for_sale
      union
      select * from apartments_for_sale
    ) as properties_for_sale
    where price is not null
    group by
      range
    order by
      range
    `),
    // -------------------------- 3.f) --------------------------
    // f)Broj nekretnina za prodaju koje imaju parking, u odnosu na ukupan broj nekretnina za
    // prodaju (samo za Beograd).

    // db.execute<RangeCount>(sql`
    // select count(*) as count
    // from (
    //   select * from houses_for_sale
    //   union
    //   select * from apartments_for_sale
    // ) as properties_for_sale
    // where city = 'beograd' and (garage = true or parking = true)
    // `),
    db.execute<GarageCount>(sql`
      select 
      count(case when garage = true or parking = true then 1 end) as count_parking,
      count(*) as total_count
      from (
        select * from houses_for_sale
        union
        select * from apartments_for_sale
      ) as properties_for_sale
      where city = 'beograd'
    `),
  ]);
  return {
    props: {
      top10PartsOfBelgradeProperties,
      sizeRangeApartmentsForSale,
      yearOfConstrustionRangeProperties,
      ratioSaleRentPropertiesCount,
      priceRangePropertiesForSale,
      garageCountPropertiesforSale,
    },
  };
};
export default function Task3({
  top10PartsOfBelgradeProperties,
  sizeRangeApartmentsForSale,
  yearOfConstrustionRangeProperties,
  ratioSaleRentPropertiesCount,
  priceRangePropertiesForSale,
  garageCountPropertiesforSale,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const taskD: LocationRentSaleCount[][] = [
    [
      {
        location: ratioSaleRentPropertiesCount[0].city,
        count: +ratioSaleRentPropertiesCount[0].sale_count,
        isRent: false,
      },
      {
        location: ratioSaleRentPropertiesCount[0].city,
        count: +ratioSaleRentPropertiesCount[0].rent_count,
        isRent: true,
      },
    ],
    [
      {
        location: ratioSaleRentPropertiesCount[1].city,
        count: +ratioSaleRentPropertiesCount[1].sale_count,
        isRent: false,
      },
      {
        location: ratioSaleRentPropertiesCount[1].city,
        count: +ratioSaleRentPropertiesCount[1].rent_count,
        isRent: true,
      },
    ],
    [
      {
        location: ratioSaleRentPropertiesCount[2].city,
        count: +ratioSaleRentPropertiesCount[2].sale_count,
        isRent: false,
      },
      {
        location: ratioSaleRentPropertiesCount[2].city,
        count: +ratioSaleRentPropertiesCount[2].rent_count,
        isRent: true,
      },
    ],
    [
      {
        location: ratioSaleRentPropertiesCount[3].city,
        count: +ratioSaleRentPropertiesCount[3].sale_count,
        isRent: false,
      },
      {
        location: ratioSaleRentPropertiesCount[3].city,
        count: +ratioSaleRentPropertiesCount[3].rent_count,
        isRent: true,
      },
    ],
    [
      {
        location: ratioSaleRentPropertiesCount[4].city,
        count: +ratioSaleRentPropertiesCount[4].sale_count,
        isRent: false,
      },
      {
        location: ratioSaleRentPropertiesCount[4].city,
        count: +ratioSaleRentPropertiesCount[4].rent_count,
        isRent: true,
      },
    ],
  ];
  const taskE: RangeCount[] = [
    {
      range: priceRangePropertiesForSale[0].range,
      count: +priceRangePropertiesForSale[0].count,
    },
    {
      range: priceRangePropertiesForSale[1].range,
      count: +priceRangePropertiesForSale[1].count,
    },
    {
      range: priceRangePropertiesForSale[2].range,
      count: +priceRangePropertiesForSale[2].count,
    },
    {
      range: priceRangePropertiesForSale[3].range,
      count: +priceRangePropertiesForSale[3].count,
    },
    {
      range: priceRangePropertiesForSale[4].range,
      count: +priceRangePropertiesForSale[4].count,
    },
  ];
  console.log("JII", garageCountPropertiesforSale[0].count_parking);
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between py-24 px-5`}
    >
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        Hello
        <div className="flex flex-col items-center">
          {/* --------- 3.a) ---------*/}
          <div className="text-5xl mb-10">3.a.</div>
          <ComposedChart
            layout="vertical"
            width={700}
            height={600}
            data={top10PartsOfBelgradeProperties}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 40,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="location" type="category" />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" barSize={20} fill="#8884d8" />
          </ComposedChart>
          {/* --------- 3.b) ---------*/}
          <div className="text-5xl mb-10">3.b.</div>
          <BarChart width={700} height={300} data={sizeRangeApartmentsForSale}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="size_range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" barSize={20} fill="#8884d8" />
          </BarChart>

          {/* --------- 3.c) --------- */}
          <div className="text-5xl mb-10">3.c.</div>
          <BarChart
            width={700}
            height={300}
            data={yearOfConstrustionRangeProperties}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" barSize={20} fill="#8884d8" />
          </BarChart>

          {/* --------- 3.d) ---------*/}
          <div className="text-3xl mb-10">3.d.</div>
          <div className="flex flex-col gap-8">
            {taskD.map((item, i) => (
              <RePieChart key={i} data={item} />
            ))}
          </div>

          {/* --------- 3.e) ---------*/}
          <div className="text-5xl mb-10">3.e.</div>
          <PieChartTask3E data={taskE} />

          {/* --------- 3.f) ---------*/}
          <div className="text-5xl mb-10">3.f.</div>
          <PieChartTask3F
            data={[
              {
                count: +garageCountPropertiesforSale[0].count_parking,
                name: "with parking",
              },
              {
                count: +garageCountPropertiesforSale[0].total_count,
                name: "total",
              },
            ]}
          />
        </div>
      </div>
    </main>
  );
}
