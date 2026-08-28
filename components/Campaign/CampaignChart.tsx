"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function CampaignChart({ data }: { data: number[] }) {
  const options: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 8, columnWidth: "50%" } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: data.map((_, index) => String(index + 1)),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#FFFFFF" } },
    },
    yaxis: { show: false },
    grid: { show: false },
    colors: ["#FFFFFF"],
  };
  return <Chart options={options} series={[{ name: "Engagement", data }]} type="bar" height={320} />;
}
