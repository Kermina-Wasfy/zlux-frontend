"use client";

import React, { useState } from "react";
import { Minus, Plus, MapPin, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import LocationInput from "@/components/ui/LocationInput";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import TimePicker from "@/components/ui/TimePicker";
import {
  tripDetailsSchema,
  TripDetailsFormData,
  LocationData,
  SERVICE_TYPE_OPTIONS,
} from "./tripSchema";
import Button from "@/components/ui/Button";
import { persistTripDetails } from "@/shared/booking";
import TripMap, { ActiveSearchState } from "./TripMap";
import type { GeocodeResult } from "@/lib/geocoding";

interface TripDetailsProps {
  onContinue?: (data: TripDetailsFormData) => void;
}

interface CounterFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  error?: string;
  minusAriaLabel: string;
  plusAriaLabel: string;
  onMinus: () => void;
  onPlus: () => void;
}

function CounterField({
  label,
  value,
  min,
  max,
  error,
  minusAriaLabel,
  plusAriaLabel,
  onMinus,
  onPlus,
}: CounterFieldProps) {
  return (
    <div>
      <label className="text-primary text-[16px] md:text-[20px] font-[500] font-inter mb-2 tracking-wide block min-h-[48px] sm:min-h-0">
        {label}
      </label>
      <div
        className={`flex items-center h-[52px] rounded-[8px] bg-[#0D0D0D] border transition-all duration-200 ${
          error ? "border-red-500/80" : "border-gold-deep hover:border-[#C5A059]/60"
        }`}
      >
        <button
          type="button"
          onClick={onMinus}
          disabled={value <= min}
          aria-label={minusAriaLabel}
          className="h-full px-5 text-primary hover:text-[#F8E387] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Minus className="w-5 h-5" />
        </button>
        <span className="flex-1 text-center text-[#E5E4E2] font-inter text-[16px] font-[600]">
          {value}
        </span>
        <button
          type="button"
          onClick={onPlus}
          disabled={value >= max}
          aria-label={plusAriaLabel}
          className="h-full px-5 text-primary hover:text-[#F8E387] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      {error && (
        <span className="text-red-400 text-[12px] mt-1.5 font-inter transition-opacity animate-in fade-in duration-150">
          {error}
        </span>
      )}
    </div>
  );
}

