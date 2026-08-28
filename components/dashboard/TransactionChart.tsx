"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useLayoutEffect, useRef } from "react";
import { useApi } from "@/lib/useApi";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function TransactionChart() {
  const { data } = useApi<{
    revenueChart: { categories: string[]; series: { name: string; data: number[] }[] };
  }>("/dashboard/overview");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      window.dispatchEvent(new Event("resize"));
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const revenueChart = data?.revenueChart ?? {
    categories: [],
    series: [{ name: "Revenue", data: [] }],
  };

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      width: "100%",
      toolbar: { show: false },
      zoom: { enabled: false },
      parentHeightOffset: 0,
    },

    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: "50%",
      },
    },

    dataLabels: { enabled: false },

    xaxis: {
      categories: revenueChart.categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#FFFFFF",
          fontSize: "12px",
        },
      },
    },

    yaxis: {
      labels: {
        formatter: (val: number) =>
          val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val.toFixed(0)}`,
        style: {
          colors: "#FFFFFF",
          fontSize: "11px",
        },
      },
      tickAmount: 5,
    },

    grid: { show: false },
    colors: ["#FFFFFF"],

    responsive: [
      {
        breakpoint: 768,
        options: {
          plotOptions: {
            bar: { columnWidth: "45%" },
          },
          xaxis: {
            labels: {
              rotate: -45,
              style: { fontSize: "10px" },
            },
          },
        },
      },
    ],
  };

  return (
    <div className="bg-[#121212] px-4 pb-4 md:pb-4">
      <div
        ref={containerRef}
        className="bg-[#1A1A1A] rounded-xl shadow-sm p-3 w-full overflow-hidden min-w-0"
      >
        {/* HEADER */}
        <div className="flex items-start justify-between mb-6 relative">
          <h2 className="text-lg font-Inter text-white">Revenue Overview</h2>
        </div>

        <div className="bg-[#111116] rounded-lg p-4 overflow-hidden">
          <div className="h-80 overflow-hidden">
            <Chart
              options={chartOptions}
              series={revenueChart.series}
              type="bar"
              height="100%"
              width="100%"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
