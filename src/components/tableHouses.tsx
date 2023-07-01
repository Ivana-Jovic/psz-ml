import { Houses } from "@/pages/task2";
import React from "react";
import { HousesForSale, housesForSale } from "@/db/schema/housesForSale";

function isHouses(obj: any): obj is Houses {
  return true;
}
function isHousesForSale(obj: any): obj is HousesForSale {
  return true;
}

function TableHouses({ data }: { data: Houses[] | HousesForSale[] }) {
  return (
    <div className="overflow-y-auto max-w-3xl max-h-96">
      <table className="table table-xs table-zebra table-pin-rows table-pin-cols">
        <thead>
          <tr>
            <th></th>
            <td>id db</td>
            <td>url</td>
            <td>title</td>
            <td>price</td>
            <td>size</td>
            <td>location</td>
            <td>city</td>
            <td>year_of_construction</td>
            {/* <td>floor</td> */}
            <td>total_floors</td>
            <td>num_of_bathrooms</td>
            <td>num_of_rooms</td>
            <td>registered</td>
            <td>elevator</td>
            <td>terrace</td>
            <td>parking</td>
            <td>garage</td>
            <td>land_surface</td>
            {/* <td>land_surface</td> */}
            {/* <td>valid_offer</td> */}
            {/* landsurface */}
            {/* heating_central heating_ta
          heating_air_conditioning heating_floor
          heating_electricity heating_gas heating_solid_fuel
          heating_other  */}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <>
              <tr key={row.url}>
                <th>{i}</th>
                <td>{row.id}</td>
                <td>{row.url}</td>
                <td>{row.title}</td>
                <td>{row.price}</td>
                <td>{row.size}</td>
                <td>{row.location}</td>
                <td>{row.city}</td>
                <td>
                  {isHouses(row) && row.year_of_construction}
                  {isHousesForSale(row) && row.yearOfConstruction}
                </td>
                {/* <td>{row.floor}</td> */}
                <td>
                  {isHouses(row) && row.total_floors}
                  {isHousesForSale(row) && row.totalFloors}
                </td>
                <td>
                  {isHouses(row) && row.num_of_bathrooms}
                  {isHousesForSale(row) && row.numOfBathrooms}
                </td>
                <td>
                  {isHouses(row) && row.num_of_rooms}
                  {isHousesForSale(row) && row.numOfRooms}
                </td>
                <td>{row.registered ? "yes" : "no"}</td>
                <td>{row.elevator ? "yes" : "no"}</td>
                <td>{row.terrace ? "yes" : "no"}</td>
                <td>{row.parking ? "yes" : "no"}</td>
                <td>{row.garage ? "yes" : "no"}</td>
                <td>
                  {isHouses(row) && row.land_surface}
                  {isHousesForSale(row) && row.landSurface}
                </td>
                {/* <td>{row.validOffer}</td> */}
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableHouses;
