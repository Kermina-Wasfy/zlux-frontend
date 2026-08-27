"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User, Briefcase } from "lucide-react";

export interface Vehicle {
  id: string;
  name: string;
  description: string;
  passengers: number;
  bags: number;
  category: string;
  price: number;
  priceUnit?: string;
  image: string;
}

export interface SelectVehicleCardProps {
  vehicle: Vehicle;
  isSelected?: boolean;
  onSelect?: (vehicle: Vehicle) => void;
  className?: string;
}

export default function SelectVehicleCard({
  vehicle,
  isSelected = false,
  onSelect,
  className = "",
}: SelectVehicleCardProps) {
  const [imgSrc, setImgSrc] = useState<string>(vehicle.image);

  return (
    <div
      onClick={() => onSelect?.(vehicle)}
      className={`w-full rounded-[8px] p-3 sm:p-4 transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-stretch justify-between gap-4 select-none
        ${
          isSelected
            ? "border border-primary bg-[#141414] shadow-[0_0_20px_rgba(197,160,89,0.15)]"
            : "border border-[#382E1E] bg-[#0E0E0E] hover:border-primary/60 hover:bg-[#131313]"
        }
        ${className}`}
    >
      {/* Left Info: Image + Specifications */}
      <div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">
        {/* Vehicle Image */}
        <div className="w-[110px] sm:w-[160px] md:w-[190px] h-[80px] sm:h-[105px] md:h-[115px] relative rounded-[6px] overflow-hidden bg-[#1A1A1A] flex-shrink-0">
          <Image
            src={imgSrc}
            alt={vehicle.name}
            fill
            sizes="(max-width: 640px) 110px, (max-width: 768px) 160px, 190px"
            className="object-cover object-center"
            onError={() => setImgSrc("/herosectionBg.jpg")}
          />
        </div>

        {/* Vehicle Details */}
        <div className="flex flex-col justify-center flex-1 min-w-0">
          <h3 className="text-[16px] sm:text-[19px] md:text-[21px] font-[600] text-platinum font-montserrat tracking-tight mb-1 truncate">
            {vehicle.name}
          </h3>
          <p className="text-[12px] sm:text-[13px] md:text-[14px] text-silver/80 font-inter font-[400] leading-snug line-clamp-2 mb-2 sm:mb-3">
            {vehicle.description}
          </p>

          {/* Specs Row */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-[12px] sm:text-[13px] md:text-[14px] font-inter text-[#E5E4E2]">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-primary" />
              <span>{vehicle.passengers} Passengers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-primary" />
              <span>{vehicle.bags} Bags</span>
            </div>
            <span className="text-primary font-montserrat font-[600] ml-1">
              {vehicle.category}
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Price & Radio Selection */}
      <div className="border-t sm:border-t-0 sm:border-l border-[#262016] pt-3 sm:pt-0 sm:pl-5 md:pl-8 flex sm:flex-col items-center justify-between sm:justify-center min-w-[100px] sm:min-w-[120px] md:min-w-[140px] flex-shrink-0">
        <div className="flex sm:flex-col items-baseline sm:items-center gap-2 sm:gap-0">
          <span className="text-[22px] sm:text-[26px] md:text-[28px] font-[700] text-platinum font-montserrat leading-tight">
            ${vehicle.price}
          </span>
          <span className="text-[12px] sm:text-[13px] text-silver font-inter font-[400] sm:mt-0.5 sm:mb-2.5">
            {vehicle.priceUnit || "Per Hour"}
          </span>
        </div>

        {/* Custom Radio Button */}
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
            isSelected
              ? "border-2 border-primary"
              : "border border-[#4A3B22]"
          }`}
        >
          <div
            className={`w-2.5 h-2.5 rounded-full bg-primary transition-all duration-200 ${
              isSelected ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
