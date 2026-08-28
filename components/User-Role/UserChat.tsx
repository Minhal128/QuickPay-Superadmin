"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function UserChart({
  categories,
  data,
}: {
  categories: string[];
  data: number[];
}) {
  const options: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 8, columnWidth: "50%" } },
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#FFFFFF" } },
    },
    yaxis: { show: false },
    grid: { show: false },
    colors: ["#FFFFFF"],
  };

  return (
    <div className="h-80">
      <Chart
        options={options}
        series={[{ name: "Activity", data }]}
        type="bar"
        height="100%"
      />
    </div>
  );
}
