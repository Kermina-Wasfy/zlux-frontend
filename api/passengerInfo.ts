import axios from "@/lib/axios";
import type { Booking } from "@/api/createBooking";

export interface UpdatePassengerPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passengerCount: number;
  flightNumber?: string;
  specialRequests?: string;
}

export async function updatePassengerInfo(
  bookingId: string,
  accessToken: string,
  payload: UpdatePassengerPayload
): Promise<Booking> {
  const { data } = await axios.patch<Booking>(`/bookings/${bookingId}/passenger`, payload, {
    headers: { "x-booking-token": accessToken },
  });
  return data;
}