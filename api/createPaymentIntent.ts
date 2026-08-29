import axios from "@/lib/axios";

export interface CreatePaymentIntentPayload {
  bookingId: string;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
}

export async function createPaymentIntent(
  bookingId: string,
  accessToken?: string
): Promise<CreatePaymentIntentResponse> {
  const { data } = await axios.post<CreatePaymentIntentResponse>(
    "/payments/create-intent",
    { bookingId },
    {
      headers: accessToken ? { "x-booking-token": accessToken } : undefined,
    }
  );
  return data;
}
