import type { Denomination, GiftCardItem, ScreenId } from '../types/giftCard';

export const DENOMINATIONS: Denomination[] = [
  { amount: 5000, label: '₦5,000', theme: 'green' },
  { amount: 10000, label: '₦10,000', theme: 'peach' },
  { amount: 20000, label: '₦20,000', theme: 'dark' },
  { amount: 25000, label: '₦25,000', theme: 'green' },
  { amount: 50000, label: '₦50,000', theme: 'peach' },
  { amount: 100000, label: '₦100,000', theme: 'dark' },
];

export const INITIAL_ACTIVE_CARDS: GiftCardItem[] = [
  {
    id: 'CN-7K9M-4P2X',
    code: 'CN-7K9M-4P2X',
    initialValue: 25000,
    currentBalance: 15000,
    purchasedDate: '12 Nov 2026',
    firstRedeemedDate: '19 Nov 2026',
    status: 'linked',
    theme: 'dark',
    history: [
      {
        date: '22 Nov 2026',
        service: 'Quote Request service',
        deduction: 5000,
        balanceAfter: 15000,
      },
      {
        date: '19 Nov 2026',
        service: 'Business listing',
        deduction: 5000,
        balanceAfter: 20000,
      },
    ],
  },
  {
    id: 'CN-8R3D-6T5W',
    code: 'CN-8R3D-6T5W',
    initialValue: 25000,
    currentBalance: 25000,
    purchasedDate: '25 Nov 2026',
    status: 'unredeemed',
    theme: 'green',
    history: [],
  },
];

export const INITIAL_USED_CARDS: GiftCardItem[] = [
  {
    id: 'CN-2N8B-5L7Q',
    code: 'CN-2N8B-5L7Q',
    initialValue: 10000,
    currentBalance: 0,
    purchasedDate: '02 Nov 2026',
    lastUsedDate: '18 Nov 2026',
    status: 'used',
    theme: 'peach',
    history: [
      {
        date: '18 Nov 2026',
        service: 'Quote Request service',
        deduction: 6000,
        balanceAfter: 0,
      },
      {
        date: '10 Nov 2026',
        service: 'Business listing',
        deduction: 4000,
        balanceAfter: 6000,
      },
    ],
  },
];

export const SCREEN_LIST: { id: ScreenId; code: string; label: string }[] = [
  { id: '01-available', code: '01', label: 'Available' },
  { id: '02-buy', code: '02', label: 'Buy a gift card' },
  { id: '03-purchase-checkout', code: '03', label: 'Purchase checkout' },
  { id: '04-purchase-success', code: '04', label: 'Purchase successful' },
  { id: '05-payment-failed', code: '05', label: 'Payment unsuccessful' },
  { id: '06-active', code: '06', label: 'Active' },
  { id: '07-active-details', code: '07', label: 'Active card details' },
  { id: '08-share', code: '08', label: 'Share a gift card' },
  { id: '09-linked-recipient', code: '09', label: 'Card linked to recipient' },
  { id: '10-inactive-used', code: '10', label: 'Inactive/Used' },
  { id: '11-used-details', code: '11', label: 'Used card details' },
  { id: '12-checkout-enter', code: '12', label: 'Checkout — Enter card' },
  { id: '13-checkout-partial', code: '13', label: 'Checkout — Partial' },
  { id: '14-checkout-full', code: '14', label: 'Checkout — Full' },
  { id: '15-service-payment-success', code: '15', label: 'Service payment success' },
  { id: '16-checkout-eligibility-error', code: '16', label: 'Checkout — Eligibility error' },
  { id: '17-checkout-insufficient-balance', code: '17', label: 'Checkout — Insufficient' },
  { id: '18-empty-active', code: '18', label: 'Empty active' },
  { id: '19-gift-select', code: '19', label: 'Gift — Select card' },
  { id: '20-gift-transfer', code: '20', label: 'Gift — Transfer ownership' },
  { id: '21-gift-success', code: '21', label: 'Gift — Transfer successful' },
  { id: '22-gift-failed', code: '22', label: 'Gift — Transfer failed' },
];

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}
