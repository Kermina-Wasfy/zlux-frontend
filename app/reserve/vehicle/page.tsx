"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Tabs from "@/components/general/Tabs";
import SelectVehicle from "@/components/pages/Reserve/SelectVehicle/SelectVehicle";

export default function SelectVehiclePage() {
  const router = useRouter();

  return (
    <main className="min-h-[calc(100vh-80px)] w-full bg-[#0D0D0D] flex flex-col">
      {/* 3-Step Stepper Header */}
      <Tabs
        currentStep={2}
        backHref="/reserve"
        backLabel="Previous Step"
        onStepClick={(stepId) => {
          if (stepId === 1) router.push("/reserve");
          if (stepId === 2) return;
        }}
      />

      {/* Step 2 Content: Select Vehicle */}
      <div className="flex-1">
        <SelectVehicle />
      </div>
    </main>
  );
}
