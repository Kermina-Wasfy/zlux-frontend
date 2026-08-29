import axios from "@/lib/axios";

export interface ConfirmPaymentPayload {
  bookingId: string;
  paymentIntentId: string;
}

export interface ConfirmPaymentResponse {
  message?: string;
  status?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  booking?: any;
}

export async function confirmPayment(
  payload: ConfirmPaymentPayload,
  accessToken?: string
): Promise<ConfirmPaymentResponse> {
  const { data } = await axios.post<ConfirmPaymentResponse>(
    "/payments/confirm",
    payload,
    {
      headers: accessToken ? { "x-booking-token": accessToken } : undefined,
    }
  );
  return data;
}
