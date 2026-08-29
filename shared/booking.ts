import type { BookingDetails } from "@/components/pages/Reserve/Checkout/BookingSummary";
import type { TripDetailsFormData } from "@/components/pages/Reserve/TripDetails/tripSchema";
import { SERVICE_TYPE_OPTIONS } from "@/components/pages/Reserve/TripDetails/tripSchema";
import type { Vehicle } from "@/components/general/Cards/SelectVehicleCard";
import type { Booking, BookingLocation } from "@/api/createBooking";

const TRIP_KEY = "zlux_booking_trip";
const VEHICLE_KEY = "zlux_booking_vehicle";
const BOOKING_KEY = "zlux_booking_booking";

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

export function getTripDetails(): TripDetailsFormData | undefined {
  const tripRaw = readStorage(TRIP_KEY);
  if (!tripRaw) return undefined;
  try {
    return JSON.parse(tripRaw) as TripDetailsFormData;
  } catch {
    return undefined;
  }
}

export function persistVehicle(vehicle: Vehicle): void {
  writeStorage(VEHICLE_KEY, JSON.stringify(vehicle));
}

export function getVehicle(): Vehicle | undefined {
  const vehicleRaw = readStorage(VEHICLE_KEY);
  if (!vehicleRaw) return undefined;
  try {
    return JSON.parse(vehicleRaw) as Vehicle;
  } catch {
    return undefined;
  }
}

export function persistBooking(booking: Booking): void {
  writeStorage(BOOKING_KEY, JSON.stringify(booking));
}

export function getBooking(): Booking | undefined {
  const bookingRaw = readStorage(BOOKING_KEY);
  if (!bookingRaw) return undefined;
  try {
    return JSON.parse(bookingRaw) as Booking;
  } catch {
    return undefined;
  }
}

function serviceLabel(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return SERVICE_TYPE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export { serviceLabel };

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
    pickup:
      typeof trip?.pickupLocation === "object"
        ? trip?.pickupLocation?.address
        : trip?.pickupLocation,
    destination:
      typeof trip?.destination === "object"
        ? trip?.destination?.address
        : trip?.destination,
    date: trip?.date,
    time: trip?.pickupTime,
    service: serviceLabel(trip?.serviceType),
    vehicleName: vehicle?.name,
    vehicleCapacity: vehicle ? `${vehicle.passengers} Passengers` : undefined,
    vehicleImage: vehicle?.image,
    estimatedTotal:
      vehicle?.price !== undefined
        ? (trip?.estimatedHours ?? 1) * vehicle.price
        : undefined,
  };
  return details;
}

function locationAddress(location: BookingLocation | string | undefined): string | undefined {
  return typeof location === "object" ? location?.address : location;
}

export function bookingToBookingDetails(
  booking: Pick<
    Booking,
    | "pickupLocation"
    | "destination"
    | "date"
    | "time"
    | "serviceType"
    | "estimatedTotal"
    | "estimatedHours"
    | "vehicle"
  >
): BookingDetails {
  const embedded = typeof booking.vehicle === "object" ? booking.vehicle : undefined;
  return {
    pickup: locationAddress(booking.pickupLocation),
    destination: locationAddress(booking.destination),
    date: booking.date,
    time: booking.time,
    service: serviceLabel(booking.serviceType) ?? booking.serviceType,
    vehicleName: embedded?.name,
    vehicleCapacity: embedded ? `${embedded.passengerCapacity} Passengers` : undefined,
    vehicleImage: embedded?.imageUrl || undefined,
    estimatedTotal:
      embedded?.hourlyRate !== undefined
        ? booking.estimatedHours * embedded.hourlyRate
        : booking.estimatedTotal,
  };
}