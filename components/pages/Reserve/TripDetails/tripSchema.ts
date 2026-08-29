import { z } from "zod";

export const locationDataSchema = z.object({
  address: z.string().trim().min(3, "Please enter a valid address"),
  lat: z.number(),
  lng: z.number(),
});

export type LocationData = z.infer<typeof locationDataSchema>;

export const tripDetailsSchema = z.object({
  pickupLocation: locationDataSchema
    .nullable()
    .refine((val): val is LocationData => val !== null && val.address.trim().length >= 3, {
      message: "Please select a valid pickup location",
    }),
  destination: locationDataSchema
    .nullable()
    .refine((val): val is LocationData => val !== null && val.address.trim().length >= 3, {
      message: "Please select a valid destination",
    }),
  date: z.string().trim().min(1, "Please select a journey date"),
  pickupTime: z.string().trim().min(1, "Please select a pickup time"),
  serviceType: z.string().min(1, "Please select a service type"),
  passengers: z
    .coerce
    .number()
    .int()
    .min(1, "Enter the number of passengers")
    .max(16, "Maximum 16 passengers"),
  estimatedHours: z
    .coerce
    .number()
    .int()
    .min(1, "Enter estimated hours")
    .max(24, "Maximum 24 hours"),
});

export interface TripDetailsFormData {
  pickupLocation: LocationData | null;
  destination: LocationData | null;
  date: string;
  pickupTime: string;
  serviceType: string;
  passengers: number;
  estimatedHours: number;
}

export const SERVICE_TYPE_OPTIONS = [
  { value: "airport", label: "Airport" },
  { value: "point_to_point", label: "Point-to-Point" },
  { value: "corporate", label: "Corporate" },
  { value: "special-events", label: "Special Events" },
];
