"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SelectVehicleCard, { Vehicle } from "@/components/general/Cards/SelectVehicleCard";
import VehicleCardSkeleton from "@/components/general/Skeletons/VehicleCardSkeleton";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import { getTripDetails, persistVehicle, persistBooking, serviceLabel } from "@/shared/booking";
import { fetchAvailableVehicles, availableVehicleToCard } from "@/api/availableVehicles";
import { createBooking } from "@/api/createBooking";

interface SelectVehicleProps {
  onContinue?: (vehicle: Vehicle) => void;
}

export default function SelectVehicle({ onContinue }: SelectVehicleProps) {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [noTrip, setNoTrip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadVehicles = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    setNoTrip(false);
    const trip = getTripDetails();
    if (!trip) {
      setNoTrip(true);
      setIsLoading(false);
      return;
    }
    try {
      const list = await fetchAvailableVehicles({
        date: trip.date,
        time: trip.pickupTime,
        passengers: trip.passengers,
      });
      const vehicles = list.map(availableVehicleToCard);
      setVehicles(vehicles);
      setSelectedVehicleId((prev) =>
        prev && vehicles.some((v) => v.id === prev) ? prev : (vehicles[0]?.id ?? null)
      );
    } catch {
      setLoadError("We couldn't load available vehicles. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadVehicles();
  }, [loadVehicles]);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || null;

  const handleContinue = async () => {
    if (!selectedVehicle) {
      toast.error("Please select a vehicle to proceed.");
      return;
    }
    const trip = getTripDetails();
    if (!trip?.pickupLocation || !trip.destination) {
      toast.error("Trip details are missing. Please start over.");
      return;
    }
    setIsSubmitting(true);
    try {
      const booking = await createBooking({
        pickupLocation: trip.pickupLocation,
        destination: trip.destination,
        date: trip.date,
        time: trip.pickupTime,
        serviceType: serviceLabel(trip.serviceType) ?? trip.serviceType,
        vehicleId: selectedVehicle.id,
        estimatedHours: trip.estimatedHours,
      });
      persistBooking(booking);
      persistVehicle(selectedVehicle);
      setIsSubmitting(false);
      toast.success(`Booking ${booking.bookingReference} confirmed! Proceeding to checkout.`);
      if (onContinue) {
        onContinue(selectedVehicle);
      } else {
        router.push("/reserve/checkout");
      }
    } catch {
      setIsSubmitting(false);
      toast.error("We couldn't create your booking. Please try again.");
    }
  };

  return (
    <section className="w-full pb-12 pt-4 bg-[#0D0D0D]">
      <div className="container mx-auto">
        {!noTrip && !isLoading && !loadError && vehicles.length > 0 && (
          <div className="mb-8 md:mb-10">
            <h1 className="text-[20px] md:text-[40px] font-[600] text-primary font-montserrat tracking-tight mb-3">
              Select Your Vehicle
            </h1>
            <p className="text-[14px] md:text-[20px] text-silver font-inter font-[600]">
              All Vehicles Are Available For Your Requested Date And Time. Pricing Includes Chauffeur And Gratuity.
            </p>
          </div>
        )}

        {/* Vehicle Cards List */}
        <div className="flex flex-col gap-4 md:gap-8 md:px-12">
          {noTrip ? (
            <div className="flex flex-col items-center py-16 gap-4 text-center bg-[#151515] border border-gold-deep rounded-[8px] p-6 mt-10">
              <p className="text-silver font-inter text-[16px]">
                Please fill in your trip details first.
              </p>
              <Button onClick={() => router.push("/reserve")} className="px-6 py-2 text-[14px]">
                Back To Trip Details
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col gap-4 md:gap-8" aria-busy="true" aria-label="Loading available vehicles">
              <VehicleCardSkeleton />
              <VehicleCardSkeleton />
              <VehicleCardSkeleton />
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center py-16 gap-4 text-center bg-[#151515] border border-gold-deep rounded-[8px] p-6 mt-10">
              <p className="text-silver font-inter text-[16px]">{loadError}</p>
              <Button onClick={() => void loadVehicles()} className="px-6 py-2 text-[14px]">
                Try Again
              </Button>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-2 text-center bg-[#151515] border border-gold-deep rounded-[8px] p-6 mt-10">
              <p className="text-silver font-inter text-[16px]">
                No vehicles available for your party size. Please adjust the number of passengers.
              </p>
            </div>
          ) : (
            vehicles.map((vehicle) => (
              <SelectVehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isSelected={selectedVehicleId === vehicle.id}
                onSelect={(v) => setSelectedVehicleId(v.id)}
              />
            ))
          )}
        </div>

        {/* Action Button: Continue To Checkout */}
        {!noTrip && !isLoading && !loadError && vehicles.length > 0 && (
          <div className="pt-8 md:pt-10 flex justify-end md:mr-12">
            <Button
              onClick={() => void handleContinue()}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3.5 text-[16px] md:text-[20px]"
            >
              {isSubmitting ? "Creating Booking..." : "Continue To Checkout"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}