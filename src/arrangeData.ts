// import { sql, eq, desc, or, and, isNull, gt, lt, inArray } from "drizzle-orm";
// import { apartmentsForSale } from "./db/schema/apartmentsForSale";
// import { db } from "./db/drizzle";
// import { top5locations } from "./top5Locations";
// import { distances } from "./distances";
import { ContextType } from "./context";

import { sql, eq, desc, or, and, isNull, gt, lt, inArray } from "drizzle-orm";
import { top5locations } from "./top5Locations";
import { apartmentsForSale } from "./db/schema/apartmentsForSale";
import { distances } from "./distances";

export type Row = {
  [x: string]: number;
  // price: number;
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

export const boolToNumber = (bool: boolean | null) => {
  return bool ? +bool : 0;
};

export const normalize = (val: number, min: number, max: number) => {
  return (val - +min) / (+max - +min);
};

export const deNormalize = (norm: number, min: number, max: number) => {
  return norm * (+max - +min) + +min;
};

export const normalizeLocation = (val: number) => {
  const values = Object.values(distances);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  return normalize(val, minValue, maxValue);
};

export const getAndArrangeData = async (row: ContextType, avg: any[]) => {
  const size = row.size ? +row.size : 1;
  const locationWithoutCity = row.location.toLowerCase();
  const location = locationWithoutCity
    ? distances[locationWithoutCity] ?? 0
    : 0;
  // const price = row.price ? +row.price : 1;
  const bathrooms =
    row.numOfBathrooms && row.numOfBathrooms !== 0
      ? +row.numOfBathrooms
      : +avg[0].avgBath;
  const rooms = row.numOfRooms ? +row.numOfRooms : 1;
  const year =
    row.yearOfConstruction && row.yearOfConstruction !== 0
      ? row.yearOfConstruction
      : +avg[0].avgYear;
  console.log("loc", row.location, "-", locationWithoutCity, location);
  const newRow: Row = {
    // price: normalize(price, +avg[0].minPrice, +avg[0].maxPrice),
    size: normalize(size, +avg[0].minSize, +avg[0].maxSize),
    location: normalizeLocation(location),
    floor: row.floor,
    numOfBathrooms: normalize(bathrooms, +avg[0].minBath, +avg[0].maxBath),
    numOfRooms: normalize(rooms, +avg[0].minRooms, +avg[0].maxRooms),
    registered: boolToNumber(row.registered),
    elevator: boolToNumber(row.elevator),
    terrace: boolToNumber(row.terrace),
    parking: boolToNumber(row.parking),
    garage: boolToNumber(row.garage),
    yearOfConstruction: normalize(year, +avg[0].minYear, +avg[0].maxYear),
  };

  // console.log(newRow);
  return newRow;
};
