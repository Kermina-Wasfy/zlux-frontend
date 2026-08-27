"use client";

import React from "react";
import Input from "@/components/ui/Input";
import { CheckoutFormData } from "./checkoutSchema";

interface PaymentMethodProps {
  formData: CheckoutFormData;
  errors: Partial<Record<keyof CheckoutFormData, string>>;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
}

export default function PaymentMethod({
  formData,
  errors,
  onChange,
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
    <div className="w-full bg-[#151515] p-4 md:p-6">
      {/* Title */}
      <h2 className="text-[16px] md:text-[20px] font-[700] text-platinum font-inter tracking-tight mb-5">
        Payment Method
      </h2>

      {/* Payment Method Selector Pills */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <button
          type="button"
          onClick={() => onChange("paymentMethod", "credit_card")}
          className={`h-[48px] rounded-[6px] font-inter text-[14px] md:text-[16px] font-[600] transition-all cursor-pointer flex items-center justify-center ${
            formData.paymentMethod === "credit_card"
              ? "border border-primary bg-transparent text-platinum shadow-[0_0_12px_rgba(197,160,89,0.2)]"
              : "border border-gold-deep bg-transparent text-silver hover:border-primary/50"
          }`}
        >
          Credit Card
        </button>
        <button
          type="button"
          onClick={() => onChange("paymentMethod", "apple_pay")}
          className={`h-[48px] rounded-[6px] font-inter text-[14px] md:text-[16px] font-[600] transition-all cursor-pointer flex items-center justify-center ${
            formData.paymentMethod === "apple_pay"
              ? "border border-primary bg-transparent text-platinum shadow-[0_0_12px_rgba(197,160,89,0.2)]"
              : "border border-gold-deep bg-transparent text-silver hover:border-primary/50"
          }`}
        >
          Apple Pay
        </button>
        <button
          type="button"
          onClick={() => onChange("paymentMethod", "paypal")}
          className={`h-[48px] rounded-[6px] font-inter text-[14px] md:text-[16px] font-[600] transition-all cursor-pointer flex items-center justify-center ${
            formData.paymentMethod === "paypal"
              ? "border border-primary bg-transparent text-platinum shadow-[0_0_12px_rgba(197,160,89,0.2)]"
              : "border border-gold-deep bg-transparent text-silver hover:border-primary/50"
          }`}
        >
          Paypal
        </button>
      </div>

      {/* Credit Card Input Form */}
      {formData.paymentMethod === "credit_card" && (
        <div className="space-y-4 animate-in fade-in duration-200">
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
        <div className="py-6 px-4 rounded-[8px] bg-transparent border border-gold-deep text-center text-silver font-inter text-[14px]">
          You will be prompted to authenticate with Apple Pay upon clicking Confirm Reservation.
        </div>
      )}

      {formData.paymentMethod === "paypal" && (
        <div className="py-6 px-4 rounded-[8px] bg-transparent border border-gold-deep text-center text-silver font-inter text-[14px]">
          You will be redirected to PayPal to complete your payment securely.
        </div>
      )}
    </div>
  );
}
