import React, { Dispatch, createContext, useEffect, useState } from "react";

type ProviderProps = {
  children?: React.ReactNode;
};

export interface ContextType {
  location: string;
  setLocation: Dispatch<React.SetStateAction<string>>;
  // price: number;
  // setPrice: Dispatch<React.SetStateAction<number>>;
  size: number;
  setSize: Dispatch<React.SetStateAction<number>>;
  yearOfConstruction: number;
  setYearOfConstruction: Dispatch<React.SetStateAction<number>>;
  floor: number;
  setFloor: Dispatch<React.SetStateAction<number>>;
  numOfBathrooms: number;
  setNumOfBathrooms: Dispatch<React.SetStateAction<number>>;
  numOfRooms: number;
  setNumOfRooms: Dispatch<React.SetStateAction<number>>;
  registered: boolean;
  setRegistered: Dispatch<React.SetStateAction<boolean>>;
  elevator: boolean;
  setElevator: Dispatch<React.SetStateAction<boolean>>;
  terrace: boolean;
  setTerrace: Dispatch<React.SetStateAction<boolean>>;
  parking: boolean;
  setParking: Dispatch<React.SetStateAction<boolean>>;
  garage: boolean;
  setGarage: Dispatch<React.SetStateAction<boolean>>;
}

export const Context = createContext<ContextType>({
  location: "",
  setLocation: () => {},
  // price: 100000,
  // setPrice: () => {},
  size: 50,
  setSize: () => {},
  yearOfConstruction: 2000,
  setYearOfConstruction: () => {},
  floor: 0,
  setFloor: () => {},
  numOfBathrooms: 1,
  setNumOfBathrooms: () => {},
  numOfRooms: 1,
  setNumOfRooms: () => {},
  registered: false,
  setRegistered: () => {},
  elevator: false,
  setElevator: () => {},
  terrace: false,
  setTerrace: () => {},
  parking: false,
  setParking: () => {},
  garage: false,
  setGarage: () => {},
});

export const Provider = ({ children }: ProviderProps) => {
  const [location, setLocation] = useState<string>("");
  // const [price, setPrice] = useState<number>(100000);
  const [size, setSize] = useState<number>(50);
  const [yearOfConstruction, setYearOfConstruction] = useState<number>(0);
  const [floor, setFloor] = useState<number>(0);
  const [numOfBathrooms, setNumOfBathrooms] = useState<number>(0);
  const [numOfRooms, setNumOfRooms] = useState<number>(1);
  const [registered, setRegistered] = useState<boolean>(false);
  const [elevator, setElevator] = useState<boolean>(false);
  const [terrace, setTerrace] = useState<boolean>(false);
  const [parking, setParking] = useState<boolean>(false);
  const [garage, setGarage] = useState<boolean>(false);

  const u: ContextType = {
    location,
    setLocation,
    // price,
    // setPrice,
    size,
    setSize,
    yearOfConstruction,
    setYearOfConstruction,
    floor,
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
  };
  return <Context.Provider value={u}>{children}</Context.Provider>;
};
