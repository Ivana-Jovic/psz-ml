import { LocationRentSaleCount } from "@/pages/task3";
import React from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

function RePieChart({ data }: { data: LocationRentSaleCount[] }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl">{data[0].location}</div>
      <PieChart height={250} width={600}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          dataKey="count"
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            value,
            index,
          }) => {
            console.log("handling label?");
            const RADIAN = Math.PI / 180;
            // eslint-disable-next-line
            const radius = 25 + innerRadius + (outerRadius - innerRadius);
            // eslint-disable-next-line
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            // eslint-disable-next-line
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                x={x}
                y={y}
                fill="#8884d8"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
              >
                {data[index].isRent ? "Rent" : "Sale"}&nbsp;{value}&nbsp;(
                {(
                  (data[0].count * 100) /
                  (data[0].count + data[1].count)
                ).toFixed(2)}
                %)
              </text>
            );
          }}
        />
      </PieChart>
    </div>
  );
}

export default RePieChart;
