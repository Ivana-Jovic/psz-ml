import { InferGetServerSidePropsType } from "next";
import { getServerSideProps } from "@/pages";

function Task2({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <div className="">task2 Hello, {data[0].title}</div>;
}

export default Task2;
