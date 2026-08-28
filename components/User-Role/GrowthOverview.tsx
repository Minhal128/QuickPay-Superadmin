"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useApi } from "@/lib/useApi";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type GrowthPoint = { month: string; balance: number };

export default function GrowthOverview() {
  const { data } = useApi<{ growth: GrowthPoint[] }>("/users/stats");
  const points = data?.growth ?? [];
  const options: ApexOptions = {
    chart: { type: "area", toolbar: { show: false }, zoom: { enabled: false } },
    colors: ["#FFFFFF"],
    stroke: { curve: "straight", width: 2 },
    dataLabels: { enabled: false },
    xaxis: {
      categories: points.map((item) => item.month),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#FFFFFF" } },
    },
    yaxis: { labels: { style: { colors: "#FFFFFF" } } },
    grid: { borderColor: "#374151", strokeDashArray: 3 },
  };
  const series = [{ name: "New users", data: points.map((item) => item.balance) }];

  return (
    <div className="bg-[#121212] px-4">
      <div className="w-full rounded-xl bg-[#1A1A1A] p-3 text-white">
        <h2 className="px-2 pb-4 text-lg font-Inter">User Growth</h2>
        <div className="h-80 rounded-2xl bg-[#121212] p-4">
          <Chart options={options} series={series} type="area" height="100%" />
        </div>
      </div>
    </div>
  );
}
