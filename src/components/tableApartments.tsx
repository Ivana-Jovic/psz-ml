import React from "react";
import { ApartmentsForSale } from "@/db/schema/apartmentsForSale";

function TableApartments({ data }: { data: ApartmentsForSale[] }) {
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
            <td>floor</td>
            <td>total_floors</td>
            <td>num_of_bathrooms</td>
            <td>num_of_rooms</td>
            <td>registered</td>
            <td>elevator</td>
            <td>terrace</td>
            <td>parking</td>
            <td>garage</td>
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
              <tr>
                <th>{i}</th>
                <td>{row.id}</td>
                <td>{row.url}</td>
                <td>{row.title}</td>
                <td>{row.price}</td>
                <td>{row.size}</td>
                <td>{row.location}</td>
                <td>{row.city}</td>
                <td>{row.yearOfConstruction}</td>
                <td>{row.floor}</td>
                <td>{row.totalFloors}</td>
                <td>{row.numOfBathrooms}</td>
                <td>{row.numOfRooms}</td>
                <td>{row.registered}</td>
                <td>{row.elevator}</td>
                <td>{row.terrace}</td>
                <td>{row.parking}</td>
                <td>{row.garage}</td>
                {/* <td>{row.validOffer}</td> */}
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableApartments;
