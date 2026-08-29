import axios from "@/lib/axios";
import type { Booking } from "@/api/createBooking";

export async function confirmBooking(
  bookingId: string,
  accessToken: string
): Promise<Booking> {
  const { data } = await axios.post<Booking>(
    `/bookings/${bookingId}/confirm`,
    {},
    {
      headers: { "x-booking-token": accessToken },
    }
  );
  return data;
}
