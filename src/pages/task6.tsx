import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { sql, eq, desc, or, and, isNull, gt, lt, inArray } from "drizzle-orm";
import {
  apartmentsForSale,
  ApartmentsForSale,
} from "@/db/schema/apartmentsForSale";
import Link from "next/link";
import { db } from "@/db/drizzle";
import { useContext, useEffect, useState } from "react";
import { Context, ContextType } from "@/context";
import { top5locations } from "@/top5Locations";
import {
  Row,
  boolToNumber,
  deNormalize,
  getAndArrangeData,
  normalize,
  normalizeLocation,
} from "@/arrangeData";
import { distances } from "@/distances";
import { euclideanDistance, floorTmp } from "./task5";

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

class Cluster {
  centroid: RowWithPrice;
  points: RowWithPrice[];

  constructor(centroid: RowWithPrice) {
    this.centroid = centroid;
    this.points = [];
  }

  clear(): void {
    this.points = [];
  }

  addPoint(point: RowWithPrice): void {
    this.points.push(point);
  }

  calculateCentroid(): void {
    if (this.points.length === 0) {
      return;
    }

    // let sumX = 0;
    // let sumY = 0;

    // for (const point of this.points) {
    //   sumX += point.x;
    //   sumY += point.y;
    // }
    let sumFields: RowWithPrice = {
      size: 0,
      location: 0,
      price: 0,
      yearOfConstruction: 0,
      floor: 0,
      numOfBathrooms: 0,
      numOfRooms: 0,
      registered: 0,
      elevator: 0,
      terrace: 0,
      parking: 0,
      garage: 0,
    };

    this.points.forEach((point) => {
      sumFields.size += point.size;
      sumFields.location += point.location;
      sumFields.price += point.price;
      sumFields.yearOfConstruction += point.yearOfConstruction;
      sumFields.floor += point.floor;
      sumFields.numOfBathrooms += point.numOfBathrooms;
      sumFields.numOfRooms += point.numOfRooms;
      sumFields.registered += point.registered;
      sumFields.elevator += point.elevator;
      sumFields.terrace += point.terrace;
      sumFields.parking += point.parking;
      sumFields.garage += point.garage;
    });

    this.centroid = {
      size: sumFields.size / this.points.length,
      location: sumFields.location / this.points.length,
      price: sumFields.price / this.points.length,
      yearOfConstruction: sumFields.yearOfConstruction / this.points.length,
      floor: sumFields.floor / this.points.length,
      numOfBathrooms: sumFields.numOfBathrooms / this.points.length,
      numOfRooms: sumFields.numOfRooms / this.points.length,
      registered: sumFields.registered / this.points.length,
      elevator: sumFields.elevator / this.points.length,
      terrace: sumFields.terrace / this.points.length,
      parking: sumFields.parking / this.points.length,
      garage: sumFields.garage / this.points.length,
    };
  }
}

const dataTransform = async (
  allData: ApartmentsForSale[],
  testData: ContextType,
  avgg: any[],
  k: number,
  isEuklidian?: boolean
): Promise<[RowWithPrice[], Row]> => {
  // normalize table
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

  return [newData, tmpData];
};

function areCentroidsEqual(
  centroid1: RowWithPrice,
  centroid2: RowWithPrice
): boolean {
  // if (centroid1.length !== centroid2.length) {
  //   return false;
  // }

  // for (let i = 0; i < centroid1.length; i++) {
  //   if (centroid1[i] !== centroid2[i]) {
  //     return false;
  //   }
  // }
  if (
    centroid1.price === centroid2.price &&
    centroid1.size === centroid2.size &&
    centroid1.location === centroid2.location &&
    centroid1.floor === centroid2.floor &&
    centroid1.numOfBathrooms === centroid2.numOfBathrooms &&
    centroid1.numOfRooms === centroid2.numOfRooms &&
    centroid1.registered === centroid2.registered &&
    centroid1.elevator === centroid2.elevator &&
    centroid1.terrace === centroid2.terrace &&
    centroid1.parking === centroid2.parking &&
    centroid1.garage === centroid2.garage &&
    centroid1.yearOfConstruction === centroid2.yearOfConstruction
  )
    return true;
  else return false;
}

