import { useState, useEffect } from 'react';
import { formatNaira } from '../data/giftCards';
import type { GiftCardItem, ScreenId } from '../types/giftCard';
import { ActionButton } from '../components/Buttons';
import alertCircle from '../assets/alert-circle.svg';
import successCheck from '../assets/success-check.svg';

interface ServiceCheckoutProps {
  screen:
    | '12-checkout-enter'
    | '13-checkout-partial'
    | '14-checkout-full'
    | '15-service-payment-success'
    | '16-checkout-eligibility-error'
    | '17-checkout-insufficient-balance';
  activeCards: GiftCardItem[];
  onNavigate: (screen: ScreenId) => void;
  onConfirmServicePayment: (code: string, deductionAmount: number) => void;
  onViewHistoryForCard: (code: string) => void;
}

const SERVICE_TOTAL = 25000;

export function ServiceCheckoutScreens({
  screen,
  activeCards,
  onNavigate,
  onConfirmServicePayment,
  onViewHistoryForCard,
}: ServiceCheckoutProps) {
  const [codeInput, setCodeInput] = useState(
    screen === '12-checkout-enter'
      ? ''
      : screen === '14-checkout-full'
      ? 'CN-8R3D-6T5W'
      : 'CN-7K9M-4P2X'
  );
  const [amountInput, setAmountInput] = useState(
    screen === '14-checkout-full'
      ? '25,000'
      : screen === '17-checkout-insufficient-balance'
      ? '20,000'
      : '10,000'
  );
  const [lastPaidGiftCard, setLastPaidGiftCard] = useState(10000);
  const [lastPaidCode, setLastPaidCode] = useState('CN-7K9M-4P2X');

  useEffect(() => {
    if (screen === '12-checkout-enter') {
      setCodeInput('');
    } else if (screen === '13-checkout-partial') {
      setCodeInput('CN-7K9M-4P2X');
      setAmountInput('10,000');
    } else if (screen === '14-checkout-full') {
      setCodeInput('CN-8R3D-6T5W');
      setAmountInput('25,000');
    } else if (screen === '16-checkout-eligibility-error') {
      setCodeInput('CN-7K9M-4P2X');
    } else if (screen === '17-checkout-insufficient-balance') {
      setCodeInput('CN-7K9M-4P2X');
      setAmountInput('20,000');
    }
  }, [screen]);

  const parseAmount = (val: string) => {
    const n = Number(val.replace(/[^\d]/g, ''));
    return Number.isNaN(n) ? 0 : n;
  };

  const handleCheckGiftCard = () => {
    const trimmed = codeInput.trim().toUpperCase();
    const matched = activeCards.find((c) => c.code.toUpperCase() === trimmed);
    if (!matched || matched.currentBalance <= 0) {
      onNavigate('16-checkout-eligibility-error');
      return;
    }
    if (matched.currentBalance >= SERVICE_TOTAL) {
      setAmountInput('25,000');
      onNavigate('14-checkout-full');
    } else {
      setAmountInput(Math.min(10000, matched.currentBalance).toLocaleString('en-NG'));
      onNavigate('13-checkout-partial');
    }
  };

  const handleAmountBlurOrApply = () => {
    const matched = activeCards.find((c) => c.code.toUpperCase() === codeInput.trim().toUpperCase());
    const avail = matched ? matched.currentBalance : 15000;
    const requested = parseAmount(amountInput);
    if (requested > avail) {
      onNavigate('17-checkout-insufficient-balance');
    } else if (requested >= SERVICE_TOTAL) {
      onNavigate('14-checkout-full');
    } else {
      onNavigate('13-checkout-partial');
    }
  };

  if (screen === '15-service-payment-success') {
    const remainingCardPaid = Math.max(0, SERVICE_TOTAL - lastPaidGiftCard);
    const updatedCard = activeCards.find((c) => c.code === lastPaidCode);
    const newBalance = updatedCard ? updatedCard.currentBalance : 5000;

    return (
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[24px] px-[24px] md:px-[128px] pt-[32px] pb-[48px]">
        <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f] whitespace-pre-wrap">
          <button
            type="button"
            onClick={() => onNavigate('12-checkout-enter')}
            className="hover:underline cursor-pointer"
          >
            Quote Request
          </button>
          {'  /  Payment successful'}
        </p>

        <div className="flex flex-col gap-[10px]">
          <h1 className="font-archivo font-semibold text-[29.03px] leading-normal text-[#010817]">
            All paid. You’re good to go.
          </h1>
          <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
            Your payment is complete and your gift card balance has been updated.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-[32px] items-start w-full">
          <div className="bg-white flex flex-1 flex-col gap-[24px] items-start p-[32px] rounded-[12px] w-full">
            <img src={successCheck} alt="Payment successful" className="size-[48px]" />
            <h2 className="font-archivo font-semibold text-[24.19px] leading-normal text-[#010817]">
              ₦25,000 paid successfully
            </h2>
            <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
              Quote Request service · Order QR-251126-019
            </p>

            <div className="bg-[#ebebeb] h-px w-full" />

            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">Gift card payment</span>
              <span className="font-archivo font-medium text-[#010817]">
                {formatNaira(lastPaidGiftCard)}
              </span>
            </div>
            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">Visa ending 4242</span>
              <span className="font-archivo font-medium text-[#010817]">
                {formatNaira(remainingCardPaid)}
              </span>
            </div>
            <div className="flex items-start justify-between font-archivo font-semibold text-[16.8px] text-[#010817] w-full">
              <span>Total paid</span>
              <span>₦25,000</span>
            </div>

            <div className="bg-[#ebebeb] h-px w-full" />

            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">Payment date</span>
              <span className="font-archivo font-medium text-[#010817]">25 Nov 2026</span>
            </div>
            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">Reference</span>
              <span className="font-archivo font-medium text-[#010817]">PAY-251126-019</span>
            </div>

            <div className="flex flex-wrap gap-[16px] w-full">
              <ActionButton variant="primary" onClick={() => onNavigate('06-active')}>
                View order
              </ActionButton>
              <ActionButton variant="secondary" onClick={() => onNavigate('01-available')}>
                Back to gift cards
              </ActionButton>
            </div>
          </div>

          <div className="bg-white flex flex-col gap-[24px] items-start p-[32px] rounded-[12px] w-full lg:w-[432px] shrink-0">
            <h2 className="font-archivo font-semibold text-[20.16px] leading-normal text-[#010817]">
              Your gift card balance
            </h2>

            <div className="bg-[#d7f1d3] flex flex-col gap-[14px] items-start p-[24px] rounded-[12px] text-[#010817] w-full">
              <p className="font-archivo font-semibold text-[29.03px] leading-normal">
                {formatNaira(newBalance)}
              </p>
              <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
                Available for your next payment
              </p>
            </div>

            <p className="font-archivo font-semibold text-[16.8px] leading-normal text-[#010817]">
              {lastPaidCode}
            </p>
            <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
              {newBalance > 0 ? 'Still active · Linked to you' : 'Fully used · Moved to Inactive/Used'}
            </p>

            <div className="bg-[#ebebeb] h-px w-full" />

            <h3 className="font-archivo font-semibold text-[16.8px] leading-normal text-[#010817]">
              Payment history updated
            </h3>
            <div className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#010817]">
              <p className="mb-0">25 Nov 2026 · Quote Request service</p>
              <p>
                −{formatNaira(lastPaidGiftCard)} · Balance after {formatNaira(newBalance)}
              </p>
            </div>

            <ActionButton
              variant="secondary"
              onClick={() => onViewHistoryForCard(lastPaidCode)}
            >
              View payment history
            </ActionButton>
          </div>
        </div>
      </div>
    );
  }

  // Screens 12, 13, 14, 16, 17 share the Quote Request Checkout layout
  const isPartial = screen === '13-checkout-partial';
  const isFull = screen === '14-checkout-full';
  const isEligibilityError = screen === '16-checkout-eligibility-error';
  const isInsufficient = screen === '17-checkout-insufficient-balance';

  const deduction = isFull ? 25000 : isPartial ? parseAmount(amountInput) || 10000 : 0;
  const remainingPayable = Math.max(0, SERVICE_TOTAL - deduction);
  const availableBalance = isFull ? 25000 : 15000;
  const balanceAfter = Math.max(0, availableBalance - deduction);

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[24px] px-[24px] md:px-[128px] pt-[32px] pb-[48px]">
      <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f] whitespace-pre-wrap">
        {'Quote Request  /  Checkout'}
      </p>

      <div className="flex flex-col gap-[10px]">
        <h1 className="font-archivo font-semibold text-[29.03px] leading-normal text-[#010817]">
          Complete your payment
        </h1>
        <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
          Choose how you would like to pay for your service.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-[32px] items-start w-full">
        {/* Left column */}
        <div className="bg-white flex flex-1 flex-col gap-[20px] items-start p-[32px] rounded-[12px] w-full">
          <h2 className="font-archivo font-semibold text-[24.19px] leading-normal text-[#010817]">
            Payment method
          </h2>

          <div className="bg-[#d7f1d3] flex flex-col gap-[10px] items-start p-[20px] rounded-[12px] text-[#010817] w-full">
            <p className="font-archivo font-semibold text-[16.8px] leading-normal whitespace-pre-wrap">
              {'●  Pay with Gift Card'}
            </p>
            <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
              Use all or part of your gift card balance.
            </p>
          </div>

          <label className="flex flex-col gap-[6px] w-full">
            <span className="font-archivo font-medium text-[14px] text-[#344054]">
              Gift card code
            </span>
            <div
              className={`bg-white border ${
                isEligibilityError ? 'border-[#fda29b]' : 'border-[#d0d5dd]'
              } flex items-center gap-[8px] px-[14px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] w-full`}
            >
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Enter your gift card code"
                className="flex-1 bg-transparent font-archivo text-[16.8px] text-[#101828] placeholder:text-[#667085] outline-none"
              />
              {isEligibilityError && (
                <img src={alertCircle} alt="Error" className="size-[16px] shrink-0" />
              )}
            </div>
          </label>

          {screen === '12-checkout-enter' && (
            <>
              <ActionButton variant="primary" onClick={handleCheckGiftCard}>
                Check gift card
              </ActionButton>
              <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
                The code will be checked for validity, eligibility and available balance.
              </p>
              <div className="bg-[#ebebeb] h-px w-full" />
              <h3 className="font-archivo font-semibold text-[16.8px] leading-normal text-[#010817]">
                Sharing is for one recipient only
              </h3>
              <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
                Your first successful payment links the gift card to you. Only you can use the
                remaining balance.
              </p>
            </>
          )}

          {isEligibilityError && (
            <>
              <div className="bg-[#fce8d7] flex flex-col gap-[10px] items-start p-[20px] rounded-[12px] w-full">
                <p className="font-archivo font-semibold text-[16.8px] leading-normal text-[#bf5933]">
                  You are not eligible for this gift card.
                </p>
                <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#010817]">
                  Check the code and try again. It may be invalid or already linked to another user.
                </p>
              </div>
              <ActionButton
                variant="secondary"
                onClick={() => onNavigate('12-checkout-enter')}
              >
                Check another code
              </ActionButton>
              <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
                Your order is unchanged. No gift card balance has been deducted.
              </p>
            </>
          )}

          {(isPartial || isFull || isInsufficient) && (
            <>
              <div className="bg-[#d7f1d3] flex flex-col gap-[10px] items-start p-[20px] rounded-[12px] text-[#010817] w-full">
                <p className="font-archivo font-semibold text-[16.8px] leading-normal whitespace-pre-wrap">
                  {`Available balance  ${formatNaira(availableBalance)}`}
                </p>
                <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
                  {isFull
                    ? 'Valid gift card · Not yet redeemed'
                    : 'Valid gift card · Linked to you'}
                </p>
              </div>

              <label className="flex flex-col gap-[6px] w-full">
                <span className="font-archivo font-medium text-[14px] text-[#344054]">
                  Amount to use (₦)
                </span>
                <div
                  className={`bg-white border ${
                    isInsufficient ? 'border-[#fda29b]' : 'border-[#d0d5dd]'
                  } flex items-center gap-[8px] px-[14px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] w-full`}
                >
                  <input
                    type="text"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="flex-1 bg-transparent font-archivo text-[16.8px] text-[#101828] outline-none"
                  />
                  {isInsufficient && (
                    <img src={alertCircle} alt="Error" className="size-[16px] shrink-0" />
                  )}
                </div>
              </label>

              {isInsufficient ? (
                <>
                  <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#bf5933]">
                    Insufficient balance. Enter ₦15,000 or less.
                  </p>
                  <div className="flex flex-wrap gap-[16px] w-full">
                    <ActionButton variant="disabled">Apply gift card</ActionButton>
                    <ActionButton
                      variant="secondary"
                      onClick={() => {
                        setAmountInput('15,000');
                        onNavigate('13-checkout-partial');
                      }}
                    >
                      Use ₦15,000 instead
                    </ActionButton>
                  </div>
                  <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
                    The gift card has not been applied to this order.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex flex-wrap gap-[16px] w-full">
                    <ActionButton variant="secondary" onClick={handleAmountBlurOrApply}>
                      Gift card applied
                    </ActionButton>
                    <ActionButton variant="secondary" onClick={handleAmountBlurOrApply}>
                      Change amount
                    </ActionButton>
                  </div>
                  <p className="font-archivo font-medium text-[14px] leading-normal text-[#010817]">
                    Balance after successful payment: {formatNaira(balanceAfter)}
                  </p>
                  <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
                    {isFull
                      ? 'This first redemption links the card to you. With no balance left, it moves to Inactive/Used after payment.'
                      : 'Your balance and payment history update only after the full payment succeeds.'}
                  </p>
                </>
              )}
            </>
          )}

          {!isFull && (
            <>
              <div className="bg-[#ebebeb] h-px w-full" />
              <h3 className="font-archivo font-semibold text-[16.8px] leading-normal text-[#010817]">
                {isPartial
                  ? `Pay the remaining ${formatNaira(remainingPayable)}`
                  : 'Or pay without a gift card'}
              </h3>
              <div className="bg-[#f4f4f4] flex flex-col gap-[10px] items-start p-[20px] rounded-[12px] text-[#010817] w-full">
                <p className="font-archivo font-semibold text-[16.8px] leading-normal whitespace-pre-wrap">
                  {isPartial ? '●  Debit or credit card' : '○  Debit or credit card'}
                </p>
                <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
                  Visa ending 4242 · Change card
                </p>
              </div>
            </>
          )}
        </div>

        {/* Right column: Order summary */}
        <div className="bg-white flex flex-col gap-[22px] items-start p-[28px] rounded-[12px] w-full lg:w-[432px] shrink-0">
          <h2 className="font-archivo font-semibold text-[24.19px] leading-normal text-[#010817]">
            Order summary
          </h2>
          <p className="font-archivo font-semibold text-[16.8px] leading-normal text-[#010817]">
            Quote Request service
          </p>
          <div className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
            <p className="mb-0">Order QR-251126-019</p>
            <p>Connect Nigeria</p>
          </div>

          <div className="bg-[#ebebeb] h-px w-full" />

          <div className="flex items-start justify-between text-[14px] w-full">
            <span className="font-archivo text-[#6c727f]">Service total</span>
            <span className="font-archivo font-medium text-[#010817]">
              {formatNaira(SERVICE_TOTAL)}
            </span>
          </div>
          <div className="flex items-start justify-between text-[14px] w-full">
            <span className="font-archivo text-[#6c727f]">Gift card deduction</span>
            <span className="font-archivo font-medium text-[#010817]">
              {deduction > 0 ? `−${formatNaira(deduction)}` : '₦0'}
            </span>
          </div>

          <div className="bg-[#ebebeb] h-px w-full" />

          <div className="flex items-start justify-between font-archivo font-semibold text-[16.8px] text-[#010817] w-full">
            <span>Remaining payable</span>
            <span>{formatNaira(remainingPayable)}</span>
          </div>

          {isPartial && (
            <div className="bg-[#d7f1d3] flex flex-col gap-[10px] items-start p-[20px] rounded-[12px] text-[#010817] w-full">
              <p className="font-archivo font-semibold text-[16.8px] leading-normal">
                Gift card applied
              </p>
              <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
                {formatNaira(deduction)} from your gift card, and {formatNaira(remainingPayable)} by
                card.
              </p>
            </div>
          )}

          {isFull && (
            <div className="bg-[#d7f1d3] flex flex-col gap-[10px] items-start p-[20px] rounded-[12px] text-[#010817] w-full">
              <p className="font-archivo font-semibold text-[16.8px] leading-normal">
                Fully covered by your gift card
              </p>
              <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
                No additional payment is required. Confirm below to complete your order.
              </p>
            </div>
          )}

          {!isPartial && !isFull && (
            <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
              No gift card applied yet.
            </p>
          )}

          <ActionButton
            variant="primary"
            onClick={() => {
              const targetCode = codeInput.trim().toUpperCase() || 'CN-7K9M-4P2X';
              setLastPaidGiftCard(deduction);
              setLastPaidCode(targetCode);
              if (deduction > 0) {
                onConfirmServicePayment(targetCode, deduction);
              }
              onNavigate('15-service-payment-success');
            }}
          >
            {isFull
              ? 'Confirm payment'
              : isPartial
              ? `Pay remaining ${formatNaira(remainingPayable)}`
              : 'Pay ₦25,000 by card'}
          </ActionButton>

          <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
            Nothing is deducted until your payment succeeds.
          </p>

          <ActionButton variant="secondary" onClick={() => onNavigate('01-available')}>
            Back to order
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
