import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { sql, eq, desc, or, and, isNull, gt, lt, inArray } from "drizzle-orm";
import {
  apartmentsForSale,
  ApartmentsForSale,
} from "@/db/schema/apartmentsForSale";

import Link from "next/link";
import { db } from "@/db/drizzle";
import Input from "../components/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import { Context } from "@/context";
import { top5locations } from "@/top5Locations";
import { Theta } from "@/db/schema/theta";
// import { Row,  } from "@/arrangeData";
import { Row, deNormalize, getAndArrangeData } from "@/arrangeData";

type Repo = {
  avg: any[];
};
export const getServerSideProps: GetServerSideProps<Repo> = async () => {
  const locNew = top5locations.map(
    (location: string) => "beograd, " + location.toLowerCase()
  );
  const data: any[] = await db
    .select({
      avgBath: sql<number>`avg(num_of_bathrooms)`,
      avgYear: sql<number>`avg(year_of_construction)`,
      minPrice: sql<number>`min(price)`,
      maxPrice: sql<number>`max(price)`,
      minSize: sql<number>`min(size)`,
      maxSize: sql<number>`max(size)`,
      minRooms: sql<number>`min(num_of_rooms)`,
      maxRooms: sql<number>`max(num_of_rooms)`,
      minBath: sql<number>`min(num_of_bathrooms)`,
      maxBath: sql<number>`max(num_of_bathrooms)`,
      minYear: sql<number>`min(year_of_construction)`,
      maxYear: sql<number>`max(year_of_construction)`,
    })
    .from(apartmentsForSale)
    .where(
      and(
        eq(apartmentsForSale.isOutlier, false),
        inArray(apartmentsForSale.location, locNew)
      )
    );

  return { props: { avg: data } };
};
const Task4 = ({
  avg,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const props = useContext(Context);

  const arrange = async (theta: Theta[]) => {
    const tmpData = await getAndArrangeData(props, avg);
    console.log("tmpData", props, theta[0], tmpData);
    const pred =
      +(theta[0].thetaZero ?? 0) +
      +(theta[0].size ?? 0) * tmpData["size"] +
      +(theta[0].location ?? 0) * tmpData["location"] +
      +(theta[0].yearOfConstruction ?? 0) * tmpData["yearOfConstruction"] +
      +(theta[0].floor ?? 0) * tmpData["floor"] +
      +(theta[0].numOfBathrooms ?? 0) * tmpData["numOfBathrooms"] +
      +(theta[0].numOfRooms ?? 0) * tmpData["numOfRooms"] +
      +(theta[0].registered ?? 0) * tmpData["registered"] +
      +(theta[0].elevator ?? 0) * tmpData["elevator"] +
      +(theta[0].terrace ?? 0) * tmpData["terrace"] +
      +(theta[0].parking ?? 0) * tmpData["parking"] +
      +(theta[0].garage ?? 0) * tmpData["garage"];

    const denormPrediction = deNormalize(
      pred,
      +avg[0].minPrice,
      +avg[0].maxPrice
    );
    setPrediction(denormPrediction);
  };

  const [data, setData] = useState<Theta[]>([]);
  const [dataArranged, setDataArranged] = useState<Row>();
  const [prediction, setPrediction] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getTheta"); // Replace with your actual endpoint URL
        const result = await response.json();
        setData(result.data);

        //
        await arrange(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex flex-col items-center gap-10">
        <Link href={"/"} className="btn">
          Go to home
        </Link>
        {/* {data[0]?.thetaZero}-{dataArranged?.size} */}
        -- {prediction}
      </div>
    </main>
  );
};

export default Task4;
