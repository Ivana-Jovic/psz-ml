import Link from "next/link";
import Input from "../components/Input";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { top5locations } from "@/top5Locations";
import { useContext, useState } from "react";
import { Context, ContextType } from "@/context";

//todo check if uopste valid
// todo dodaj valid offer polje

export default function Home() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const {
    location,
    setLocation,
    price,
    setPrice,
    size,
    setSize,
    yearOfConstruction,
    setYearOfConstruction,
    floor, // todo bitno je samo prizemlje ii n
    setFloor,
    numOfBathrooms,
    setNumOfBathrooms,
    numOfRooms,
    setNumOfRooms,
    registered,
    setRegistered,
    elevator,
    setElevator,
    terrace,
    setTerrace,
    parking,
    setParking,
    garage,
    setGarage,
  } = useContext(Context);
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<ContextType>({
    defaultValues: {
      location,
      price,
      size,
      yearOfConstruction,
      floor,
      numOfBathrooms,
      numOfRooms,
      elevator,
      registered,
      terrace,
      parking,
      garage,
    },
  });

  const onSubmit: SubmitHandler<ContextType> = (data) => {
    setLocation(data.location);
    setPrice(data.price);
    setSize(data.size);
    setYearOfConstruction(data.yearOfConstruction);
    setFloor(data.floor);
    setNumOfBathrooms(data.numOfBathrooms);
    setNumOfRooms(data.numOfRooms);
    setRegistered(data.registered);
    setElevator(data.elevator);
    setTerrace(data.terrace);
    setParking(data.parking);
    setGarage(data.garage);
    setFormSubmitted(true);
    console.log("Hi");
    console.log(data);
    console.log("helloo", location);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="px-10 flex flex-col gap-20 justify-center items-center min-h-screen">
        <Link href={"/task2"} className="btn">
          Go to task2
        </Link>
        <Link href={"/task3"} className="btn">
          Go to task3
        </Link>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" flex w-full flex-col gap-2"
        >
          <div>
            <label className="label">
              <span className="label-text">Location</span>
            </label>
            <div className="flex  items-center gap-3 ">
              <select
                className="select select-bordered w-full"
                {...register("location", {
                  required: true,
                })}
              >
                {top5locations.map((loc: string) => (
                  <option key={loc}>{loc}</option>
                ))}
              </select>{" "}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-5">
            <Input
              {...register("price", {
                required: true,
                min: 1,
                valueAsNumber: true,
              })}
              label={"Price"}
              type="number"
              min={1}
            />
            <Input
              {...register("size", {
                required: true,
                min: 1,
                valueAsNumber: true,
              })}
              label={"Size"}
              type="number"
              min={1}
            />
            <Input
              {...register("yearOfConstruction", {
                required: true,
                min: 1,
                valueAsNumber: true,
              })}
              label={"yearOfConstruction"}
              type="number"
              min={1}
            />
            <Input
              {...register("floor", {
                required: true,
                min: 1,
                valueAsNumber: true,
              })}
              label={"floor or total floors"}
              type="number"
              min={1}
            />
            <Input
              {...register("numOfBathrooms", {
                required: true,
                min: 1,
                valueAsNumber: true,
              })}
              label={"numOfBathrooms"}
              type="number"
              min={1}
            />
            <Input
              {...register("numOfRooms", {
                required: true,
                min: 1,
                valueAsNumber: true,
              })}
              label={"numOfRooms"}
              type="number"
              min={1}
            />
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="checkbox"
                {...register("registered", {})}
              />
              Registered+ grejanje
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="checkbox"
                {...register("elevator", {})}
              />
              Elevator
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="checkbox"
                {...register("terrace", {})}
              />
              Terrace
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="checkbox"
                {...register("parking", {})}
              />
              Parking
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="checkbox"
                {...register("garage", {})}
              />
              Garage
            </div>
          </div>
          <button className="btn mt-5" type="submit">
            Done
          </button>
          <div className="text-center text-red-600">
            {errors && (
              <div>Some fields are requred or error with the input data</div>
            )}
          </div>
        </form>
        {formSubmitted && (
          <Link href={"/task4"} className="btn">
            Go to task4
          </Link>
        )}
      </div>
    </main>
  );
}
