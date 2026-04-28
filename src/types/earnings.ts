// ── Pending Earning Item ──────────────────────────────────────────────────────
export interface PendingEarning {
  id: string;
  title: string;
  name: string;
  amount: number;
  createdAt: string | null;
  releasedAt: string | null;
}

// ── My Earnings Response ─────────────────────────────────────────────────────
export interface MyEarningsData {
  pendingPayment: number;
  totalPayment: number;
  availableWithdrawal: number;
  isPaypalAccountActive: boolean;
  pendingEarnings: PendingEarning[];
}

export interface MyEarningsResponse {
  success: boolean;
  message: string;
  data: MyEarningsData;
}

// ── Payout Request ───────────────────────────────────────────────────────────
export interface PayoutRequestResponse {
  success: boolean;
  message: string;
}

// ── Payout History ───────────────────────────────────────────────────────────
export type PayoutStatus = 'PAID' | 'PENDING' | 'FAILED';
export type PayoutMethod = 'standard' | 'instant' | string;

export interface PayoutHistoryItem {
  id: string;
  amount: number;
  status: PayoutStatus;
  createdAt: string;
  arrivalDate: string;
  currency: string;
  failureMessage: string | null;
  method: PayoutMethod;
}

export interface PayoutHistoryMeta {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}

export interface PayoutHistoryData {
  result: PayoutHistoryItem[];
  meta: PayoutHistoryMeta;
}

export interface PayoutHistoryResponse {
  success: boolean;
  message: string;
  data: PayoutHistoryData;
}

export interface PayoutHistoryParams {
  page?: number;
  limit?: number;
}
