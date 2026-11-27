import { useState } from 'react';
import { COLOR_VARIANTS, DENOMINATIONS, formatNaira } from '../data/giftCards';
import type { Denomination, GiftCardItem, ScreenId } from '../types/giftCard';
import { ActionButton } from '../components/Buttons';
import { GiftCardTabs } from '../components/GiftCardTabs';
import { GiftCardVisual } from '../components/GiftCardVisual';
import successCheck from '../assets/success-check.svg';

interface PurchaseFlowProps {
  screen:
    | '01-available'
    | '02-buy'
    | '03-purchase-checkout'
    | '04-purchase-success'
    | '05-payment-failed';
  selectedDenom: Denomination;
  onSelectDenom: (denom: Denomination) => void;
  onNavigate: (screen: ScreenId) => void;
  activeCount: number;
  usedCount: number;
  lastPurchasedCard: GiftCardItem;
  onCompletePurchase: (cardDetails: { name: string; last4: string; email: string }) => void;
  onShareCard: (card: GiftCardItem) => void;
  onCopyCode: (code: string) => void;
  copiedCode: string | null;
}

export function PurchaseFlowScreens({
  screen,
  selectedDenom,
  onSelectDenom,
  onNavigate,
  activeCount,
  usedCount,
  lastPurchasedCard,
  onCompletePurchase,
  onShareCard,
  onCopyCode,
  copiedCode,
}: PurchaseFlowProps) {
  const [nameOnCard, setNameOnCard] = useState('Nneka Okafor');
  const [cardNumber, setCardNumber] = useState('4242  4242  4242  4242');
  const [expiryDate, setExpiryDate] = useState('08 / 28');
  const [cvv, setCvv] = useState('•••');
  const [receiptEmail, setReceiptEmail] = useState('nneka.okafor@example.com');

  const getLast4 = () => {
    const digits = cardNumber.replace(/\D/g, '');
    return digits.length >= 4 ? digits.slice(-4) : '4242';
  };

  if (screen === '01-available') {
    const row1 = DENOMINATIONS.slice(0, 3);
    const row2 = DENOMINATIONS.slice(3, 6);

    return (
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[24px] px-[24px] md:px-[128px] pt-[32px] pb-[48px]">
        <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f] whitespace-pre-wrap">
          {'Account  /  Gift cards'}
        </p>

        <div className="flex flex-col gap-[10px]">
          <h1 className="font-archivo font-semibold text-[29.03px] leading-normal text-[#010817]">
            Gift cards
          </h1>
          <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
            Thoughtful to give. Flexible to spend. All in one place.
          </p>
        </div>

        <div className="bg-[#d7f1d3] flex flex-col md:flex-row gap-[24px] md:gap-[48px] items-start p-[28px] rounded-[12px] text-[#010817]">
          <div className="flex flex-1 flex-col gap-[12px]">
            <h2 className="font-archivo font-semibold text-[24.19px] leading-normal">
              A gift of possibilities
            </h2>
            <div className="font-archivo font-normal text-[14px] leading-[115.625%]">
              <p className="mb-0">Buy a gift card for yourself or share it with someone special.</p>
              <p>Use it to pay for services on Connect Nigeria and Quote Request.</p>
            </div>
          </div>
          <div className="flex flex-col gap-[12px] w-full md:w-[330px] shrink-0 whitespace-pre-wrap">
            <p className="font-archivo font-semibold text-[16.8px] leading-normal">
              {'01  Choose a value    02  Pay securely'}
            </p>
            <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
              {'03  Copy the code and share with one person'}
            </p>
          </div>
        </div>

        <GiftCardTabs
          activeTab="available"
          availableCount={DENOMINATIONS.length}
          activeCount={activeCount}
          usedCount={usedCount}
          onSelectTab={onNavigate}
        />

        {[row1, row2].map((row, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-3 gap-[24px] w-full">
            {row.map((denom) => (
              <div
                key={denom.amount}
                className="bg-white flex flex-col gap-[16px] items-start p-[16px] rounded-[12px]"
              >
                <GiftCardVisual
                  amount={denom.amount}
                  theme={denom.theme}
                  artStyle={denom.artStyle}
                  label={denom.occasion}
                />
                <ActionButton
                  variant="primary"
                  onClick={() => {
                    onSelectDenom(denom);
                    onNavigate('02-buy');
                  }}
                >
                  Buy gift card
                </ActionButton>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (screen === '02-buy') {
    return (
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[24px] px-[24px] md:px-[128px] pt-[32px] pb-[48px]">
        <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f] whitespace-pre-wrap">
          <button
            type="button"
            onClick={() => onNavigate('01-available')}
            className="hover:underline cursor-pointer"
          >
            Gift cards
          </button>
          {'  /  Buy a gift card'}
        </p>

        <div className="flex flex-col gap-[10px]">
          <h1 className="font-archivo font-semibold text-[29.03px] leading-normal text-[#010817]">
            A thoughtful gift, made simple
          </h1>
          <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
            Review your gift card before continuing.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-[32px] items-start w-full">
          <div className="bg-white flex flex-1 flex-col gap-[24px] items-start p-[32px] rounded-[12px] w-full">
            <GiftCardVisual
              amount={selectedDenom.amount}
              theme={selectedDenom.theme}
              artStyle={selectedDenom.artStyle}
              colorVariant={selectedDenom.colorVariant}
              label={selectedDenom.occasion}
            />
            <div className="flex flex-col gap-[10px] w-full">
              <p className="font-archivo font-medium text-[13px] text-[#6c727f]">
                Choose a card design
              </p>
              <div className="flex flex-wrap gap-[8px]">
                {DENOMINATIONS.map((d) => {
                  const isChosen = selectedDenom.artStyle === d.artStyle;
                  return (
                    <button
                      key={d.artStyle}
                      type="button"
                      onClick={() =>
                        onSelectDenom({
                          ...selectedDenom,
                          artStyle: d.artStyle,
                          occasion: d.occasion,
                          theme: d.theme,
                        })
                      }
                      className={`px-[12px] py-[6px] rounded-full font-archivo text-[13px] transition-colors cursor-pointer ${
                        isChosen
                          ? 'bg-[#010817] text-white font-semibold'
                          : 'bg-[#f4f4f4] text-[#344054] hover:bg-[#ebebeb]'
                      }`}
                    >
                      {d.occasion}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col gap-[10px] w-full">
              <p className="font-archivo font-medium text-[13px] text-[#6c727f]">
                Choose a color variant
              </p>
              <div className="flex flex-wrap gap-[8px]">
                {COLOR_VARIANTS.map((v) => {
                  const activeVariant = (selectedDenom.colorVariant || 'original') === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() =>
                        onSelectDenom({
                          ...selectedDenom,
                          colorVariant: v.id,
                        })
                      }
                      className={`inline-flex items-center gap-[6px] px-[12px] py-[6px] rounded-full font-archivo text-[13px] transition-colors cursor-pointer ${
                        activeVariant
                          ? 'bg-[#010817] text-white font-semibold'
                          : 'bg-[#f4f4f4] text-[#344054] hover:bg-[#ebebeb]'
                      }`}
                    >
                      <span
                        className="inline-block size-[10px] rounded-full ring-1 ring-black/15"
                        style={{ backgroundColor: v.swatch }}
                      />
                      <span>{v.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <h2 className="font-archivo font-semibold text-[24.19px] leading-normal text-[#010817]">
              One card. Plenty of possibilities.
            </h2>
            <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#010817]">
              Put it towards services on Connect Nigeria or Quote Request. Use the balance in full
              or across multiple payments.
            </p>
          </div>

          <div className="bg-white flex flex-1 flex-col gap-[24px] items-start p-[32px] rounded-[12px] w-full">
            <h2 className="font-archivo font-semibold text-[24.19px] leading-normal text-[#010817]">
              {selectedDenom.label} gift card
            </h2>
            <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
              Gift card value
            </p>
            <p className="font-archivo font-semibold text-[29.03px] leading-normal text-[#010817]">
              {selectedDenom.label}
            </p>
            <div className="bg-[#ebebeb] h-px w-full" />
            <h3 className="font-archivo font-semibold text-[16.8px] leading-normal text-[#010817]">
              Share with one person only
            </h3>
            <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#010817]">
              This card can be used by only one recipient. The first person to successfully redeem
              the code becomes its recipient, and the remaining balance is locked to them.
            </p>
            <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
              Keep the code private. Only share it with the person you want to receive the gift.
            </p>
            <div className="flex flex-wrap gap-[16px]">
              <ActionButton
                variant="primary"
                onClick={() => onNavigate('03-purchase-checkout')}
              >
                Continue to checkout
              </ActionButton>
              <ActionButton
                variant="secondary"
                onClick={() => onNavigate('01-available')}
              >
                Choose another value
              </ActionButton>
            </div>
          </div>
        </div>

        <div className="bg-[#d7f1d3] flex flex-col gap-[8px] items-start p-[20px] rounded-[12px] text-[#010817] w-full">
          <p className="font-archivo font-semibold text-[16.8px] leading-normal">How it works</p>
          <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
            Choose a card → Complete payment → Find it under Active → Copy or share the code.
          </p>
        </div>
      </div>
    );
  }

  if (screen === '03-purchase-checkout') {
    return (
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[24px] px-[24px] md:px-[128px] pt-[32px] pb-[48px]">
        <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f] whitespace-pre-wrap">
          <button
            type="button"
            onClick={() => onNavigate('01-available')}
            className="hover:underline cursor-pointer"
          >
            Gift cards
          </button>
          {'  /  Checkout'}
        </p>

        <div className="flex flex-col gap-[10px]">
          <h1 className="font-archivo font-semibold text-[29.03px] leading-normal text-[#010817]">
            Complete your purchase
          </h1>
          <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
            A little generosity is just one payment away.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-[32px] items-start w-full">
          <div className="bg-white flex flex-1 flex-col gap-[24px] items-start p-[32px] rounded-[12px] w-full">
            <h2 className="font-archivo font-semibold text-[24.19px] leading-normal text-[#010817]">
              Payment method
            </h2>

            <div className="bg-[#d7f1d3] flex flex-col gap-[10px] items-start p-[20px] rounded-[12px] text-[#010817] w-full">
              <p className="font-archivo font-semibold text-[16.8px] leading-normal whitespace-pre-wrap">
                {'●  Debit or credit card'}
              </p>
              <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
                Pay securely with your bank card.
              </p>
            </div>

            <label className="flex flex-col gap-[6px] w-full">
              <span className="font-archivo font-medium text-[14px] text-[#344054]">
                Name on card
              </span>
              <input
                type="text"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                className="bg-white border border-[#d0d5dd] px-[14px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] font-archivo text-[16.8px] text-[#101828] outline-none focus:border-[#35bb25]"
              />
            </label>

            <label className="flex flex-col gap-[6px] w-full">
              <span className="font-archivo font-medium text-[14px] text-[#344054]">
                Card number
              </span>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="bg-white border border-[#d0d5dd] px-[14px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] font-archivo text-[16.8px] text-[#101828] outline-none focus:border-[#35bb25]"
              />
            </label>

            <div className="flex flex-col sm:flex-row gap-[20px] w-full">
              <label className="flex flex-1 flex-col gap-[6px]">
                <span className="font-archivo font-medium text-[14px] text-[#344054]">
                  Expiry date
                </span>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="bg-white border border-[#d0d5dd] px-[14px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] font-archivo text-[16.8px] text-[#101828] outline-none focus:border-[#35bb25]"
                />
              </label>
              <label className="flex flex-1 flex-col gap-[6px]">
                <span className="font-archivo font-medium text-[14px] text-[#344054]">CVV</span>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="bg-white border border-[#d0d5dd] px-[14px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] font-archivo text-[16.8px] text-[#101828] outline-none focus:border-[#35bb25]"
                />
              </label>
            </div>

            <label className="flex flex-col gap-[6px] w-full">
              <span className="font-archivo font-medium text-[14px] text-[#344054]">
                Receipt email
              </span>
              <input
                type="email"
                value={receiptEmail}
                onChange={(e) => setReceiptEmail(e.target.value)}
                className="bg-white border border-[#d0d5dd] px-[14px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] font-archivo text-[16.8px] text-[#101828] outline-none focus:border-[#35bb25]"
              />
            </label>

            <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
              Your payment details are encrypted and processed securely.
            </p>
          </div>

          <div className="bg-white flex flex-col gap-[24px] items-start p-[32px] rounded-[12px] w-full lg:w-[432px] shrink-0">
            <h2 className="font-archivo font-semibold text-[24.19px] leading-normal text-[#010817]">
              Order summary
            </h2>

            <div className="bg-[#d7f1d3] flex flex-col gap-[10px] items-start p-[20px] rounded-[12px] text-[#010817] w-full">
              <p className="font-archivo font-semibold text-[16.8px] leading-normal">CN gift card</p>
              <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
                {selectedDenom.label} gift card · Quantity 1
              </p>
            </div>

            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">Gift card value</span>
              <span className="font-archivo font-medium text-[#010817]">{selectedDenom.label}</span>
            </div>

            <div className="bg-[#ebebeb] h-px w-full" />

            <div className="flex items-start justify-between font-archivo font-semibold text-[16.8px] text-[#010817] w-full">
              <span>Total to pay</span>
              <span>{selectedDenom.label}</span>
            </div>

            <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
              One recipient only. The first successful redemption links the card to that person.
            </p>

            <div className="flex flex-col gap-[12px] w-full items-start">
              <ActionButton
                variant="primary"
                onClick={() =>
                  onCompletePurchase({
                    name: nameOnCard,
                    last4: getLast4(),
                    email: receiptEmail,
                  })
                }
              >
                Pay {selectedDenom.label}
              </ActionButton>
              <ActionButton variant="secondary" onClick={() => onNavigate('02-buy')}>
                Back to gift card
              </ActionButton>
              <button
                type="button"
                onClick={() => onNavigate('05-payment-failed')}
                className="font-archivo text-[13px] text-[#6c727f] underline hover:text-[#010817] cursor-pointer"
              >
                Simulate declined payment
              </button>
            </div>

            <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
              Your card is created only after payment succeeds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (screen === '04-purchase-success') {
    const isCopied = copiedCode === lastPurchasedCard.code;

    return (
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[24px] px-[24px] md:px-[128px] pt-[32px] pb-[48px]">
        <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f] whitespace-pre-wrap">
          <button
            type="button"
            onClick={() => onNavigate('01-available')}
            className="hover:underline cursor-pointer"
          >
            Gift cards
          </button>
          {'  /  Purchase successful'}
        </p>

        <div className="flex flex-col gap-[10px]">
          <h1 className="font-archivo font-semibold text-[29.03px] leading-normal text-[#010817]">
            Your gift card is ready
          </h1>
          <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
            Payment successful. Your card is now under Active.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-[32px] items-start w-full">
          <div className="bg-white flex flex-1 flex-col gap-[24px] items-start p-[32px] rounded-[12px] w-full">
            <img src={successCheck} alt="Purchase successful" className="size-[48px]" />
            <h2 className="font-archivo font-semibold text-[24.19px] leading-normal text-[#010817]">
              A little thought. A lot of possibility.
            </h2>

            <div className="bg-[#d7f1d3] flex flex-col gap-[10px] items-start p-[20px] rounded-[12px] text-[#010817] w-full">
              <p className="font-archivo font-semibold text-[16.8px] leading-normal">
                {formatNaira(lastPurchasedCard.initialValue)}
              </p>
              <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
                CN gift card · Not yet redeemed
              </p>
            </div>

            <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
              Gift card code
            </p>
            <p className="font-archivo font-semibold text-[24.19px] leading-normal text-[#010817]">
              {lastPurchasedCard.code}
            </p>

            <div className="flex flex-wrap gap-[16px] w-full">
              <ActionButton
                variant="secondary"
                onClick={() => onCopyCode(lastPurchasedCard.code)}
              >
                {isCopied ? 'Code copied' : 'Copy code'}
              </ActionButton>
              <ActionButton
                variant="primary"
                onClick={() => onShareCard(lastPurchasedCard)}
              >
                Share gift card
              </ActionButton>
            </div>

            <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
              Only share this code with your intended recipient.
            </p>
          </div>

          <div className="bg-white flex flex-col gap-[24px] items-start p-[32px] rounded-[12px] w-full lg:w-[432px] shrink-0">
            <h2 className="font-archivo font-semibold text-[24.19px] leading-normal text-[#010817]">
              Purchase details
            </h2>

            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">Amount paid</span>
              <span className="font-archivo font-medium text-[#010817]">
                {formatNaira(lastPurchasedCard.initialValue)}
              </span>
            </div>
            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">Purchase date</span>
              <span className="font-archivo font-medium text-[#010817]">
                {lastPurchasedCard.purchasedDate}
              </span>
            </div>
            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">Payment method</span>
              <span className="font-archivo font-medium text-[#010817]">
                Visa · {getLast4()}
              </span>
            </div>
            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">Reference</span>
              <span className="font-archivo font-medium text-[#010817]">GC-251126-0842</span>
            </div>

            <div className="bg-[#ebebeb] h-px w-full" />

            <ActionButton variant="primary" onClick={() => onNavigate('06-active')}>
              View active gift cards
            </ActionButton>
            <ActionButton variant="secondary" onClick={() => onNavigate('01-available')}>
              Buy another gift card
            </ActionButton>
          </div>
        </div>

        <div className="bg-[#d7f1d3] flex flex-col gap-[10px] items-start p-[20px] rounded-[12px] text-[#010817] w-full">
          <p className="font-archivo font-semibold text-[16.8px] leading-normal">
            One gift card. One recipient.
          </p>
          <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
            The card locks to the first person who successfully redeems it. They can keep using the
            remaining balance on future payments.
          </p>
        </div>
      </div>
    );
  }

  // 05 · Payment unsuccessful
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[24px] px-[24px] md:px-[128px] pt-[32px] pb-[48px]">
      <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f] whitespace-pre-wrap">
        <button
          type="button"
          onClick={() => onNavigate('01-available')}
          className="hover:underline cursor-pointer"
        >
          Gift cards
        </button>
        {'  /  Payment unsuccessful'}
      </p>

      <div className="flex flex-col gap-[10px]">
        <h1 className="font-archivo font-semibold text-[29.03px] leading-normal text-[#010817]">
          Payment unsuccessful
        </h1>
        <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
          Your purchase was not completed.
        </p>
      </div>

      <div className="bg-white flex flex-col gap-[24px] items-start p-[32px] md:p-[48px] rounded-[12px] w-full">
        <h2 className="font-archivo font-semibold text-[24.19px] leading-normal text-[#010817]">
          Let’s try that again
        </h2>

        <div className="bg-[#fce8d7] flex flex-col gap-[10px] items-start p-[20px] rounded-[12px] text-[#010817] w-full">
          <p className="font-archivo font-semibold text-[16.8px] leading-normal">
            Your payment could not be completed
          </p>
          <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
            No gift card was created. Check your card details or try another payment method.
          </p>
        </div>

        <div className="flex items-start justify-between text-[14px] w-full">
          <span className="font-archivo text-[#6c727f]">Gift card</span>
          <span className="font-archivo font-medium text-[#010817]">
            {selectedDenom.label} CN gift card
          </span>
        </div>
        <div className="flex items-start justify-between text-[14px] w-full">
          <span className="font-archivo text-[#6c727f]">Amount attempted</span>
          <span className="font-archivo font-medium text-[#010817]">{selectedDenom.label}</span>
        </div>
        <div className="flex items-start justify-between text-[14px] w-full">
          <span className="font-archivo text-[#6c727f]">Payment method</span>
          <span className="font-archivo font-medium text-[#010817]">Visa · {getLast4()}</span>
        </div>

        <div className="bg-[#ebebeb] h-px w-full" />

        <div className="flex flex-wrap gap-[16px] w-full">
          <ActionButton
            variant="primary"
            onClick={() =>
              onCompletePurchase({
                name: nameOnCard,
                last4: getLast4(),
                email: receiptEmail,
              })
            }
          >
            Try payment again
          </ActionButton>
          <ActionButton
            variant="secondary"
            onClick={() => onNavigate('03-purchase-checkout')}
          >
            Change payment method
          </ActionButton>
        </div>

        <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
          If a debit appears on your bank account, keep your payment reference and contact support.
        </p>

        <ActionButton variant="secondary" onClick={() => onNavigate('01-available')}>
          Back to gift cards
        </ActionButton>
      </div>
    </div>
  );
}
