import React from "react";
import type { Metadata } from "next";
import Tabs from "@/components/general/Tabs";
import TripDetails from "@/components/pages/Reserve/TripDetails/TripDetails";

export const metadata: Metadata = {
  title: "Reserve - Trip Details | ZLUX Luxury Chauffeur Service",
  description: "Confirm your journey information and reserve your luxury chauffeur ride with ZLUX.",
};

export default function ReservePage() {
  return (
    <main className="min-h-[calc(100vh-80px)] w-full bg-[#0D0D0D] flex flex-col">
      {/* 3-Step Stepper Header */}
      <Tabs currentStep={1} backHref="/" backLabel="Back To Home" />

      {/* Step 1 Content: Trip Details */}
      <div className="flex-1">
        <TripDetails />
      </div>
    </main>
  );
}
