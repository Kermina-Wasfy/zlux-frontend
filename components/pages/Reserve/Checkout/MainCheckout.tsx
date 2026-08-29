"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";
import PassengerInformation from "./PassengerInformation";
import PaymentMethod from "./PaymentMethod";
import BookingSummary, { BookingDetails } from "./BookingSummary";
import SideNote from "./SideNote";
import { checkoutSchema, CheckoutFormData } from "./checkoutSchema";
import { buildBookingDetails, getBooking, persistBooking } from "@/shared/booking";
import { updatePassengerInfo } from "@/api/passengerInfo";
import { createPaymentIntent } from "@/api/createPaymentIntent";
import { confirmPayment } from "@/api/confirmPayment";
import { confirmBooking } from "@/api/confirmBooking";

interface MainCheckoutProps {
  initialBookingDetails?: BookingDetails;
  onConfirm?: (data: CheckoutFormData) => void;
}

function MainCheckoutForm({
  initialBookingDetails,
  onConfirm,
}: MainCheckoutProps) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

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
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Initialize booking details and pre-fetch PaymentIntent clientSecret
  useEffect(() => {
    const stored = buildBookingDetails();
    setBookingDetails(stored ?? initialBookingDetails);

    const booking = getBooking();
    if (booking && booking._id) {
      createPaymentIntent(booking._id, booking.accessToken)
        .then((res) => {
          if (res?.clientSecret) {
            setClientSecret(res.clientSecret);
          }
        })
        .catch((err) => {
          console.warn("Could not pre-fetch payment intent:", err?.message || err);
        });
    }
  }, [initialBookingDetails]);

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for field on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Common finalize flow after successful Stripe payment authorization
  const handlePaymentCompletion = async (paymentIntentId: string, booking: ReturnType<typeof getBooking>) => {
    if (!booking) return;

    try {
      // Step 6: Confirm payment in backend (updates paymentStatus to 'paid')
      await confirmPayment(
        {
          bookingId: booking._id,
          paymentIntentId,
        },
        booking.accessToken
      );

      // Step 7: Confirm booking in backend with x-booking-token (updates status to 'confirmed')
      const confirmedBooking = await confirmBooking(booking._id, booking.accessToken);
      if (confirmedBooking) {
        persistBooking(confirmedBooking);
      }

      toast.success("Reservation confirmed! Your chauffeur is booked.");

      if (onConfirm) {
        onConfirm(formData);
      } else {
        router.push("/reserve/confirmation");
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to record confirmed booking in backend.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validate and save passenger information
  const savePassengerInfo = async (): Promise<boolean> => {
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
      toast.error("Please fill in all required passenger fields correctly.");
      return false;
    }

    setErrors({});

    const booking = getBooking();
    if (!booking) {
      toast.error("No active booking found. Please start your reservation again.");
      return false;
    }

    try {
      const updated = await updatePassengerInfo(booking._id, booking.accessToken, {
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        email: result.data.email,
        phone: result.data.phone,
        passengerCount: Number(result.data.passengerCount) || 1,
        flightNumber: result.data.flightNumber || "",
        specialRequests: result.data.specialRequests || "",
      });
      persistBooking(updated);
      return true;
    } catch {
      toast.error("We couldn't save your passenger information. Please check your connection.");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1 & 2. Validate and Save Passenger Information
    const saved = await savePassengerInfo();
    if (!saved) {
      setIsSubmitting(false);
      return;
    }

    const booking = getBooking();
    if (!booking) {
      setIsSubmitting(false);
      toast.error("No active booking found. Please start your reservation again.");
      return;
    }

    // 3. Process Payment
    if (formData.paymentMethod === "credit_card") {
      if (!stripe || !elements) {
        setIsSubmitting(false);
        toast.error("Stripe payment gateway is still initializing. Please wait a moment.");
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setIsSubmitting(false);
        toast.error("Card input element was not found. Please refresh.");
        return;
      }

      // Ensure clientSecret is available
      let secret = clientSecret;
      if (!secret) {
        try {
          const intentRes = await createPaymentIntent(booking._id, booking.accessToken);
          secret = intentRes.clientSecret;
          setClientSecret(secret);
        } catch {
          setIsSubmitting(false);
          toast.error("Could not initiate payment with the server. Please try again.");
          return;
        }
      }

      // Step 5: Direct browser-to-Stripe confirmation (Front <-> Stripe)
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.cardholderName || `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
          },
        },
      });

      if (stripeError) {
        setIsSubmitting(false);
        toast.error(stripeError.message || "Payment authorization failed. Please check your card.");
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        await handlePaymentCompletion(paymentIntent.id, booking);
      } else {
        setIsSubmitting(false);
        toast.error("Payment status is incomplete. Please contact support.");
      }
    } else if (formData.paymentMethod === "apple_pay") {
      setIsSubmitting(false);
      toast.info("Please use the Apple Pay button above to authenticate with your device.");
    } else if (formData.paymentMethod === "paypal") {
      setIsSubmitting(false);
      toast.info("Please use the PayPal button above to complete your transaction.");
    }
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
                estimatedTotal={
                  typeof bookingDetails?.estimatedTotal === "number"
                    ? bookingDetails.estimatedTotal
                    : parseFloat(String(bookingDetails?.estimatedTotal || "150").replace(/[^0-9.]/g, "")) || 150
                }
                clientSecret={clientSecret}
                bookingId={getBooking()?._id}
                onBeforePayment={savePassengerInfo}
                onApplePaySuccess={(intentId) => {
                  const currentBooking = getBooking();
                  if (currentBooking) {
                    handlePaymentCompletion(intentId, currentBooking);
                  }
                }}
                onApplePayError={(msg) => {
                  toast.error(msg);
                }}
                onPayPalSuccess={(orderId) => {
                  const currentBooking = getBooking();
                  if (currentBooking) {
                    handlePaymentCompletion(orderId || "PAYPAL_ORDER", currentBooking);
                  }
                }}
                onPayPalError={(msg) => {
                  toast.error(msg);
                }}
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

export default function MainCheckout(props: MainCheckoutProps) {
  const [stripePromise] = useState(() => getStripe());

  return (
    <Elements stripe={stripePromise}>
      <MainCheckoutForm {...props} />
    </Elements>
  );
}
