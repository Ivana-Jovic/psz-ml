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
import { Context, ContextType } from "@/context";
import { top5locations } from "@/top5Locations";
import { Theta } from "@/db/schema/theta";
import {
  boolToNumber,
  deNormalize,
  getAndArrangeData,
  normalize,
  normalizeLocation,
} from "@/arrangeData";
import { distances } from "@/distances";

export type RangeCount = {
  range: string;
  count: number;
};

export type RowWithPrice = {
  [x: string]: number;
  price: number;
  size: number;
  location: number;
  yearOfConstruction: number;
  floor: number;
  numOfBathrooms: number;
  numOfRooms: number;
  registered: number;
  elevator: number;
  terrace: number;
  parking: number;
  garage: number;
};

function euclideanDistance(
  point1: RowWithPrice,
  point2: Omit<RowWithPrice, "price">
): number {
  if (point1.length !== point2.length) {
    throw new Error("Points have different dimensions");
  }

  let sum = 0;
  sum += Math.pow(point1["size"] - point2["size"], 2);
  sum += Math.pow(point1["location"] - point2["location"], 2);
  sum += Math.pow(
    point1["yearOfConstruction"] - point2["yearOfConstruction"],
    2
  );
  sum += Math.pow(point1["floor"] - point2["floor"], 2);
  sum += Math.pow(point1["numOfBathrooms"] - point2["numOfBathrooms"], 2);
  sum += Math.pow(point1["numOfRooms"] - point2["numOfRooms"], 2);
  sum += Math.pow(point1["registered"] - point2["registered"], 2);
  sum += Math.pow(point1["elevator"] - point2["elevator"], 2);
  sum += Math.pow(point1["terrace"] - point2["terrace"], 2);
  sum += Math.pow(point1["parking"] - point2["parking"], 2);
  sum += Math.pow(point1["garage"] - point2["garage"], 2);
  // console.log(" Math.sqrt(sum)", Math.sqrt(sum));
  return Math.sqrt(sum);
}

function manhattanDistance(
  point1: RowWithPrice,
  point2: Omit<RowWithPrice, "price">
): number {
  let sum = 0;
  sum += Math.abs(point1["size"] - point2["size"]);
  sum += Math.abs(point1["location"] - point2["location"]);
  sum += Math.abs(point1["yearOfConstruction"] - point2["yearOfConstruction"]);
  sum += Math.abs(point1["floor"] - point2["floor"]);
  sum += Math.abs(point1["numOfBathrooms"] - point2["numOfBathrooms"]);
  sum += Math.abs(point1["numOfRooms"] - point2["numOfRooms"]);
  sum += Math.abs(point1["registered"] - point2["registered"]);
  sum += Math.abs(point1["elevator"] - point2["elevator"]);
  sum += Math.abs(point1["terrace"] - point2["terrace"]);
  sum += Math.abs(point1["parking"] - point2["parking"]);
  sum += Math.abs(point1["garage"] - point2["garage"]);
  return sum;
}

export function getKNearestNeighbors(
  data: RowWithPrice[],
  queryPoint: Omit<RowWithPrice, "price">,
  k: number,
  isEuklidian?: boolean
) {
  const distances = data.map((row) => ({
    point: row,
    distance: isEuklidian
      ? euclideanDistance(row, queryPoint)
      : manhattanDistance(row, queryPoint),
  }));
  console.log("data.length", data.length);
  distances.sort((a, b) => a.distance - b.distance);

  return distances.slice(0, k).map((distance) => distance.point);
}

const floorTmp = (floor: number | null, totalFloors: number | null) => {
  if (floor && totalFloors) {
    if (floor === 0) return 0;
    if (floor === totalFloors) return 2;
  }
  return 1;
};

const getCategoryPrice = (price: number): number => {
  switch (true) {
    case price < 100000:
      return 0;
    case price < 140000:
      return 1;
    case price < 200000:
      return 2;
    case price < 300000:
      return 3;
    default:
      return 4;
  }
};
function findMostFrequentCategory(data: RowWithPrice[], avg: any[]): number {
  const categoryCounts: Record<number, number> = {}; // Object to store category counts

  // Count the occurrences of each category
  data.forEach((item) => {
    const denormPrice =
      //  item.price;
      deNormalize(item.price, +avg[0].minPrice, +avg[0].maxPrice);
    const category = getCategoryPrice(denormPrice);
    if (categoryCounts[category]) {
      categoryCounts[category] += 1;
    } else {
      categoryCounts[category] = 1;
    }
  });

  // Find the category with the highest count
  let mostFrequentCategory = -1; // Default value for category
  let highestCount = 0;

  for (const category in categoryCounts) {
    if (categoryCounts[category] > highestCount) {
      highestCount = categoryCounts[category];
      mostFrequentCategory = Number(category);
    }
  }

  return mostFrequentCategory;
}

