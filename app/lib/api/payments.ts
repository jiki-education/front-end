"use client";

/**
 * Payments API Module
 * Handles payment history API interactions
 */

import { api } from "./client";

export interface ApiPayment {
  id: string;
  amount_in_cents: number;
  currency: string;
  product: "premium";
  // "subscription" for a legacy subscription invoice, "lifetime" for a one-off purchase
  purchase_type: "subscription" | "lifetime";
  // Set once a lifetime purchase has been refunded or disputed
  revoked_reason: "refunded" | "disputed" | null;
  external_receipt_url?: string;
  paid_at: string;
}

export interface PaymentsResponse {
  payments: ApiPayment[];
}

export async function fetchPayments(): Promise<ApiPayment[]> {
  const response = await api.get<PaymentsResponse>("/internal/payments");
  return response.data.payments;
}
