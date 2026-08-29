import axios from "@/lib/axios";
import type { Booking } from "@/api/createBooking";

export type BookingByReference = Omit<Booking, "accessToken">;

export async function fetchBookingByReference(
  reference: string
): Promise<BookingByReference> {
  const { data } = await axios.get<BookingByReference>(
    `/bookings/reference/${encodeURIComponent(reference)}`
  );
  return data;
}