function findAvgPrice(data: RowWithPrice[], avg: any[]): number {
  const total = data.reduce(
    (sum, item) =>
      sum +
      // item.price,
      deNormalize(item.price, +avg[0].minPrice, +avg[0].maxPrice),
    0
  );
  const average = total / data.length;
  return average;
}

export const doKnn = async (
  allData: ApartmentsForSale[],
  testData: ContextType,
  avgg: any[],
  k: number,
  isEuklidian?: boolean
) => {
  // const allDataTmp:Row[]=allData.map((elem)=>{size:elem.size,})
  // sredi i normalizuj
  const data: ApartmentsForSale[] = allData;
  const avg = avgg;
  const newData: RowWithPrice[] = [];

  data.map((row, i) => {
    const size = row.size ? +row.size : 1;
    const locationWithoutCity = row.location?.split(", ")[1];
    // row.location?.toLowerCase();
    const location = locationWithoutCity
      ? distances[locationWithoutCity] ?? 0
      : 0;
    if (i === 0) console.log("i=0", locationWithoutCity, "--", location);
    const price = row.price ? +row.price : 1;
    const bathrooms = row.numOfBathrooms
      ? //   && row.numOfBathrooms !== 0
        +row.numOfBathrooms
      : +avg[0].avgBath;
    const rooms = row.numOfRooms ? +row.numOfRooms : 1;
    const year =
      row.yearOfConstruction && row.yearOfConstruction !== 0
        ? row.yearOfConstruction
        : +avg[0].avgYear;

    const newRow: RowWithPrice = {
      price: normalize(price, avg[0].minPrice, avg[0].maxPrice),
      size: normalize(size, avg[0].minSize, avg[0].maxSize),
      location: normalizeLocation(location),
      floor: floorTmp(row.floor, row.totalFloors),
      numOfBathrooms: normalize(bathrooms, avg[0].minBath, avg[0].maxBath),
      numOfRooms: normalize(rooms, avg[0].minRooms, avg[0].maxRooms),
      registered: boolToNumber(row.registered),
      elevator: boolToNumber(row.elevator),
      terrace: boolToNumber(row.terrace),
      parking: boolToNumber(row.parking),
      garage: boolToNumber(row.garage),
      yearOfConstruction: normalize(year, avg[0].minYear, avg[0].maxYear),
    };

    newData.push(newRow);
  });
  console.log(newData[0]);

  /// normalize inputs
  const tmpData = await getAndArrangeData(testData, avg);
  ////

  const kk = k === 0 ? Math.sqrt(newData.length) : k;
  console.log("USING:", kk, isEuklidian);
  const knn = getKNearestNeighbors(newData, tmpData, kk, isEuklidian);

  console.log("knn", testData, tmpData, knn);
  const fq = findMostFrequentCategory(knn, avgg);
  console.log("findAvgPrice", findAvgPrice(knn, avgg));
  return fq;
};

type Repo = {
  avg: any[];
  allData: ApartmentsForSale[];
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

  const dataAll = await db
    .select()
    .from(apartmentsForSale)
    .where(
      and(
        eq(apartmentsForSale.isOutlier, false),
        inArray(apartmentsForSale.location, locNew)
      )
    );

  return { props: { avg: data, allData: dataAll } };
};
const Task5 = ({
  avg,
  allData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const props = useContext(Context);
  console.log("context", props);

  const [prediction, setPrediction] = useState<number>(0);
  const [kValue, setKValue] = useState<number>(0);
  const [isEuklidianValue, setIsEuklidianValue] = useState<boolean>(true);

  // useEffect(() => {
  //   // const result = doKnn(allData, props, avg).then((res) => setPrediction(res));
  // }, []);

  const k = () => {
    doKnn(allData, props, avg, kValue, isEuklidianValue).then((res) =>
      setPrediction(res)
    );
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex flex-col items-center gap-10">
        <Link href={"/"} className="btn">
          Go to home
        </Link>
        {/* {prediction} */}
        {prediction === 0 && <div> less than 100 000 RSD</div>}
        {prediction === 1 && <div> between 100 000 and 140 000 RSD</div>}
        {prediction === 2 && <div> between 140 000 and 200 000 RSD</div>}
        {prediction === 3 && <div> etween 200 000 and 300 000 RSD</div>}
        {prediction === 4 && <div> greater than 300 000 RSD</div>}
        <div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">K</span>
            </label>
            <input
              className={`input w-full input-bordered`}
              type="number"
              min={1}
              value={kValue}
              onChange={(e) => setKValue(e.target.valueAsNumber)}
            />
          </div>
          <div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">isEuklidian</span>
              </label>
              <input
                type="checkbox"
                className="checkbox"
                defaultChecked={true}
                // value={isEuklidianValue}
                onChange={() => setIsEuklidianValue(!isEuklidianValue)}
              />
            </div>
          </div>
        </div>
        {/* -{kValue}-{isEuklidianValue ? "true" : "false"} */}
        <button className="btn mt-5" onClick={k}>
          Start Knn
        </button>
      </div>
    </main>
  );
};

export default Task5;
