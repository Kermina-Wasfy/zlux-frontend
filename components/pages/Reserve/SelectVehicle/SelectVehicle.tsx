"use client";

import React, { useState } from "react";
import Tabs from "@/components/general/Tabs";
import SelectVehicleCard, { Vehicle } from "@/components/general/Cards/SelectVehicleCard";
import Button from "@/components/ui/Button";
import { toast } from "sonner";

export const VEHICLES_DATA: Vehicle[] = [
  {
    id: "lincoln-navigator",
    name: "Lincoln Navigator",
    description: "Effortless American Luxury. 30-Way Adjustable Perfect Position Seats.",
    passengers: 6,
    bags: 6,
    category: "SUVs",
    price: 215,
    priceUnit: "Per Hour",
    image: "/vehicle1.jpg",
  },
  {
    id: "cadillac-escalade",
    name: "Cadillac Escalade",
    description: "Commanding Presence. Perfect For Executive Travel With Full Entertainment Suite.",
    passengers: 5,
    bags: 6,
    category: "SUVs",
    price: 225,
    priceUnit: "Per Hour",
    image: "/vehicle2.jpg",
  },
  {
    id: "mercedes-benz-s-class",
    name: "Mercedes-Benz S-Class",
    description: "The Pinnacle Of Automotive Luxury. Messaging Seats, Ambient Lighting, And Whisper-Quiet Cabin.",
    passengers: 3,
    bags: 3,
    category: "Sedans",
    price: 185,
    priceUnit: "Per Hour",
    image: "/vehicle1.jpg",
  },
  {
    id: "bmw-7-series",
    name: "BMW 7 Series",
    description: "Executive Elegance With Unmatched Driving Dynamics And Theatre Screen.",
    passengers: 3,
    bags: 3,
    category: "Sedans",
    price: 195,
    priceUnit: "Per Hour",
    image: "/vehicle2.jpg",
  },
  {
    id: "rolls-royce-phantom",
    name: "Rolls-Royce Phantom",
    description: "The Ultimate Expression Of Luxury. Starlight Headliner, Champagne Service.",
    passengers: 3,
    bags: 2,
    category: "Sedans",
    price: 595,
    priceUnit: "Per Hour",
    image: "/vehicle1.jpg",
  },
];

interface SelectVehicleProps {
  onContinue?: (vehicle: Vehicle) => void;
  onBack?: () => void;
}

export default function SelectVehicle({ onContinue, onBack }: SelectVehicleProps) {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("lincoln-navigator");

  const selectedVehicle = VEHICLES_DATA.find((v) => v.id === selectedVehicleId) || VEHICLES_DATA[0];

  const handleContinue = () => {
    if (!selectedVehicle) {
      toast.error("Please select a vehicle to proceed.");
      return;
    }
    toast.success(`Selected ${selectedVehicle.name}! Proceeding to checkout.`);
    if (onContinue) {
      onContinue(selectedVehicle);
    }
  };

  return (
    <section className="w-full pb-12 pt-4 bg-[#0D0D0D]">
      {/* 3-Step Navigation Stepper */}
      <Tabs
        currentStep={2}
        backHref="/reserve"
        backLabel="Previous Step"
        onStepClick={(stepId) => {
          if (stepId === 1 && onBack) {
            onBack();
          }
        }}
      />

      <div className="container mx-auto pt-6 md:pt-10">
        {/* Section Heading */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-[20px] md:text-[40px] font-[600] text-primary font-montserrat tracking-tight mb-2">
            Select Your Vehicle
          </h1>
          <p className="text-[14px] md:text-[20px] text-silver font-inter font-[600]">
            All Vehicles Are Available For Your Requested Date And Time. Pricing Includes Chauffeur And Gratuity.
          </p>
        </div>

        {/* Vehicle Cards List */}
        <div className="flex flex-col gap-4 md:gap-5">
          {VEHICLES_DATA.map((vehicle) => (
            <SelectVehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              isSelected={selectedVehicleId === vehicle.id}
              onSelect={(v) => setSelectedVehicleId(v.id)}
            />
          ))}
        </div>

        {/* Action Button: Continue To Checkout */}
        <div className="pt-8 md:pt-10 flex justify-end">
          <Button
            onClick={handleContinue}
            className="w-full sm:w-auto px-8 py-3.5 text-[16px] md:text-[20px] shadow-[0_4px_25px_rgba(197,160,89,0.35)]"
          >
            Continue To Checkout
          </Button>
        </div>
      </div>
    </section>
  );
}
