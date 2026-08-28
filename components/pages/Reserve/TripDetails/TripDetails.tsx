"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { toast } from "sonner";
import LocationInput from "@/components/ui/LocationInput";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import TimePicker from "@/components/ui/TimePicker";
import {
  tripDetailsSchema,
  TripDetailsFormData,
  SERVICE_TYPE_OPTIONS,
} from "./tripSchema";
import Button from "@/components/ui/Button";
import { persistTripDetails } from "@/shared/booking";

interface TripDetailsProps {
  onContinue?: (data: TripDetailsFormData) => void;
}

export default function TripDetails({ onContinue }: TripDetailsProps) {
  const [formData, setFormData] = useState<TripDetailsFormData>({
    pickupLocation: "",
    destination: "",
    date: "",
    pickupTime: "",
    serviceType: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TripDetailsFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active location query for Google Map (debounced so the
  // iframe doesn't reload on every keystroke)
  const mapLocation =
    formData.pickupLocation.trim() ||
    formData.destination.trim() ||
    "Los Angeles, CA, USA";

  const [mapQuery, setMapQuery] = useState(mapLocation);
  const mapTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    mapTimer.current = setTimeout(() => setMapQuery(mapLocation), 600);
    return () => clearTimeout(mapTimer.current);
  }, [mapLocation]);

  const handleChange = (field: keyof TripDetailsFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for field when user changes it
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = tripDetailsSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof TripDetailsFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof TripDetailsFormData;
        if (path && !fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      toast.error("Please fill in all required fields correctly.");
      setIsSubmitting(false);
      return;
    }

    setErrors({});
    toast.success("Trip details confirmed! Proceeding to vehicle selection.");

    persistTripDetails(result.data);

    if (onContinue) {
      onContinue(result.data);
    }
    setIsSubmitting(false);
  };

  return (
    <section className="w-full pb-12 pt-4 bg-[#0D0D0D]">
      <div className="container mx-auto">
        {/* Section Heading */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-[20px] md:text-[40px] font-[600] text-primary font-montserrat tracking-tight mb-3">
            Trip Details
          </h1>
          <p className="text-[14px] md:text-[20px] text-silver font-inter font-[600]">
            Confirm Your Journey Information Below.
          </p>
        </div>

        {/* Main Content Grid: Form (Left) & Google Map (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
          {/* Left Form Column */}
          <div className="lg:col-span-6 xl:col-span-7 flex md:px-5">
            <form onSubmit={handleSubmit} noValidate className="space-y-6 flex flex-col w-full">
              {/* Row 1: Pickup Location & Destination */}
              <div className="grid grid-cols-2 gap-5">
                <LocationInput
                  label="Pickup Location"
                  placeholder="Address, Airport , Or Hotel"
                  value={formData.pickupLocation}
                  onChange={(v) => handleChange("pickupLocation", v)}
                  error={errors.pickupLocation}
                />
                <LocationInput
                  label="Destination"
                  placeholder="Address, Airport , Or Hotel"
                  value={formData.destination}
                  onChange={(v) => handleChange("destination", v)}
                  error={errors.destination}
                />
              </div>

              {/* Row 2: Date, Pickup Time, Service Type */}
              <div className="grid grid-cols-3 gap-5">
                <DatePicker
                  label="Date"
                  placeholder="MM/DD/YYYY"
                  value={formData.date}
                  onChange={(value) => handleChange("date", value)}
                  error={errors.date}
                />
                <TimePicker
                  label="Pickup Time"
                  placeholder="--:--"
                  value={formData.pickupTime}
                  onChange={(value) => handleChange("pickupTime", value)}
                  error={errors.pickupTime}
                />
                <Select
                  label="Service Type"
                  options={SERVICE_TYPE_OPTIONS}
                  placeholder="............"
                  value={formData.serviceType}
                  onChange={(e) => handleChange("serviceType", e.target.value)}
                  error={errors.serviceType}
                />
              </div>

              {/* Action Button */}
              <div className="pt-4 sm:pt-8 mt-auto">
                <Button
                  type="submit"
                  className="w-full h-[52px] px-8 rounded-[8px] bg-gradient-primary font-inter font-[600] text-[16px] md:text-[20px] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
                 >
                  {isSubmitting ? "Processing..." : "Continue To Vehicle"}
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column: Google Map */}
          <div className="lg:col-span-6 xl:col-span-5 flex">
            <div className="relative w-full flex-1 md:min-h-[400px]  min-h-[300px] overflow-hidden border border-[#3A301E] bg-[#141414] shadow-2xl">
              {/* Google Maps Embed iframe */}
              <iframe
                title="Google Maps Location"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  mapQuery
                )}&t=m&z=13&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-0 filter brightness-95 contrast-105"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Start marker: Pickup */}
              {formData.pickupLocation.trim() && (
                <div className="absolute top-3 left-3 pointer-events-none z-10 flex flex-col items-center">
                  <div className="bg-[#1A1A1A]/95 text-white text-[11px] md:text-[12px] font-medium font-inter px-3 py-1.5 rounded-[6px] shadow-lg border border-black/40 flex items-center gap-1.5 max-w-[220px] backdrop-blur-sm">
                    <span className="truncate">{formData.pickupLocation.trim()}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-[#10B981] flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-black/20">
                      <span className="text-white text-[10px] font-bold font-inter">A</span>
                    </div>
                  </div>
                </div>
              )}

              {/* End marker: Destination */}
              {formData.destination.trim() && (
                <div className="absolute bottom-3 right-3 pointer-events-none z-10 flex flex-col items-center">
                  <div className="mt-1 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-[#EF4444] flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-black/20">
                      <span className="text-white text-[10px] font-bold font-inter">B</span>
                    </div>
                  </div>
                  <div className="bg-[#1A1A1A]/95 text-white text-[11px] md:text-[12px] font-medium font-inter px-3 py-1.5 rounded-[6px] shadow-lg border border-black/40 flex items-center gap-1.5 max-w-[220px] backdrop-blur-sm">
                    <span className="truncate">{formData.destination.trim()}</span>
                  </div>
                </div>
              )}

              {/* Centered placeholder marker when no location selected yet */}
              {!formData.pickupLocation.trim() && !formData.destination.trim() && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full mb-2 pointer-events-none z-10 flex flex-col items-center">
                  <div className="bg-[#1A1A1A]/95 text-white text-[12px] font-medium font-inter px-3 py-1.5 rounded-[6px] shadow-lg border border-black/40 flex items-center gap-1.5 whitespace-nowrap backdrop-blur-sm">
                    <span>Los Angeles, CA, USA</span>
                  </div>
                  <div className="mt-1 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-black/20 animate-bounce duration-1000">
                      <MapPin className="w-4 h-4 text-white fill-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
