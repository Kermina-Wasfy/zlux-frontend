"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  CardElement,
  useStripe,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Input from "@/components/ui/Input";
import { CheckoutFormData } from "./checkoutSchema";
import Button from "@/components/ui/Button";
import { Loader2, ShieldCheck, AlertCircle, ShieldAlert, CreditCard, ExternalLink } from "lucide-react";

const PAYPAL_CLIENT_ID =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim() ||
  "BAAs34JruzzDy07jKYBE8SsalOVWRj71771hueMPb9jPAPcbaSO74bkBGwtsmrmwbQYjSot32QpFy54raQ";

interface PaymentMethodProps {
  formData: CheckoutFormData;
  errors: Partial<Record<keyof CheckoutFormData, string>>;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
  isSubmitting: boolean;
  estimatedTotal?: number;
  clientSecret?: string | null;
  bookingId?: string;
  onApplePaySuccess?: (paymentIntentId: string) => void;
  onApplePayError?: (message: string) => void;
  onPayPalSuccess?: (orderId?: string) => void;
  onPayPalError?: (message: string) => void;
  onBeforePayment?: () => Promise<boolean>;
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
  bookingId,
  onApplePaySuccess,
  onApplePayError,
  onPayPalSuccess,
  onPayPalError,
  onBeforePayment,
}: PaymentMethodProps) {
  const stripe = useStripe();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [canMakeApplePay, setCanMakeApplePay] = useState<boolean | null>(null);
  const [diagnosticReason, setDiagnosticReason] = useState<
    "insecure_http" | "no_card_or_unregistered_domain" | "unsupported_browser" | null
  >(null);
  const [currentDomain, setCurrentDomain] = useState<string>("");

  // Keep references to volatile props to avoid recreating the Stripe PaymentRequest on re-renders
  const clientSecretRef = useRef(clientSecret);
  clientSecretRef.current = clientSecret;

  const onApplePaySuccessRef = useRef(onApplePaySuccess);
  onApplePaySuccessRef.current = onApplePaySuccess;

  const onApplePayErrorRef = useRef(onApplePayError);
  onApplePayErrorRef.current = onApplePayError;

  const onPayPalSuccessRef = useRef(onPayPalSuccess);
  onPayPalSuccessRef.current = onPayPalSuccess;

  const onPayPalErrorRef = useRef(onPayPalError);
  onPayPalErrorRef.current = onPayPalError;

  const onBeforePaymentRef = useRef(onBeforePayment);
  onBeforePaymentRef.current = onBeforePayment;

  // Setup Apple Pay PaymentRequest once when stripe is initialized
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentDomain(window.location.host);
    }

    if (!stripe) return;

    // Detect browser & environment capabilities
    const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
    const isLocalhost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasApplePaySession = typeof window !== "undefined" && "ApplePaySession" in window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hardwareCanPay =
      hasApplePaySession &&
      typeof (window as any).ApplePaySession?.canMakePayments === "function" &&
      (window as any).ApplePaySession.canMakePayments();
    const isAppleDevice =
      typeof navigator !== "undefined" && /Macintosh|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isSafari =
      typeof navigator !== "undefined" &&
      (/^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
        /iPhone|iPad|iPod/i.test(navigator.userAgent)) &&
      !/crios/i.test(navigator.userAgent);

    console.info("[Apple Pay Diagnostic]", {
      isHttps,
      isLocalhost,
      isAppleDevice,
      isSafari,
      hasApplePaySession,
      hardwareCanPay,
    });

    const amountInCents = Math.max(100, Math.round((estimatedTotal || 150) * 100));

    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: "ZLUX Private Chauffeur",
        amount: amountInCents,
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
    });

    pr.canMakePayment()
      .then((result) => {
        console.info("[Apple Pay Diagnostic] canMakePayment result:", result);
        if (result && result.applePay) {
          setPaymentRequest(pr);
          setCanMakeApplePay(true);
          setDiagnosticReason(null);
        } else {
          setCanMakeApplePay(false);
          if (!isHttps && !isLocalhost) {
            setDiagnosticReason("insecure_http");
          } else if (hardwareCanPay || isSafari || isAppleDevice) {
            setDiagnosticReason("no_card_or_unregistered_domain");
          } else {
            setDiagnosticReason("unsupported_browser");
          }
        }
      })
      .catch((err) => {
        console.warn("[Apple Pay Diagnostic] canMakePayment error:", err);
        setCanMakeApplePay(false);
        if (!isHttps && !isLocalhost) {
          setDiagnosticReason("insecure_http");
        } else if (hardwareCanPay || isSafari || isAppleDevice) {
          setDiagnosticReason("no_card_or_unregistered_domain");
        } else {
          setDiagnosticReason("unsupported_browser");
        }
      });

    pr.on("paymentmethod", async (ev) => {
      const secret = clientSecretRef.current;
      if (!secret) {
        ev.complete("fail");
        onApplePayErrorRef.current?.("Payment session could not be initialized. Please try again.");
        return;
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        secret,
        { payment_method: ev.paymentMethod.id },
        { handleActions: false }
      );

      if (error) {
        ev.complete("fail");
        onApplePayErrorRef.current?.(error.message || "Apple Pay payment failed.");
      } else {
        ev.complete("success");
        if (paymentIntent && paymentIntent.id) {
          onApplePaySuccessRef.current?.(paymentIntent.id);
        }
      }
    });
  }, [stripe]);

  // Dynamically update payment request total if booking details or price change
  useEffect(() => {
    if (paymentRequest && estimatedTotal) {
      try {
        paymentRequest.update({
          total: {
            label: "ZLUX Private Chauffeur",
            amount: Math.max(100, Math.round(estimatedTotal * 100)),
          },
        });
      } catch (err) {
        console.warn("Could not update PaymentRequest total:", err);
      }
    }
  }, [paymentRequest, estimatedTotal]);

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
            diagnosticReason === "insecure_http" ? (
              <div className="py-5 px-5 rounded-[8px] bg-[#101010] border border-gold-deep/60 text-left space-y-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-platinum font-inter font-[600] text-[15px]">
                      HTTPS Connection Required for Apple Pay
                    </p>
                    <p className="text-silver font-inter text-[13px] mt-1 leading-relaxed">
                      Safari was detected on your Apple device, but Apple strictly disables Apple Pay over unencrypted (HTTP) connections.
                    </p>
                  </div>
                </div>

                <div className="bg-[#181818] p-3.5 rounded-[6px] border border-white/5 space-y-2 text-[12px] font-inter text-silver">
                  <p className="text-platinum font-[500]">How to resolve:</p>
                  <ul className="list-disc list-inside space-y-1 text-[#A0A0A0]">
                    <li>
                      When testing locally from an iPhone or Mac, serve the site over HTTPS (e.g. via <code className="text-primary font-mono">ngrok</code> or Next.js experimental HTTPS).
                    </li>
                    <li>
                      In production or staging, ensure you are browsing via <code className="text-primary font-mono">https://</code>.
                    </li>
                  </ul>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => onChange("paymentMethod", "credit_card")}
                    className="px-4 py-2.5 rounded-[6px] bg-primary text-black font-inter font-[600] text-[13px] hover:bg-primary/90 transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Switch to Credit Card</span>
                  </button>
                </div>
              </div>
            ) : diagnosticReason === "no_card_or_unregistered_domain" ? (
              <div className="py-5 px-5 rounded-[8px] bg-[#101010] border border-gold-deep/60 text-left space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-platinum font-inter font-[600] text-[15px]">
                      Safari Detected — Additional Setup Required for Apple Pay
                    </p>
                    <p className="text-silver font-inter text-[13px] mt-1 leading-relaxed">
                      Safari on your Apple device is recognized, but Stripe could not initialize an active Apple Pay session.
                    </p>
                  </div>
                </div>

                <div className="bg-[#181818] p-3.5 rounded-[6px] border border-white/5 space-y-2 text-[12px] font-inter text-silver">
                  <div className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    <span>
                      <strong className="text-platinum">Apple Wallet Card:</strong> Your Apple Wallet must have an active debit or credit card configured on this device.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    <span>
                      <strong className="text-platinum">Stripe Domain Verification:</strong> The domain <code className="text-primary font-mono">{currentDomain || "your domain"}</code> must be registered in your{" "}
                      <a
                        href="https://dashboard.stripe.com/settings/payments/apple_pay"
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-primary hover:text-primary/80 inline-flex items-center gap-1"
                      >
                        <span>Stripe Dashboard</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span>
                    <span>
                      <strong className="text-platinum">Safari Privacy:</strong> Ensure you are not using a Private Browsing window, and that <em className="text-silver">Allow websites to check for Apple Pay</em> is enabled in Safari preferences.
                    </span>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => onChange("paymentMethod", "credit_card")}
                    className="px-4 py-2.5 rounded-[6px] bg-primary text-black font-inter font-[600] text-[13px] hover:bg-primary/90 transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Switch to Credit Card</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 px-4 rounded-[8px] bg-[#101010] border border-gold-deep/60 text-center space-y-2">
                <p className="text-platinum font-inter font-[600] text-[15px]">
                  Apple Pay Not Available On This Device / Browser
                </p>
                <p className="text-silver font-inter text-[13px]">
                  Apple Pay is supported on <strong>Safari</strong> on iOS and macOS with an active card set up in Apple Wallet.
                </p>
                <button
                  type="button"
                  onClick={() => onChange("paymentMethod", "credit_card")}
                  className="mt-3 text-primary hover:underline text-[13px] font-inter cursor-pointer inline-flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Switch to Credit Card</span>
                </button>
              </div>
            )
          ) : (
            <div className="py-6 text-center text-silver font-inter text-[14px] flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Checking Apple Pay availability...</span>
            </div>
          )}
        </div>
      )}

      {/* PayPal Integration */}
      {formData.paymentMethod === "paypal" && (
        <div className="px-4 md:px-6 py-4 animate-in fade-in duration-200">
          <div className="mb-4">
            <p className="text-silver font-inter text-[14px]">
              Click the PayPal button below to complete your payment securely with your PayPal account or debit/credit card.
            </p>
          </div>
          <div className="w-full max-w-[480px] mx-auto min-h-[150px]">
            <PayPalScriptProvider
              options={{
                clientId: PAYPAL_CLIENT_ID,
                "client-id": PAYPAL_CLIENT_ID,
                currency: "USD",
                intent: "capture",
              }}
            >
              <PayPalButtons
                style={{
                  layout: "vertical",
                  color: "gold",
                  shape: "rect",
                  label: "pay",
                  height: 48,
                }}
                onClick={async (data, actions) => {
                  if (onBeforePaymentRef.current) {
                    const isValid = await onBeforePaymentRef.current();
                    if (!isValid) {
                      return actions.reject();
                    }
                  }
                  return actions.resolve();
                }}
                createOrder={async (data, actions) => {
                  // 1. Try to request Order ID from backend if endpoint is available
                  try {
                    const res = await fetch("/api/paypal/create-order", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        amount: estimatedTotal || 150,
                        bookingId,
                      }),
                    });
                    if (res.ok) {
                      const resData = await res.json();
                      if (resData?.id) {
                        return resData.id;
                      }
                    }
                  } catch (err) {
                    console.warn(
                      "Backend /api/paypal/create-order not reachable, falling back to client-side order creation:",
                      err
                    );
                  }

                  // 2. Client-side fallback if backend endpoint is not implemented
                  return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                      {
                        description: "ZLUX Private Chauffeur Reservation",
                        amount: {
                          currency_code: "USD",
                          value: Number(estimatedTotal || 150).toFixed(2),
                        },
                      },
                    ],
                  });
                }}
                onApprove={async (data, actions) => {
                  // 1. Try to verify/capture with backend if endpoint is available
                  try {
                    const res = await fetch("/api/paypal/capture-order", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        orderID: data.orderID,
                        bookingId,
                      }),
                    });
                    if (res.ok) {
                      const result = await res.json();
                      if (result.status === "success" || result.status === "COMPLETED") {
                        onPayPalSuccessRef.current?.(data.orderID);
                        return;
                      }
                    }
                  } catch (err) {
                    console.warn(
                      "Backend /api/paypal/capture-order not reachable, executing client-side capture:",
                      err
                    );
                  }

                  // 2. Client-side fallback capture
                  try {
                    if (actions.order) {
                      await actions.order.capture();
                    }
                    onPayPalSuccessRef.current?.(data.orderID);
                  } catch (captureErr: unknown) {
                    console.error("PayPal capture error:", captureErr);
                    const errorMsg =
                      captureErr instanceof Error
                        ? captureErr.message
                        : "فشلت عملية الدفع عبر PayPal";
                    onPayPalErrorRef.current?.(errorMsg);
                  }
                }}
                onError={(err) => {
                  console.error("PayPal error:", err);
                  onPayPalErrorRef.current?.("فشلت عملية الدفع عبر PayPal");
                }}
                onCancel={() => {
                  console.info("PayPal checkout was cancelled by user.");
                }}
              />
            </PayPalScriptProvider>
          </div>
        </div>
      )}

      {/* Confirm Reservation CTA Button */}
      <div className="pt-16">
        {formData.paymentMethod === "apple_pay" && canMakeApplePay === false ? (
          <Button
            type="button"
            onClick={() => onChange("paymentMethod", "credit_card")}
            className="w-full h-[52px] px-8 rounded-[8px] bg-gradient-primary font-inter font-[600] text-[16px] md:text-[20px] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5 text-black" />
            <span>Switch to Credit Card to Continue</span>
          </Button>
        ) : formData.paymentMethod === "paypal" ? (
          <div className="p-4 rounded-[8px] bg-[#101010] border border-gold-deep/40 text-center">
            <p className="text-silver font-inter text-[14px]">
              Please complete your reservation by authorizing with the <strong className="text-primary">PayPal</strong> button above.
            </p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
