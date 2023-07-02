import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { sql, eq, desc, or, and, isNull, gt, lt, inArray } from "drizzle-orm";
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
import { db } from "@/db/drizzle";
import { top5locations } from "@/top5Locations";
import Input from "../components/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import { useContext } from "react";
import { Context } from "@/context";

//todo check if uopste valid
// todo dodaj valid offer polje
// todo sredjivanje podataka, outlieri featur
type Repo = {
  data: ApartmentsForSale[];
};
export const getServerSideProps: GetServerSideProps<Repo> = async () => {
  const cleanup = db
    .update(apartmentsForSale)
    .set({ isOutlier: true })
    .where(
      or(
        gt(apartmentsForSale.size, "1000"),
        lt(apartmentsForSale.size, "15"),
        gt(apartmentsForSale.numOfRooms, "8"),
        lt(apartmentsForSale.numOfRooms, "1"),
        gt(apartmentsForSale.numOfBathrooms, "6"),
        lt(apartmentsForSale.numOfBathrooms, "1"),
        lt(apartmentsForSale.price, "15000")
      )
    );

  await cleanup;

  const loc = ['konjarnik', 'novi beograd', 'mirijevo ii']; // prettier-ignore
  const placeholders = loc.map(() => "?").join(", ");
  // (${placeholders})
  //   const data = await db.execute<ApartmentsForSale>(sql`Select *
  //   from  apartments_for_sale
  //   where valid_offer = true and SPLIT_PART(location, ', ', 2) in (${loc})
  //   limit 10
  // `);
  const locNew = top5locations.map(
    (location) => "beograd, " + location.toLowerCase()
  );
  // console.log(locNew);
  const data = await db
    .select()
    .from(apartmentsForSale)
    .where(
      and(
        eq(apartmentsForSale.validOffer, true),
        inArray(apartmentsForSale.location, locNew)
        // sql.raw(`split_part(location, ', ', 2) in (${loc})`)
      )
    );

  return { props: { data: data } };
};
const Task4 = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { location } = useContext(Context);
  // data cleanup, outliers

  // u top pet opstina23643
  console.log(data[0]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex flex-col items-center gap-10">
        <Link href={"/"} className="btn">
          Go to home
        </Link>
        {location}
      </div>
    </main>
  );
};

export default Task4;
