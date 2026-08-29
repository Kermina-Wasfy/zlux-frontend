"use client";

import React, { useEffect, useState } from "react";
import {
  CardElement,
  useStripe,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import Input from "@/components/ui/Input";
import { CheckoutFormData } from "./checkoutSchema";
import Button from "@/components/ui/Button";
import { Loader2, ShieldCheck } from "lucide-react";

interface PaymentMethodProps {
  formData: CheckoutFormData;
  errors: Partial<Record<keyof CheckoutFormData, string>>;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
  isSubmitting: boolean;
  estimatedTotal?: number;
  clientSecret?: string | null;
  onApplePaySuccess?: (paymentIntentId: string) => void;
  onApplePayError?: (message: string) => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#E5E4E2",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#6D6D6D",
      },
      iconColor: "#C5A059",
    },
    invalid: {
      color: "#EF4444",
      iconColor: "#EF4444",
    },
  },
  hidePostalCode: true,
};

export default function PaymentMethod({
  formData,
  errors,
  onChange,
  isSubmitting,
  estimatedTotal = 150,
  clientSecret,
  onApplePaySuccess,
  onApplePayError,
}: PaymentMethodProps) {
  const stripe = useStripe();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [canMakeApplePay, setCanMakeApplePay] = useState<boolean | null>(null);

  // Setup Apple Pay PaymentRequest if supported by browser/device
  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: "ZLUX Private Chauffeur",
        amount: Math.max(100, Math.round((estimatedTotal || 150) * 100)),
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
    });

    pr.canMakePayment().then((result) => {
      if (result && result.applePay) {
        setPaymentRequest(pr);
        setCanMakeApplePay(true);
      } else {
        setCanMakeApplePay(false);
      }
    });

    pr.on("paymentmethod", async (ev) => {
      if (!clientSecret) {
        ev.complete("fail");
        onApplePayError?.("Payment session could not be initialized. Please try again.");
        return;
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        { payment_method: ev.paymentMethod.id },
        { handleActions: false }
      );

      if (error) {
        ev.complete("fail");
        onApplePayError?.(error.message || "Apple Pay payment failed.");
      } else {
        ev.complete("success");
        if (paymentIntent && paymentIntent.id) {
          onApplePaySuccess?.(paymentIntent.id);
        }
      }
    });
  }, [stripe, estimatedTotal, clientSecret, onApplePayError, onApplePaySuccess]);

  return (
    <div className="w-full bg-[#151515] pt-4 md:pt-6">
      {/* Title */}
      <div className="px-4 md:px-6 flex items-center justify-between mb-7">
        <h2 className="text-[20px] font-[700] text-platinum font-montserrat tracking-tight">
          Payment Method
        </h2>
        <div className="flex items-center gap-1.5 text-primary text-[12px] font-inter">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>Stripe 256-bit Encrypted</span>
        </div>
      </div>

      {/* Payment Method Selector Pills */}
      <div className="px-4 md:px-6 grid grid-cols-3 gap-3 mb-6">
        <button
          type="button"
          onClick={() => onChange("paymentMethod", "credit_card")}
          className={`h-[48px] rounded-[8px] text-primary font-inter text-[14px] md:text-[18px] font-[600] transition-all cursor-pointer flex items-center justify-center ${
            formData.paymentMethod === "credit_card"
              ? "border border-primary bg-[#0D0D0D] shadow-[0_0_12px_rgba(197,160,89,0.2)]"
              : "border border-gold-deep bg-transparent hover:border-primary/50"
          }`}
        >
          Credit Card
        </button>
        <button
          type="button"
          onClick={() => onChange("paymentMethod", "apple_pay")}
          className={`h-[48px] rounded-[8px] text-primary font-inter text-[14px] md:text-[18px] font-[600] transition-all cursor-pointer flex items-center justify-center ${
            formData.paymentMethod === "apple_pay"
              ? "border border-primary bg-[#0D0D0D] shadow-[0_0_12px_rgba(197,160,89,0.2)]"
              : "border border-gold-deep bg-transparent hover:border-primary/50"
          }`}
        >
          Apple Pay
        </button>
        <button
          type="button"
          onClick={() => onChange("paymentMethod", "paypal")}
          className={`h-[48px] rounded-[8px] text-primary font-inter text-[14px] md:text-[18px] font-[600] transition-all cursor-pointer flex items-center justify-center ${
            formData.paymentMethod === "paypal"
              ? "border border-primary bg-[#0D0D0D] shadow-[0_0_12px_rgba(197,160,89,0.2)]"
              : "border border-gold-deep bg-transparent hover:border-primary/50"
          }`}
        >
          Paypal
        </button>
      </div>

      {/* Credit Card (Stripe Elements CardElement) */}
      {formData.paymentMethod === "credit_card" && (
        <div className="px-4 md:px-6 space-y-5 animate-in fade-in duration-200">
          {/* Cardholder Name */}
          <Input
            label="Cardholder Name"
            placeholder="Name on card"
            value={formData.cardholderName || ""}
            onChange={(e) => onChange("cardholderName", e.target.value)}
            error={errors.cardholderName}
          />

          {/* Stripe CardElement */}
          <div className="flex flex-col gap-2">
            <label className="text-primary text-[16px] md:text-[20px] font-[500] font-inter tracking-wide">
              Card Details
            </label>
            <div className="w-full h-[52px] px-4 rounded-[8px] bg-[#0D0D0D] border border-gold-deep hover:border-primary/60 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all flex items-center">
              <div className="w-full">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </div>
            </div>
            {errors.cardNumber && (
              <span className="text-red-400 text-[12px] font-inter">
                {errors.cardNumber}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Apple Pay Button / Device Status */}
      {formData.paymentMethod === "apple_pay" && (
        <div className="px-4 md:px-6 py-4 animate-in fade-in duration-200">
          {canMakeApplePay === true && paymentRequest ? (
            <div className="space-y-3">
              <p className="text-silver font-inter text-[14px]">
                Click below to authorize your reservation directly using Touch ID, Face ID, or your Apple Wallet.
              </p>
              <div className="h-[52px] w-full">
                <PaymentRequestButtonElement
                  options={{
                    paymentRequest,
                    style: {
                      paymentRequestButton: {
                        type: "book",
                        theme: "dark",
                        height: "52px",
                      },
                    },
                  }}
                />
              </div>
            </div>
          ) : canMakeApplePay === false ? (
            <div className="py-6 px-4 rounded-[8px] bg-[#101010] border border-gold-deep/60 text-center space-y-2">
              <p className="text-platinum font-inter font-[600] text-[15px]">
                Apple Pay Not Available On This Browser
              </p>
              <p className="text-silver font-inter text-[13px]">
                Apple Pay is supported on <strong>Safari</strong> on iOS and macOS with a card set up in Apple Wallet.
              </p>
              <button
                type="button"
                onClick={() => onChange("paymentMethod", "credit_card")}
                className="mt-3 text-primary hover:underline text-[13px] font-inter cursor-pointer"
              >
                Switch to Credit Card
              </button>
            </div>
          ) : (
            <div className="py-6 text-center text-silver font-inter text-[14px] flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Detecting Apple Pay availability...</span>
            </div>
          )}
        </div>
      )}

      {/* PayPal Notice */}
      {formData.paymentMethod === "paypal" && (
        <div className="mx-4 md:mx-6 py-6 px-4 rounded-[8px] bg-transparent border border-gold-deep text-center text-silver font-inter text-[14px]">
          You will be redirected to PayPal to complete your payment securely.
        </div>
      )}

      {/* Confirm Reservation CTA Button */}
      <div className="pt-16">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-[52px] px-8 rounded-[8px] bg-gradient-primary font-inter font-[600] text-[16px] md:text-[20px] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing Payment...</span>
            </>
          ) : (
            "Confirm Reservation"
          )}
        </Button>
      </div>
    </div>
  );
}