const kMeans = async (
  allData: ApartmentsForSale[],
  testData: ContextType,
  avgg: any[],
  k: number,
  isEuklidian?: boolean
) => {
  const maxIterations = 40;

  const [newData, tmpData] = await dataTransform(
    allData,
    testData,
    avgg,
    k,
    isEuklidian
  );
  const kk = k === 0 ? Math.sqrt(newData.length) : k;
  // const knn = getKNearestNeighbors(newData, tmpData, kk, isEuklidian);

  // Initialize clusters with random centroids
  const clusters: Cluster[] = [];
  for (let i = 0; i < kk; i++) {
    const randomIndex = Math.floor(Math.random() * newData.length);
    const randomPoint = newData[randomIndex];
    const cluster = new Cluster(randomPoint);
    // console.log("clusters.push(cluster)", randomIndex, randomPoint, cluster);
    clusters.push(cluster);
  }

  let iterations = 0;

  while (iterations < maxIterations) {
    // Clear points from previous iteration
    for (const cluster of clusters) {
      cluster.clear();
    }

    // Assign each point to the nearest cluster
    for (const point of newData) {
      let minDistance = Infinity;
      let nearestCluster: Cluster | undefined;

      for (const cluster of clusters) {
        const distance = euclideanDistance(point, cluster.centroid);
        if (distance < minDistance) {
          minDistance = distance;
          nearestCluster = cluster;
        }
      }

      if (nearestCluster) {
        nearestCluster.addPoint(point);
      }
    }
    ///
    const old = new Array(...clusters);
    ///
    // Update centroids of each cluster
    for (const cluster of clusters) {
      if (iterations > 1 && cluster.points.length === 0) {
        const randomIndex = Math.floor(Math.random() * newData.length);
        cluster.centroid = newData[randomIndex];
        console.log("NEW CENTROID");
      } else cluster.calculateCentroid();
    }
    // console.log("clusters", clusters);
    iterations++;
    ////
    // const converged = newCentroids.every((centroid, index) =>
    // centroid.every(
    //   (feature, innerIndex) =>
    //     Math.abs(feature - (this.centroids?.[index][innerIndex] ?? 0)) <
    //     0.0001
    // )
    // )
    // if (iterations > 1) {
    //   if (
    //     clusters.every(
    //       (element, index) =>
    //         areCentroidsEqual(element.centroid, old[index].centroid)

    //       // clusters.every(
    //       //   (element, index) =>
    //       //     JSON.stringify(element.centroid) ===
    //       //     JSON.stringify(old[index].centroid)
    //     )
    //   ) {
    //     console.log("Konvergira", iterations);
    //     break;
    //   }
    // }
  }
  ////

  // const distinctCentroids = new Set<RowWithPrice>();

  // // Iterate over the data array and add centroid values to the Set
  // clusters.forEach((obj) => {
  //   distinctCentroids.add(obj.centroid);
  // });

  // let closestCentroid: RowWithPrice | null =
  //   clusters && clusters.length > 0 ? clusters[0].centroid : null;
  // let minDistance = Infinity;

  // distinctCentroids.forEach((centroid) => {
  //   // console.log(centroid);
  //   const distance = euclideanDistance(centroid, tmpData);
  //   if (distance < minDistance) {
  //     minDistance = distance;
  //     closestCentroid = centroid;
  //   }
  // });

  // const prediction = closestCentroid?.price ?? 0;
  // const denromalizedPrd = deNormalize(
  //   prediction,
  //   +avgg[0].minPrice,
  //   +avgg[0].maxPrice
  // );
  ///
  // return clusters;
  console.log(clusters.map((cluster) => cluster.points.length));
  clusters.forEach((cluster, i) => {
    // console.log("cluster", i, cluster.centroid, cluster.points.length);
  });
  return clusters;
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
const Task6 = ({
  avg,
  allData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const props = useContext(Context);
  console.log("context", props);

  const [prediction, setPrediction] = useState<number>(0);
  const [kValue, setKValue] = useState<number>(0);
  const [isEuklidianValue, setIsEuklidianValue] = useState<boolean>(true);

  const k = () => {
    kMeans(allData, props, avg, kValue, isEuklidianValue).then(
      (res) => {
        return;
      }
      // setPrediction(res)
    );
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex flex-col items-center gap-10">
        <Link href={"/"} className="btn">
          Go to home
        </Link>
        {prediction.toFixed(0)}&nbsp;RSD
        {/* {prediction === 0 && <div> less than 100 000 RSD</div>}
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
        </div> */}
        {/* -{kValue}-{isEuklidianValue ? "true" : "false"} */}
        <button className="btn mt-5" onClick={k}>
          Start K means
        </button>
      </div>
    </main>
  );
};

export default Task6;
