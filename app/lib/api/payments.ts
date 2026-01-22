import { getApiUrl } from "@/lib/api/config";
import { refreshAccessToken } from "@/lib/auth/refresh";

export interface ApiPayment {
  id: string;
  amount_in_cents: number;
  currency: string;
  product: "premium" | "max";
  external_receipt_url?: string;
  paid_at: string;
}

export interface PaymentsResponse {
  payments: ApiPayment[];
}

export class PaymentsError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "PaymentsError";
  }
}

export async function fetchPayments(): Promise<ApiPayment[]> {
  return performPaymentsRequest(0);
}

async function performPaymentsRequest(attempt: number): Promise<ApiPayment[]> {
  const response = await fetch(getApiUrl("/internal/payments"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  });

  if (!response.ok) {
    if (response.status === 401 && attempt === 0) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return performPaymentsRequest(attempt + 1);
      }
    }

    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text();
    }

    throw new PaymentsError(`Failed to fetch payments: ${response.statusText}`, response.status, errorData);
  }

  const data: PaymentsResponse = await response.json();
  return data.payments;
}
