// import { RangeCount } from "@/pages/task3";
import React from "react";
import { PieChart, Pie } from "recharts";

export type CountWithString = {
  name: string;
  count: number;
};

function PieChartTask3F({ data }: { data: CountWithString[] }) {
  return (
    <div className="flex flex-col items-center">
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
                {data[index].name} ({value})
              </text>
            );
          }}
        />
      </PieChart>
    </div>
  );
}

export default PieChartTask3F;
