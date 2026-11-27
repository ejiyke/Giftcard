export type ScreenId =
  | '01-available'
  | '02-buy'
  | '03-purchase-checkout'
  | '04-purchase-success'
  | '05-payment-failed'
  | '06-active'
  | '07-active-details'
  | '08-share'
  | '09-linked-recipient'
  | '10-inactive-used'
  | '11-used-details'
  | '12-checkout-enter'
  | '13-checkout-partial'
  | '14-checkout-full'
  | '15-service-payment-success'
  | '16-checkout-eligibility-error'
  | '17-checkout-insufficient-balance'
  | '18-empty-active'
  | '19-gift-select'
  | '20-gift-transfer'
  | '21-gift-success'
  | '22-gift-failed';

export type CardTheme = 'green' | 'peach' | 'dark';

export type CardColorVariant =
  | 'original'
  | 'green'
  | 'peach'
  | 'dark'
  | 'blue'
  | 'gold';

export type CardArtStyle =
  | 'celebration'
  | 'gift'
  | 'bouquet'
  | 'lagos'
  | 'ankara'
  | 'fireworks';

export interface Denomination {
  amount: number;
  label: string;
  theme: CardTheme;
  artStyle: CardArtStyle;
  occasion: string;
  colorVariant?: CardColorVariant;
}

export interface PaymentHistoryItem {
  date: string;
  service: string;
  deduction: number;
  balanceAfter: number;
}

export interface TransferDetails {
  recipientEmail: string;
  recipientName?: string;
  message?: string;
  transferredAmount: number;
  reference: string;
  transferredDate: string;
}

export interface GiftCardItem {
  id: string;
  code: string;
  initialValue: number;
  currentBalance: number;
  purchasedDate: string;
  firstRedeemedDate?: string;
  lastUsedDate?: string;
  status: 'unredeemed' | 'linked' | 'used';
  theme: CardTheme;
  artStyle?: CardArtStyle;
  colorVariant?: CardColorVariant;
  history: PaymentHistoryItem[];
  transferDetails?: TransferDetails;
}
