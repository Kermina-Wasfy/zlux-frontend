"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import BookingSummary, { BookingDetails } from "../Checkout/BookingSummary";
import BookingReferenceCard from "./BookingReferenceCard";
import WhatHappensNext from "./WhatHappensNext";
import Button from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { buildBookingDetails, getBooking, bookingToBookingDetails } from "@/shared/booking";
import { fetchBookingByReference } from "@/api/bookingByReference";

interface MainOrderCofirmationProps {
  bookingReference?: string;
  bookingDetails?: BookingDetails;
}

export default function MainOrderCofirmation({
  bookingReference = "APX-L9AG-7728",
  bookingDetails: bookingDetailsProp,
}: MainOrderCofirmationProps) {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | undefined>(bookingDetailsProp);
  const [reference, setReference] = useState<string | undefined>(bookingReference);
  const [isFetchingBooking, setIsFetchingBooking] = useState(false);

  useEffect(() => {
    const stored = buildBookingDetails();
    setBookingDetails(stored ?? bookingDetailsProp);
    const booking = getBooking();
    const resolved = booking?.bookingReference || bookingReference || undefined;
    if (booking?.bookingReference) {
      setReference(booking.bookingReference);
    }
    if (resolved) {
      let active = true;
      setIsFetchingBooking(true);
      fetchBookingByReference(resolved)
        .then((serverBooking) => {
          if (active) setBookingDetails(bookingToBookingDetails(serverBooking));
        })
        .catch(() => {
          // keep locally-stored details when the lookup fails
        })
        .finally(() => {
          if (active) setIsFetchingBooking(false);
        });
      return () => {
        active = false;
      };
    }
  }, [bookingDetailsProp, bookingReference]);
  return (
    <section className="w-full min-h-screen bg-[#0D0D0D] py-12 md:py-16 px-4 flex flex-col items-center justify-center">
      <div className="w-full mx-auto flex flex-col items-center">
        {/* Top Gold Checkmark Circle */}
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-primary flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.15)]">
          <Check className="w-7 h-7 md:w-8 md:h-8 text-primary" strokeWidth={2} />
        </div>

        {/* Small Category / Status Title */}
        <span className="text-[16px] md:text-[32px] font-[600] text-primary font-montserrat tracking-tight mt-6 mb-2">
          Reservation Confirmed
        </span>

        {/* Main Heading */}
        <h1 className="text-[20px] sm:text-[32px] md:text-[48px] font-[700] text-[#E5E4E2] font-montserrat tracking-tight text-center mb-1">
          Your Chauffeur is Reserved.
        </h1>

        {/* Description Subtitle */}
        <p className="text-[16px] md:text-[20px] text-[#C7C6C4] font-inter font-[700] text-center leading-relaxed mb-14">
          A Confirmation Has Been Sent To Your Email. Your Driver Will Contact You 2 Hours Before Pickup.
        </p>

        {/* 1. Booking Reference Box */}
        <BookingReferenceCard reference={reference} className="mb-10" />

        {/* 2. Booking Summary Card (reused from Checkout, with showTotal={false}) */}
        <div className="w-full mb-6 max-w-[750px]" aria-busy={isFetchingBooking && !bookingDetails}>
          {isFetchingBooking && !bookingDetails ? (
            <div className="w-full bg-[#151515] pb-4 md:pb-6 border border-gold-deep flex flex-col">
              <Skeleton className="h-[180px] sm:h-[210px] md:h-[240px] w-full rounded-none" />
              <div className="px-4 md:px-6 py-4 space-y-3">
                <Skeleton className="h-[22px] w-2/3" />
                <Skeleton className="h-[16px] w-1/2" />
                <Skeleton className="h-[16px] w-full" />
                <Skeleton className="h-[16px] w-3/4" />
                <Skeleton className="h-[16px] w-2/3" />
                <Skeleton className="h-[16px] w-1/2" />
                <Skeleton className="h-[16px] w-3/4" />
              </div>
            </div>
          ) : (
            <BookingSummary details={bookingDetails} showTotal={false} />
          )}
        </div>

        {/* 3. What Happens Next Card */}
        <WhatHappensNext className="mb-6" />

        {/* 4. Action Buttons (Back To Home & Reserve Now) */}
        <div className="max-w-[750px] grid grid-cols-2 gap-4 w-full">
          <Link
            href="/"
            className="w-full h-[48px] md:h-[52px] rounded-[8px] bg-[#151515] border border-gold-deep hover:border-primary text-primary font-inter font-[600] text-[16px] md:text-[20px] transition-all duration-300 flex items-center justify-center cursor-pointer"
          >
            Back To Home
          </Link>

          <Button
            href="/reserve"
            className="w-full font-inter font-[600] text-[16px] md:text-[20px] transition-all duration-300 flex items-center justify-center cursor-pointer"
          >
            Reserve Now
          </Button>
        </div>
      </div>
    </section>
  );
}
