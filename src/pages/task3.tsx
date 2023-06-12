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
import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
} from "recharts";

type LocationCount = {
  location: string;
  count: number;
};
type Repo = {
  top10PartsOfBelgrade: LocationCount[];
};

export const getServerSideProps: GetServerSideProps<Repo> = async () => {
  const [top10PartsOfBelgrade] = await Promise.all([
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
  ]);
  return {
    props: {
      top10PartsOfBelgrade,
      //   numOfPropertiesForRent,
    },
  };
};
export default function Task3({
  top10PartsOfBelgrade,
}: //   top10PartsOfBelgrade,
InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 `}
    >
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        Hello
        {top10PartsOfBelgrade[0].location}
        {/* <BarChart
          width={500}
          height={300}
          data={top10PartsOfBelgrade}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="location" hide />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" barSize={20} fill="#8884d8" />
        </BarChart> */}
        {/* //// */}
        <ComposedChart
          layout="vertical"
          width={500}
          height={600}
          data={top10PartsOfBelgrade}
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
          {/* <Area dataKey="amt" fill="#8884d8" stroke="#8884d8" /> */}
          <Bar dataKey="count" barSize={20} fill="#8884d8" />
          {/* <Line dataKey="uv" stroke="#ff7300" /> */}
        </ComposedChart>
      </div>
    </main>
  );
}
