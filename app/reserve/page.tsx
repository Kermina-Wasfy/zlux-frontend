"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Tabs from "@/components/general/Tabs";
import TripDetails from "@/components/pages/Reserve/TripDetails/TripDetails";

export default function ReservePage() {
  const router = useRouter();

  return (
    <main className="min-h-[calc(100vh-80px)] w-full bg-[#0D0D0D] flex flex-col">
      {/* 3-Step Stepper Header */}
      <Tabs
        currentStep={1}
        backHref="/"
        backLabel="Back To Home"
        onStepClick={(stepId) => {
          if (stepId === 1) return;
          if (stepId === 2) router.push("/reserve/vehicle");
        }}
      />

      {/* Step 1 Content: Trip Details */}
      <div className="flex-1">
        <TripDetails
          onContinue={() => router.push("/reserve/vehicle")}
        />
      </div>
    </main>
  );
}
