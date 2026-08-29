"use client";

import { useState } from "react";
import Image from "next/image";

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
            className={`w-full transition-all duration-200 cursor-pointer flex flex-row items-stretch justify-between gap-4 select-none
        ${isSelected
                    ? "border border-primary bg-[#151515] shadow-[0_0_20px_rgba(197,160,89,0.15)]"
                    : "border border-gold-deep bg-[#151515] hover:border-primary/60"
                }
        ${className}`}
        >
            {/* Left Info*/}
            <div className="p-3 sm:p-5 flex items-stretch gap-3 sm:gap-8 flex-1 min-w-0">
                {/* Vehicle Image */}
                <div className="w-[110px] sm:w-[160px] md:w-[190px] h-full self-stretch relative overflow-hidden bg-[#1A1A1A] flex-shrink-0">
                    <Image
                        src={imgSrc}
                        alt={vehicle.name}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 110px, (max-width: 768px) 160px, 190px"
                        className="object-cover object-center"
                        onError={() => setImgSrc("/herosectionBg.jpg")}
                    />
                </div>

                {/* Vehicle Details */}
                <div className="flex flex-col justify-center flex-1 min-w-0">
                    <h3 className="text-[12px] sm:text-[20px] md:text-[24px] font-[700] text-platinum font-inter tracking-tight mb-1 truncate">
                        {vehicle.name}
                    </h3>
                    <p className="text-[8px] sm:text-[14px] md:text-[16px] text-silver font-inter font-[400] leading-snug line-clamp-2 mb-2 md:mb-6">
                        {vehicle.description}
                    </p>

                    {/* Specs Row */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-5 font-[500] text-[8px] sm:text-[14px] md:text-[16px] font-inter text-[#91918F]">
                        <div className="flex items-center gap-1.5">
                            <Image src="/passengers-icon.svg" alt="Passengers Icon" width={20} height={20} className="md:h-[20px] md:w-[20px] h-[10px] w-[10px] text-primary" />
                            <span>{vehicle.passengers} Passengers</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Image src="/bags-icon.svg" alt="Bags Icon" width={20} height={20} className="md:h-[20px] md:w-[20px] h-[10px] w-[10px] text-primary" />

                            <span>{vehicle.bags} Bags</span>
                        </div>
                        <span className="text-primary font-[600] ml-1">
                            {vehicle.category}
                        </span>
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className={`
                flex items-center
                   ${isSelected
                    ? "border-l border-primary"
                    : "border-l border-gold-deep hover:border-primary/60"
                }
                
            `}>
                <div className="p-3 sm:p-5 flex flex-col items-center justify-center min-w-[100px] sm:min-w-[120px] md:min-w-[140px]">
                    <div className=" flex flex-col items-baseline justify-center items-center gap-1 mb-2">
                        <span className="text-[14px] sm:text-[26px] md:text-[32px] font-[700] text-platinum font-inter leading-tight">
                            ${vehicle.price}
                        </span>
                        <span className="text-[8px] sm:text-[12px] md:text-[16px] text-primary font-inter font-[600] sm:mt-0.5 sm:mb-2.5">
                            {vehicle.priceUnit || "Per Hour"}
                        </span>
                    </div>

                    {/* Custom Radio Button */}
                    <div
                        className={`md:w-[24px] md:h-[24px] h-[18px] w-[18px] rounded-full flex items-center justify-center transition-all ${isSelected
                            ? "border-2 border-primary"
                            : "border border-primary"
                            }`}
                    >
                        <div
                            className={`w-[12px] h-[12px] md:w-[16px] md:h-[16px] rounded-full bg-primary transition-all duration-200 ${isSelected ? "scale-100 opacity-100" : "scale-0 opacity-0"
                                }`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
