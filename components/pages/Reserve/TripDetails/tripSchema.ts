import { z } from "zod";

export const tripDetailsSchema = z.object({
  pickupLocation: z
    .string()
    .trim()
    .min(3, "Please enter a valid pickup location (min 3 characters)"),
  destination: z
    .string()
    .trim()
    .min(3, "Please enter a valid destination (min 3 characters)"),
  date: z
    .string()
    .trim()
    .min(1, "Please select a journey date"),
  pickupTime: z
    .string()
    .trim()
    .min(1, "Please select a pickup time"),
  serviceType: z
    .string()
    .min(1, "Please select a service type"),
});

export type TripDetailsFormData = z.infer<typeof tripDetailsSchema>;

export const SERVICE_TYPE_OPTIONS = [
  { value: "point_to_point", label: "Point-to-Point" },
  { value: "hourly", label: "Hourly / As Directed" },
  { value: "airport_transfer", label: "Airport Transfer" },
  { value: "city_to_city", label: "City-to-City" },
];
