"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";
import { searchLocations, GeocodeResult } from "@/lib/geocoding";
import type { LocationData } from "@/components/pages/Reserve/TripDetails/tripSchema";

interface LocationInputProps {
  label?: string;
  error?: string;
  value?: LocationData | null;
  proximity?: { lat: number; lng: number } | null;
  onChange?: (value: LocationData | null) => void;
  onSearchChange?: (query: string, suggestions: GeocodeResult[], isLoading: boolean) => void;
  onFocus?: () => void;
  placeholder?: string;
  containerClassName?: string;
}

export default function LocationInput({
  label,
  error,
  value,
  proximity,
  onChange,
  onSearchChange,
  onFocus,
  placeholder = "Address, Airport , Or Hotel",
  containerClassName = "",
}: LocationInputProps) {
  const [inputValue, setInputValue] = useState(value?.address || "");
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Synchronize internal input text when external value changes
  useEffect(() => {
    setInputValue(value?.address || "");
  }, [value?.address]);

  // Geocode address and notify parent so suggestions display on the map
  const runGeocode = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 2) {
      setIsLoading(false);
      onSearchChange?.("", [], false);
      return;
    }

    setIsLoading(true);
    onSearchChange?.(trimmed, [], true);

    try {
      const results = await searchLocations(trimmed);
      setIsLoading(false);
      onSearchChange?.(trimmed, results, false);

      // Auto-set the best match if user hasn't explicitly picked one yet
      if (results.length > 0) {
        const best = results[0];
        onChange?.({
          address: trimmed,
          lat: best.lat,
          lng: best.lng,
        });
      }
    } catch {
      setIsLoading(false);
      onSearchChange?.(trimmed, [], false);
    }
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);

    if (!text.trim()) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      onChange?.(null);
      onSearchChange?.("", [], false);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      runGeocode(text);
    }, 500);
  };

  const handleFocus = () => {
    onFocus?.();
    if (inputValue.trim() && inputValue.trim().length >= 2) {
      runGeocode(inputValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      runGeocode(inputValue);
    }
  };

  const handleClear = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setInputValue("");
    onChange?.(null);
    onSearchChange?.("", [], false);
  };

  return (
    <div className={`flex flex-col w-full ${containerClassName}`}>
      {label && (
        <label className="text-primary text-[16px] md:text-[20px] font-[500] font-inter mb-2 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full h-[52px] px-4 pr-10 overflow-hidden text-ellipsis whitespace-nowrap rounded-[8px] bg-[#0D0D0D] text-[#E5E4E2] font-inter text-[16px] placeholder:text-[#6D6D6D] placeholder:font-inter placeholder:text-[16px] placeholder:overflow-hidden placeholder:text-ellipsis border border-gold-deep transition-all duration-200 outline-none ${
            error
              ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
              : "border-[#453823]/80 hover:border-[#C5A059]/60 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30"
          }`}
        />

        {/* Clear button or loading indicator */}
        <div className="absolute right-3 flex items-center gap-1.5 text-[#8C8273]">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : inputValue ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:text-primary transition-colors cursor-pointer"
              title="Clear"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>
      {error && (
        <span className="text-red-400 text-[12px] mt-1.5 font-inter transition-opacity animate-in fade-in duration-150">
          {error}
        </span>
      )}
    </div>
  );
}
