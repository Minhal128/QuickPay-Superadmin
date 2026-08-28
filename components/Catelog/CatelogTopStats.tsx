"use client";

import Image from "next/image";
import { useApi } from "@/lib/useApi";

type CategoryItem = {
  id: number;
  title: string;
  services: number;
  cities: number;
  image: string;
};

export default function CatelogTopStats() {
  const { data } = useApi<{ items: CategoryItem[] }>("/catalog/categories");
  const categories = data?.items ?? [];

  return (
    <div className="w-full bg-[#121212] p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        {categories.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-[#2A2A2A] p-4 transition-all duration-300 hover:border-[#374151]"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#1A1A1A]">
              <Image
                src={item.image || "/images/user.png"}
                alt={item.title}
                width={26}
                height={26}
                className="object-cover"
              />
            </div>

            <h3 className="text-md font-Inter text-white">{item.title}</h3>

            <p className="mt-1 font-Inter text-sm text-gray-400">
              {item.services} services • {item.cities} cities
            </p>

            <button className="mt-4 h-9 min-w-22.5 cursor-pointer rounded-lg border border-[#2A2A2A] bg-transparent px-4 text-sm font-Inter text-white transition-all duration-300 hover:bg-white hover:text-black">
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
