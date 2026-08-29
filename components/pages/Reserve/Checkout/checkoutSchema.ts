import { z } from "zod";

export const checkoutSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name is required"),
    lastName: z
      .string()
      .trim()
      .min(2, "Last name is required"),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address"),
    phone: z
      .string()
      .trim()
      .min(7, "Please enter a valid phone number"),
    passengerCount: z
      .string()
      .min(1, "Please select passenger count"),
    flightNumber: z.string().optional(),
    specialRequests: z.string().optional(),

    paymentMethod: z.enum(["credit_card", "apple_pay", "paypal"]),

    // Credit Card Fields
    cardNumber: z.string().optional(),
    cardholderName: z.string().optional(),
    expiry: z.string().optional(),
    cvv: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === "credit_card") {
      if (!data.cardholderName || data.cardholderName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cardholderName"],
          message: "Please enter cardholder name",
        });
      }
    }
  });

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
