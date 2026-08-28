"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useApi } from "@/lib/useApi";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function BookingChart() {
  const { data } = useApi<{
    bookingChart: { categories: string[]; series: { name: string; data: number[] }[] };
  }>("/analytics/overview");
  const chart = data?.bookingChart ?? {
    categories: [],
    series: [{ name: "Bookings", data: [] }],
  };
  const options: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 10, columnWidth: "50%" } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: chart.categories,
      labels: { style: { colors: "#FFFFFF", fontSize: "12px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: "#FFFFFF" } } },
    grid: { show: false },
    colors: ["#FFFFFF"],
  };

  return (
    <div className="bg-[#121212] px-4 pb-4">
      <div className="bg-[#1A1A1A] rounded-xl p-3">
        <h2 className="mb-6 text-lg font-Inter text-white">Bookings by status</h2>
        <div className="h-80 rounded-lg bg-[#111116] p-4">
          <Chart options={options} series={chart.series} type="bar" height="100%" />
        </div>
      </div>
    </div>
  );
}
