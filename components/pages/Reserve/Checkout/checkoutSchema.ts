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
      const cleanCard = (data.cardNumber || "").replace(/\s+/g, "");
      if (!cleanCard || cleanCard.length < 13) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cardNumber"],
          message: "Please enter a valid card number",
        });
      }

      if (!data.cardholderName || data.cardholderName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cardholderName"],
          message: "Please enter cardholder name",
        });
      }

      if (!data.expiry || !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(data.expiry.trim())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["expiry"],
          message: "Use format MM/YY",
        });
      }

      if (!data.cvv || !/^[0-9]{3,4}$/.test(data.cvv.trim())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cvv"],
          message: "Enter 3 or 4 digit CVV",
        });
      }
    }
  });

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
