"use client";

import React from "react";
import Image from "next/image";

export interface BookingDetails {
  vehicleName?: string;
  vehicleCapacity?: string;
  vehicleImage?: string;
  pickup?: string;
  destination?: string;
  date?: string;
  time?: string;
  service?: string;
  estimatedTotal?: number | string;
}

interface BookingSummaryProps {
  details?: BookingDetails;
  showTotal?: boolean;
}

export default function BookingSummary({
  details,
  showTotal = true,
}: BookingSummaryProps) {
  const vehicleName = details?.vehicleName;
  const vehicleCapacity = details?.vehicleCapacity;
  const vehicleImage = details?.vehicleImage;
  const pickup = details?.pickup || "—";
  const destination = details?.destination || "—";
  const date = details?.date || "—";
  const time = details?.time || "—";
  const service = details?.service || "—";
  const total = details?.estimatedTotal || "$0.00";

  return (
    <div className="w-full bg-[#151515] pb-4 md:pb-6 border border-gold-deep flex flex-col">
      <div className="w-full h-[180px] sm:h-[210px] md:h-[240px] relative overflow-hidden bg-[#1A1A1A] mb-5">
        {vehicleImage && (
          <Image
            src={vehicleImage}
            alt={vehicleName || "Vehicle"}
            fill
            priority
            unoptimized
            sizes="(max-width: 768px) 100vw, 450px"
            className="object-cover object-center"
          />
        )}
      </div>

      <h2 className="px-4 md:px-6 text-[20px] md:text-[24px] font-[600] text-primary font-montserrat tracking-tight mb-2">
        Booking Summary
      </h2>

      <div className="px-4 md:px-6 mb-4">
        <h3 className="text-[16px] md:text-[24px] font-[700] text-[#E5E4E2] font-inter tracking-tight">
          {vehicleName}
        </h3>
        <p className="text-[14px] md:text-[16px] text-[#91918F] font-inter font-[500] mt-0.5">
          {vehicleCapacity}
        </p>
      </div>

      {/* Details List */}
      <div className="px-4 md:px-6 py-4 space-y-3 font-inter text-[14px] md:text-[15px]">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[14px] md:text-[16px] text-[#91918F] font-inter font-[500]">Pickup</span>
          <span className="text-silver/70 text-right truncate max-w-[200px]">{pickup}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[14px] md:text-[16px] text-[#91918F] font-inter font-[500]">Destination</span>
          <span className="text-silver/70 text-right truncate max-w-[200px]">{destination}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[14px] md:text-[16px] text-[#91918F] font-inter font-[500]">Date</span>
          <span className="text-silver/70 text-right">{date}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[14px] md:text-[16px] text-[#91918F] font-inter font-[500]">Time</span>
          <span className="text-silver/70 text-right">{time}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[14px] md:text-[16px] text-[#91918F] font-inter font-[500]">Service</span>
          <span className="text-silver/70 text-right">{service}</span>
        </div>
      </div>

      {/* Estimated Total */}
      {showTotal && (
        <div className="px-4 md:px-6 pt-5 flex flex-col">
          <div className="flex items-baseline justify-between">
            <span className="text-[#91918F] font-inter text-[14px] md:text-[16px] font-[500]">
              Estimated Total
            </span>
            <span className="text-[#E5E4E2] font-inter font-[700] text-[24px] md:text-[32px] leading-none">
              {typeof total === "number" ? `$${total}` : total}
            </span>
          </div>
          <span className="text-[12px] md:text-[16px] text-[#91918F] font-inter font-[500] text-right mt-1.5">
            Gratuity &amp; Fees Included
          </span>
        </div>
      )}
    </div>
  );
}
