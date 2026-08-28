"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PassengerInformation from "./PassengerInformation";
import PaymentMethod from "./PaymentMethod";
import BookingSummary, { BookingDetails } from "./BookingSummary";
import SideNote from "./SideNote";
import { checkoutSchema, CheckoutFormData } from "./checkoutSchema";
import { buildBookingDetails } from "@/shared/booking";

interface MainCheckoutProps {
  initialBookingDetails?: BookingDetails;
  onConfirm?: (data: CheckoutFormData) => void;
}

export default function MainCheckout({
  initialBookingDetails,
  onConfirm,
}: MainCheckoutProps) {
  const router = useRouter();
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
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | undefined>(initialBookingDetails);

  useEffect(() => {
    const stored = buildBookingDetails();
    setBookingDetails(stored ?? initialBookingDetails);
  }, [initialBookingDetails]);

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
    } else {
      router.push("/reserve/confirmation");
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
            <div className="lg:col-span-7 xl:col-span-7 flex flex-col lg:gap-12 gap-8">
              <PassengerInformation
                formData={formData}
                errors={errors}
                onChange={handleChange}
              />

              <PaymentMethod
                formData={formData}
                errors={errors}
                onChange={handleChange}
                isSubmitting={isSubmitting}
              />
            </div>

            {/* Right Column: Booking Summary & Side Note */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col lg:gap-5 lg:block hidden">
              <BookingSummary details={bookingDetails} />
              <SideNote />
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
