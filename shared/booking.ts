import type { BookingDetails } from "@/components/pages/Reserve/Checkout/BookingSummary";
import type { TripDetailsFormData } from "@/components/pages/Reserve/TripDetails/tripSchema";
import { SERVICE_TYPE_OPTIONS } from "@/components/pages/Reserve/TripDetails/tripSchema";
import type { Vehicle } from "@/components/general/Cards/SelectVehicleCard";

const TRIP_KEY = "zlux_booking_trip";
const VEHICLE_KEY = "zlux_booking_vehicle";

function readStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    return;
  }
}

export function persistTripDetails(trip: TripDetailsFormData): void {
  writeStorage(TRIP_KEY, JSON.stringify(trip));
}

export function persistVehicle(vehicle: Vehicle): void {
  writeStorage(VEHICLE_KEY, JSON.stringify(vehicle));
}

function serviceLabel(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return SERVICE_TYPE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function buildBookingDetails(): BookingDetails | undefined {
  const tripRaw = readStorage(TRIP_KEY);
  const vehicleRaw = readStorage(VEHICLE_KEY);
  if (!tripRaw && !vehicleRaw) return undefined;

  let trip: TripDetailsFormData | undefined;
  let vehicle: Vehicle | undefined;
  try {
    if (tripRaw) trip = JSON.parse(tripRaw) as TripDetailsFormData;
    if (vehicleRaw) vehicle = JSON.parse(vehicleRaw) as Vehicle;
  } catch {
    return undefined;
  }

  const details: BookingDetails = {
    pickup: trip?.pickupLocation,
    destination: trip?.destination,
    date: trip?.date,
    time: trip?.pickupTime,
    service: serviceLabel(trip?.serviceType),
    vehicleName: vehicle?.name,
    vehicleCapacity: vehicle ? `${vehicle.passengers} Passengers` : undefined,
    vehicleImage: vehicle?.image,
    estimatedTotal: vehicle?.price,
  };
  return details;
}