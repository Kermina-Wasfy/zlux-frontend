import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() || "";
    if (!key) {
      console.warn(
        "Stripe Publishable Key is missing. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local"
      );
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};
