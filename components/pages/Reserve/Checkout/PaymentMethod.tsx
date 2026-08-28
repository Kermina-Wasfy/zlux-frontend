"use client";

import React from "react";
import Input from "@/components/ui/Input";
import { CheckoutFormData } from "./checkoutSchema";
import Button from "@/components/ui/Button";

interface PaymentMethodProps {
  formData: CheckoutFormData;
  errors: Partial<Record<keyof CheckoutFormData, string>>;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
  isSubmitting: boolean;
}

export default function PaymentMethod({
  formData,
  errors,
  onChange,
  isSubmitting,
}: PaymentMethodProps) {
  // Format card number with spaces (4 4 4 4)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
    onChange("cardNumber", formatted);
  };

  // Format expiry MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    onChange("expiry", raw);
  };

  // CVV digits only
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    onChange("cvv", raw);
  };

  return (
    <div className="w-full bg-[#151515] pt-4 md:pt-6">
      {/* Title */}
      <h2 className="px-4 md:px-6 text-[20px] font-[700] text-platinum font-montserrat tracking-tight mb-7">
        Payment Method
      </h2>

      {/* Payment Method Selector Pills */}
      <div className="px-4 md:px-6 grid grid-cols-3 gap-3 mb-6">
        <button
          type="button"
          onClick={() => onChange("paymentMethod", "credit_card")}
          className={`h-[48px] rounded-[8px] text-primary font-inter text-[14px] md:text-[20px] font-[600] transition-all cursor-pointer flex items-center justify-center ${
            formData.paymentMethod === "credit_card"
              ? "border border-primary bg-transparent shadow-[0_0_12px_rgba(197,160,89,0.2)]"
              : "border border-gold-deep bg-transparent hover:border-primary/50"
          }`}
        >
          Credit Card
        </button>
        <button
          type="button"
          onClick={() => onChange("paymentMethod", "apple_pay")}
          className={`h-[48px] rounded-[8px] text-primary font-inter text-[14px] md:text-[20px] font-[600] transition-all cursor-pointer flex items-center justify-center ${
            formData.paymentMethod === "apple_pay"
              ? "border border-primary bg-transparent shadow-[0_0_12px_rgba(197,160,89,0.2)]"
              : "border border-gold-deep bg-transparent hover:border-primary/50"
          }`}
        >
          Apple Pay
        </button>
        <button
          type="button"
          onClick={() => onChange("paymentMethod", "paypal")}
          className={`h-[48px] rounded-[8px] text-primary font-inter text-[14px] md:text-[20px] font-[600] transition-all cursor-pointer flex items-center justify-center ${
            formData.paymentMethod === "paypal"
              ? "border border-primary bg-transparent shadow-[0_0_12px_rgba(197,160,89,0.2)]"
              : "border border-gold-deep bg-transparent hover:border-primary/50"
          }`}
        >
          Paypal
        </button>
      </div>

      {/* Credit Card Input Form */}
      {formData.paymentMethod === "credit_card" && (
        <div className="px-4 md:px-6 space-y-6 animate-in fade-in duration-200">
          {/* Card Number */}
          <Input
            label="Card Number"
            placeholder="**** **** **** ****"
            value={formData.cardNumber || ""}
            onChange={handleCardNumberChange}
            maxLength={19}
            error={errors.cardNumber}
          />

          {/* Cardholder Name */}
          <Input
            label="Cardholder Name"
            placeholder="Enter Cardholder Name"
            value={formData.cardholderName || ""}
            onChange={(e) => onChange("cardholderName", e.target.value)}
            error={errors.cardholderName}
          />

          {/* Expiry & CVV */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expiry"
              placeholder="MM/YY"
              value={formData.expiry || ""}
              onChange={handleExpiryChange}
              maxLength={5}
              error={errors.expiry}
            />
            <Input
              label="CVV"
              placeholder="***"
              type="password"
              value={formData.cvv || ""}
              onChange={handleCvvChange}
              maxLength={4}
              error={errors.cvv}
            />
          </div>
        </div>
      )}

      {/* Alternative Gateways Notice */}
      {formData.paymentMethod === "apple_pay" && (
        <div className="mx-4 md:mx-6 py-6 px-4 rounded-[8px] bg-transparent border border-gold-deep text-center text-silver font-inter text-[14px]">
          You will be prompted to authenticate with Apple Pay upon clicking Confirm Reservation.
        </div>
      )}

      {formData.paymentMethod === "paypal" && (
        <div className="mx-4 md:mx-6 py-6 px-4 rounded-[8px] bg-transparent border border-gold-deep text-center text-silver font-inter text-[14px]">
          You will be redirected to PayPal to complete your payment securely.
        </div>
      )}

      {/* Confirm Reservation CTA Button */}
      <div className="pt-20">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-[52px] px-8 rounded-[8px] bg-gradient-primary font-inter font-[600] text-[16px] md:text-[20px] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
        >
          {isSubmitting ? "Confirming..." : "Confirm Reservation"}
        </Button>
      </div>
    </div>
  );
}