export default function TripDetails({ onContinue }: TripDetailsProps) {
  const [formData, setFormData] = useState<TripDetailsFormData>({
    pickupLocation: null,
    destination: null,
    date: "",
    pickupTime: "",
    serviceType: "",
    passengers: 1,
    estimatedHours: 1,
  });

  const [activeSearch, setActiveSearch] = useState<ActiveSearchState | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof TripDetailsFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof TripDetailsFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for field when user changes it
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePassengersChange = (value: number) => {
    setFormData((prev) => ({
      ...prev,
      passengers: Math.min(16, Math.max(1, value)),
    }));

    if (errors.passengers) {
      setErrors((prev) => ({ ...prev, passengers: undefined }));
    }
  };

  const handleEstimatedHoursChange = (value: number) => {
    setFormData((prev) => ({
      ...prev,
      estimatedHours: Math.min(24, Math.max(1, value)),
    }));

    if (errors.estimatedHours) {
      setErrors((prev) => ({ ...prev, estimatedHours: undefined }));
    }
  };

  const handleLocationChange = (
    field: "pickupLocation" | "destination",
    location: LocationData | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: location }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSearchChange = (
    field: "pickupLocation" | "destination",
    query: string,
    suggestions: GeocodeResult[],
    isLoading: boolean
  ) => {
    if (!query) {
      if (activeSearch?.field === field) {
        setActiveSearch(null);
      }
      return;
    }

    setActiveSearch({
      field,
      query,
      suggestions,
      isLoading,
    });
  };

  const handleSelectSuggestion = (
    field: "pickupLocation" | "destination",
    location: LocationData
  ) => {
    handleLocationChange(field, location);
    setActiveSearch(null);
  };

  const handleMapClick = (
    field: "pickupLocation" | "destination",
    location: LocationData
  ) => {
    handleLocationChange(field, location);
    setActiveSearch(null);
    toast.success(`Pinned ${field === "pickupLocation" ? "Pickup" : "Destination"} on map!`);
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

        {/* Main Content Grid: Form (Left) & OpenStreetMap Map (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Form Column */}
          <div className="lg:col-span-6 xl:col-span-7 flex md:px-5">
            <form onSubmit={handleSubmit} noValidate className="space-y-6 flex flex-col w-full">
              {/* Row 1: Pickup Location & Destination */}
              <div className="grid grid-cols-2 gap-5">
                <LocationInput
                  label="Pickup Location"
                  placeholder="Address, Airport , Or Hotel"
                  value={formData.pickupLocation}
                  proximity={
                    formData.destination
                      ? { lat: formData.destination.lat, lng: formData.destination.lng }
                      : null
                  }
                  onChange={(location) => handleLocationChange("pickupLocation", location)}
                  onSearchChange={(query, suggestions, isLoading) =>
                    handleSearchChange("pickupLocation", query, suggestions, isLoading)
                  }
                  error={errors.pickupLocation}
                />
                <LocationInput
                  label="Destination"
                  placeholder="Address, Airport , Or Hotel"
                  value={formData.destination}
                  proximity={
                    formData.pickupLocation
                      ? { lat: formData.pickupLocation.lat, lng: formData.pickupLocation.lng }
                      : null
                  }
                  onChange={(location) => handleLocationChange("destination", location)}
                  onSearchChange={(query, suggestions, isLoading) =>
                    handleSearchChange("destination", query, suggestions, isLoading)
                  }
                  error={errors.destination}
                />
              </div>

              {/* Mobile: Suggestions shown as a dropdown (styled like Select) instead of on the map */}
              {activeSearch &&
                (activeSearch.isLoading || (activeSearch.suggestions && activeSearch.suggestions.length > 0)) && (
                  <div className="lg:hidden">
                    <div className="rounded-[8px] bg-[#141414] border border-gold-deep shadow-[0_12px_40px_rgba(0,0,0,0.6)] custom-scroll overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gold-deep/40">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#C5A059]" />
                          <span className="text-primary font-inter font-[500] text-[14px]">
                            {activeSearch.field === "pickupLocation"
                              ? "Pickup Suggestions"
                              : "Destination Suggestions"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveSearch(null)}
                          className="text-[#8C8273] hover:text-primary transition-colors cursor-pointer p-0.5"
                          title="Close"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {activeSearch.isLoading ? (
                        <div className="py-4 flex items-center justify-center gap-2 text-[#8C8273] font-inter text-[13px]">
                          <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />
                          <span>Searching locations...</span>
                        </div>
                      ) : (
                        <ul className="max-h-60 overflow-auto custom-scroll">
                          {activeSearch.suggestions.map((s) => (
                            <li
                              key={s.id}
                              onClick={() => handleSelectSuggestion(activeSearch.field, s)}
                              className="flex flex-col gap-0.5 px-4 py-2.5 text-[14px] font-inter cursor-pointer transition-colors duration-150 text-[#E5E4E2] hover:bg-[#2A2417]"
                            >
                              <span className="truncate">{s.address}</span>
                              {s.subtitle && (
                                <span className="text-[12px] text-[#8C8273] truncate">
                                  {s.subtitle}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}

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

              {/* Row 3: Number of Passengers & Estimated Hours */}
              <div className="grid grid-cols-2 gap-5">
                <CounterField
                  label="Number of Passengers"
                  value={formData.passengers}
                  min={1}
                  max={16}
                  error={errors.passengers}
                  minusAriaLabel="Decrease passengers"
                  plusAriaLabel="Increase passengers"
                  onMinus={() => handlePassengersChange(formData.passengers - 1)}
                  onPlus={() => handlePassengersChange(formData.passengers + 1)}
                />
                <CounterField
                  label="Estimated Hours"
                  value={formData.estimatedHours}
                  min={1}
                  max={24}
                  error={errors.estimatedHours}
                  minusAriaLabel="Decrease estimated hours"
                  plusAriaLabel="Increase estimated hours"
                  onMinus={() => handleEstimatedHoursChange(formData.estimatedHours - 1)}
                  onPlus={() => handleEstimatedHoursChange(formData.estimatedHours + 1)}
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

          {/* Right Column: OpenStreetMap Map with on-map suggestions & direct map clicking */}
          <div className="lg:col-span-6 xl:col-span-5 flex">
            <TripMap
              pickup={formData.pickupLocation}
              destination={formData.destination}
              activeSearch={activeSearch}
              onSelectSuggestion={handleSelectSuggestion}
              onMapClickLocation={handleMapClick}
              onCloseSearch={() => setActiveSearch(null)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
