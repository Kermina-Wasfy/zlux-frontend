"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import PassengerInformation from "./PassengerInformation";
import PaymentMethod from "./PaymentMethod";
import BookingSummary, { BookingDetails } from "./BookingSummary";
import SideNote from "./SideNote";
import { checkoutSchema, CheckoutFormData } from "./checkoutSchema";

interface MainCheckoutProps {
  initialBookingDetails?: BookingDetails;
  onConfirm?: (data: CheckoutFormData) => void;
}

export default function MainCheckout({
  initialBookingDetails,
  onConfirm,
}: MainCheckoutProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    passengerCount: "1",
    flightNumber: "",
    specialRequests: "",
    paymentMethod: "credit_card",
    cardNumber: "",
    cardholderName: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for field on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = checkoutSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof CheckoutFormData;
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
    toast.success("Reservation confirmed! A confirmation email has been sent.");

    if (onConfirm) {
      onConfirm(result.data);
    }
    setIsSubmitting(false);
  };

  return (
    <section className="w-full pb-16 pt-4 bg-[#0D0D0D]">
      <div className="container mx-auto">
        {/* Section Heading */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-[20px] md:text-[40px] font-[600] text-primary font-montserrat tracking-tight mb-3">
            Passenger &amp; Payment
          </h1>
          <p className="text-[14px] md:text-[20px] text-silver font-inter font-[600]">
            Secure Checkout. Your Information Is Encrypted And Never Stored.
          </p>
        </div>

        {/* Two Column Layout */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-20 items-start">
            {/* Left Column: Passenger Information & Payment Method */}
            <div className="lg:col-span-7 xl:col-span-7 flex flex-col gap-6">
              <PassengerInformation
                formData={formData}
                errors={errors}
                onChange={handleChange}
              />

              <PaymentMethod
                formData={formData}
                errors={errors}
                onChange={handleChange}
              />

              {/* Confirm Reservation CTA Button */}
              <div className="pt-2">
                <Button
                  className="w-full h-[52px] px-8 rounded-[8px] bg-gradient-primary font-inter font-[600] text-[16px] md:text-[20px] transition-all duration-300 hover:brightness-110 hover:shadow-[0_4px_25px_rgba(197,160,89,0.35)] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
                >
                  {isSubmitting ? "Confirming..." : "Confirm Reservation"}
                </Button>
              </div>
            </div>

            {/* Right Column: Booking Summary & Side Note */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-5">
              <BookingSummary details={initialBookingDetails} />
              <SideNote />
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
