import axios from "@/lib/axios";

export interface BookingLocation {
  address: string;
  lat: number;
  lng: number;
}

export interface CreateBookingPayload {
  pickupLocation: BookingLocation;
  destination: BookingLocation;
  date: string;
  time: string;
  serviceType: string;
  vehicleId: string;
  estimatedHours: number;
}

export interface PassengerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passengerCount: number;
  flightNumber?: string;
  specialRequests?: string;
}

export interface BookingVehicle {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  hourlyRate: number;
  passengerCapacity: number;
  bagsCapacity: number;
  imageUrl?: string;
  isActive?: boolean;
}

export interface Booking {
  bookingReference: string;
  accessToken: string;
  pickupLocation: BookingLocation;
  destination: BookingLocation;
  date: string;
  time: string;
  serviceType: string;
  distanceKm: number;
  vehicle: string | BookingVehicle;
  estimatedHours: number;
  estimatedTotal: number;
  passenger: PassengerInfo | null;
  driver: string | null;
  status: string;
  paymentStatus: string;
  stripePaymentIntentId: string | null;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  const { data } = await axios.post<Booking>("/bookings", payload);
  return data;
}