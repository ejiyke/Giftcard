import { useState } from 'react';
import { DENOMINATIONS, formatNaira } from '../data/giftCards';
import type { GiftCardItem, ScreenId, TransferDetails } from '../types/giftCard';
import { ActionButton } from '../components/Buttons';
import { GiftCardTabs } from '../components/GiftCardTabs';
import { GiftCardVisual } from '../components/GiftCardVisual';
import alertCircle from '../assets/alert-circle.svg';
import successCheck from '../assets/success-check.svg';

interface GiftTransferScreensProps {
  screen: '19-gift-select' | '20-gift-transfer' | '21-gift-success' | '22-gift-failed';
  activeCards: GiftCardItem[];
  usedCards: GiftCardItem[];
  selectedCard: GiftCardItem;
  lastTransferSummary: {
    card: GiftCardItem;
    transfer: TransferDetails;
  } | null;
  onSelectCardToGift: (card: GiftCardItem) => void;
  onCompleteTransfer: (
    cardCode: string,
    input: { recipientEmail: string; recipientName?: string; message?: string }
  ) => void;
  onNavigate: (screen: ScreenId) => void;
}

export function GiftTransferScreens({
  screen,
  activeCards,
  usedCards,
  selectedCard,
  lastTransferSummary,
  onSelectCardToGift,
  onCompleteTransfer,
  onNavigate,
}: GiftTransferScreensProps) {
  const [manualCode, setManualCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);

  const [recipientEmail, setRecipientEmail] = useState('chidi.nwosu@example.com');
  const [recipientName, setRecipientName] = useState('Chidi Nwosu');
  const [personalMessage, setPersonalMessage] = useState(
    'Enjoy this Connect Nigeria gift card for your next business listing or Quote Request!'
  );
  const [formError, setFormError] = useState<string | null>(null);

  const eligibleCards = activeCards.filter((c) => c.currentBalance > 0);
  const targetCard =
    selectedCard.currentBalance > 0
      ? selectedCard
      : eligibleCards[0] || selectedCard;

  const handleCheckManualCode = () => {
    const trimmed = manualCode.trim().toUpperCase();
    if (!trimmed) {
      setCodeError('Enter a gift card code to check eligibility.');
      return;
    }

    const activeMatch = activeCards.find((c) => c.code.toUpperCase() === trimmed);
    if (activeMatch && activeMatch.currentBalance > 0) {
      setCodeError(null);
      onSelectCardToGift(activeMatch);
      onNavigate('20-gift-transfer');
      return;
    }

    const usedMatch = usedCards.find((c) => c.code.toUpperCase() === trimmed);
    if (usedMatch) {
      setCodeError('This gift card has a ₦0 balance and cannot be transferred.');
      return;
    }

    setCodeError(
      'We could not find an active gift card with that code. Check the code and try again.'
    );
  };

  const handleConfirmTransfer = () => {
    const email = recipientEmail.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Enter a valid recipient email address.');
      return;
    }
    setFormError(null);
    onCompleteTransfer(targetCard.code, {
      recipientEmail: email,
      recipientName: recipientName.trim() || undefined,
      message: personalMessage.trim() || undefined,
    });
  };

  if (screen === '19-gift-select') {
    return (
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[24px] px-[24px] md:px-[128px] pt-[32px] pb-[48px]">
        <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f] whitespace-pre-wrap">
          {'Account  /  Gift cards  /  Gift a card'}
        </p>

        <div className="flex flex-col gap-[10px]">
          <h1 className="font-archivo font-semibold text-[29.03px] leading-normal text-[#010817]">
            Transfer a gift card to someone special
          </h1>
          <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
            Pass ownership of any active Connect Nigeria gift card with a remaining balance.
          </p>
        </div>

        <div className="bg-[#d7f1d3] flex flex-col md:flex-row gap-[24px] md:gap-[48px] items-start p-[28px] rounded-[12px] text-[#010817]">
          <div className="flex flex-1 flex-col gap-[12px]">
            <h2 className="font-archivo font-semibold text-[24.19px] leading-normal">
              Transfer ownership at no fee
            </h2>
            <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
              Gift any active card—whether unredeemed or partially used—to a new recipient.
              Transfers are completely free (₦0 fee) and 100% of the remaining balance moves to
              their account.
            </p>
          </div>
          <div className="flex flex-col gap-[12px] w-full md:w-[330px] shrink-0 whitespace-pre-wrap">
            <p className="font-archivo font-semibold text-[16.8px] leading-normal">
              {'01  Choose a card    02  Enter recipient'}
            </p>
            <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
              {'03  Confirm transfer of ownership'}
            </p>
          </div>
        </div>

        <GiftCardTabs
          activeTab="gift"
          availableCount={DENOMINATIONS.length}
          activeCount={activeCards.length}
          usedCount={usedCards.length}
          onSelectTab={onNavigate}
        />

        <div className="flex flex-col lg:flex-row gap-[32px] items-start w-full">
          {/* Left: Eligible active cards */}
          <div className="flex flex-1 flex-col gap-[20px] w-full">
            <h2 className="font-archivo font-semibold text-[20.16px] leading-normal text-[#010817]">
              Your active cards eligible to gift
            </h2>

            {eligibleCards.length === 0 ? (
              <div className="bg-white flex flex-col gap-[16px] items-start p-[32px] rounded-[12px] w-full">
                <p className="font-archivo font-semibold text-[16.8px] text-[#010817]">
                  No active cards with a balance
                </p>
                <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
                  You do not have any active gift cards right now. Buy a gift card or enter a code
                  on the right.
                </p>
                <ActionButton variant="primary" onClick={() => onNavigate('01-available')}>
                  Browse available cards
                </ActionButton>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] w-full">
                {eligibleCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white flex flex-col gap-[16px] items-start p-[24px] rounded-[12px]"
                  >
                    <GiftCardVisual amount={card.initialValue} theme={card.theme} />
                    <p className="font-archivo font-semibold text-[16.8px] leading-normal text-[#010817]">
                      {card.status === 'linked' ? 'Linked to a recipient' : 'Not yet redeemed'}
                    </p>
                    <div className="flex flex-col gap-[4px] w-full">
                      <p className="font-archivo font-semibold text-[20.16px] leading-normal text-[#010817] whitespace-pre-wrap">
                        {`Transferable balance   ${formatNaira(card.currentBalance)}`}
                      </p>
                      <p className="font-archivo font-medium text-[14px] text-[#010817]">
                        100% transfers to recipient · ₦0 fee
                      </p>
                    </div>
                    <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f] whitespace-pre-wrap">
                      {`Purchased ${card.purchasedDate}   ·   ${card.code}`}
                    </p>
                    <ActionButton
                      variant="primary"
                      onClick={() => {
                        onSelectCardToGift(card);
                        onNavigate('20-gift-transfer');
                      }}
                    >
                      Gift this card
                    </ActionButton>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Manual code entry */}
          <div className="bg-white flex flex-col gap-[20px] items-start p-[28px] rounded-[12px] w-full lg:w-[400px] shrink-0">
            <h2 className="font-archivo font-semibold text-[20.16px] leading-normal text-[#010817]">
              Or enter a gift card code
            </h2>
            <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
              Enter a Connect Nigeria gift card code to verify its balance and transfer ownership.
            </p>

            <label className="flex flex-col gap-[6px] w-full">
              <span className="font-archivo font-medium text-[14px] text-[#344054]">
                Gift card code
              </span>
              <div
                className={`bg-white border ${
                  codeError ? 'border-[#fda29b]' : 'border-[#d0d5dd]'
                } flex items-center gap-[8px] px-[14px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] w-full`}
              >
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => {
                    setManualCode(e.target.value);
                    if (codeError) setCodeError(null);
                  }}
                  placeholder="e.g. CN-8R3D-6T5W"
                  className="flex-1 bg-transparent font-archivo text-[16.8px] text-[#101828] placeholder:text-[#667085] outline-none"
                />
                {codeError && (
                  <img src={alertCircle} alt="Error" className="size-[16px] shrink-0" />
                )}
              </div>
            </label>

            {codeError && (
              <div className="bg-[#fce8d7] flex flex-col gap-[8px] items-start p-[16px] rounded-[12px] w-full">
                <p className="font-archivo font-semibold text-[14px] text-[#bf5933]">
                  Card not eligible
                </p>
                <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#010817]">
                  {codeError}
                </p>
              </div>
            )}

            <ActionButton variant="secondary" onClick={handleCheckManualCode}>
              Check eligibility
            </ActionButton>

            <div className="bg-[#ebebeb] h-px w-full" />

            <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
              Test codes: <span className="font-medium text-[#010817]">CN-7K9M-4P2X</span> (₦15,000)
              or <span className="font-medium text-[#010817]">CN-8R3D-6T5W</span> (₦25,000).
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (screen === '20-gift-transfer') {
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
          {'  /  '}
          <button
            type="button"
            onClick={() => onNavigate('19-gift-select')}
            className="hover:underline cursor-pointer"
          >
            Gift a card
          </button>
          {'  /  Transfer ownership'}
        </p>

        <div className="flex flex-col gap-[10px]">
          <h1 className="font-archivo font-semibold text-[29.03px] leading-normal text-[#010817]">
            Who are you gifting this card to?
          </h1>
          <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
            Enter the recipient’s details to transfer full ownership of this gift card.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-[32px] items-start w-full">
          {/* Left: Recipient form */}
          <div className="bg-white flex flex-1 flex-col gap-[24px] items-start p-[32px] rounded-[12px] w-full">
            <h2 className="font-archivo font-semibold text-[24.19px] leading-normal text-[#010817]">
              Recipient details
            </h2>

            <div className="bg-[#d7f1d3] flex flex-col gap-[10px] items-start p-[20px] rounded-[12px] text-[#010817] w-full">
              <p className="font-archivo font-semibold text-[16.8px] leading-normal whitespace-pre-wrap">
                {'●  Direct ownership transfer'}
              </p>
              <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
                The recipient receives the remaining balance in their Connect Nigeria account
                immediately.
              </p>
            </div>

            <label className="flex flex-col gap-[6px] w-full">
              <span className="font-archivo font-medium text-[14px] text-[#344054]">
                Recipient email
              </span>
              <div
                className={`bg-white border ${
                  formError ? 'border-[#fda29b]' : 'border-[#d0d5dd]'
                } flex items-center gap-[8px] px-[14px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] w-full`}
              >
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => {
                    setRecipientEmail(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="recipient@example.com"
                  className="flex-1 bg-transparent font-archivo text-[16.8px] text-[#101828] outline-none"
                />
                {formError && (
                  <img src={alertCircle} alt="Error" className="size-[16px] shrink-0" />
                )}
              </div>
            </label>

            <label className="flex flex-col gap-[6px] w-full">
              <span className="font-archivo font-medium text-[14px] text-[#344054]">
                Recipient name (optional)
              </span>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Chidi Nwosu"
                className="bg-white border border-[#d0d5dd] px-[14px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] font-archivo text-[16.8px] text-[#101828] outline-none focus:border-[#35bb25]"
              />
            </label>

            <label className="flex flex-col gap-[6px] w-full">
              <span className="font-archivo font-medium text-[14px] text-[#344054]">
                Personal gift message (optional)
              </span>
              <textarea
                rows={3}
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                placeholder="Write a short note for your recipient..."
                className="bg-white border border-[#d0d5dd] px-[14px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] font-archivo text-[15px] text-[#101828] outline-none focus:border-[#35bb25] resize-none"
              />
            </label>

            {formError && (
              <p className="font-archivo font-normal text-[14px] text-[#bf5933]">{formError}</p>
            )}

            <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
              Once transferred, ownership moves immediately to the recipient and you will no longer
              be able to use this card.
            </p>
          </div>

          {/* Right: Transfer summary */}
          <div className="bg-white flex flex-col gap-[22px] items-start p-[32px] rounded-[12px] w-full lg:w-[432px] shrink-0">
            <h2 className="font-archivo font-semibold text-[24.19px] leading-normal text-[#010817]">
              Transfer summary
            </h2>

            <div className="bg-[#d7f1d3] flex flex-col gap-[10px] items-start p-[20px] rounded-[12px] text-[#010817] w-full">
              <p className="font-archivo font-semibold text-[16.8px] leading-normal">
                {targetCard.code}
              </p>
              <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
                {targetCard.status === 'linked' ? 'Linked to a recipient' : 'Not yet redeemed'} ·{' '}
                {formatNaira(targetCard.currentBalance)} balance
              </p>
            </div>

            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">Remaining balance</span>
              <span className="font-archivo font-medium text-[#010817]">
                {formatNaira(targetCard.currentBalance)}
              </span>
            </div>

            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">Transfer fee</span>
              <span className="font-archivo font-medium text-[#010817]">₦0 (Free)</span>
            </div>

            <div className="bg-[#ebebeb] h-px w-full" />

            <div className="flex items-start justify-between font-archivo font-semibold text-[16.8px] text-[#010817] w-full">
              <span>Recipient receives</span>
              <span>{formatNaira(targetCard.currentBalance)}</span>
            </div>

            <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
              Ownership will be transferred to{' '}
              <span className="font-medium text-[#010817]">
                {recipientEmail.trim() || 'your recipient'}
              </span>{' '}
              immediately.
            </p>

            <div className="flex flex-col gap-[12px] w-full items-start">
              <ActionButton variant="primary" onClick={handleConfirmTransfer}>
                Confirm transfer
              </ActionButton>
              <ActionButton variant="secondary" onClick={() => onNavigate('19-gift-select')}>
                Choose another card
              </ActionButton>
              <button
                type="button"
                onClick={() => onNavigate('22-gift-failed')}
                className="font-archivo text-[13px] text-[#6c727f] underline hover:text-[#010817] cursor-pointer"
              >
                Simulate transfer error
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === '21-gift-success') {
    const transferredCard = lastTransferSummary?.card || targetCard;
    const transfer = lastTransferSummary?.transfer || {
      recipientEmail: recipientEmail.trim() || 'chidi.nwosu@example.com',
      recipientName: recipientName.trim() || 'Chidi Nwosu',
      message: personalMessage.trim(),
      transferredAmount: targetCard.currentBalance || 15000,
      reference: 'TRF-261126-0412',
      transferredDate: '26 Nov 2026',
    };

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
          {'  /  Gift a card  /  Transfer successful'}
        </p>

        <div className="flex flex-col gap-[10px]">
          <h1 className="font-archivo font-semibold text-[29.03px] leading-normal text-[#010817]">
            Ownership transferred
          </h1>
          <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
            Your gift card has been sent and moved to Inactive/Used.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-[32px] items-start w-full">
          <div className="bg-white flex flex-1 flex-col gap-[24px] items-start p-[32px] rounded-[12px] w-full">
            <img src={successCheck} alt="Transfer successful" className="size-[48px]" />
            <h2 className="font-archivo font-semibold text-[24.19px] leading-normal text-[#010817]">
              {formatNaira(transfer.transferredAmount)} gifted to{' '}
              {transfer.recipientName || transfer.recipientEmail}
            </h2>

            <div className="bg-[#d7f1d3] flex flex-col gap-[10px] items-start p-[20px] rounded-[12px] text-[#010817] w-full">
              <p className="font-archivo font-semibold text-[16.8px] leading-normal">
                Sent to {transfer.recipientEmail}
              </p>
              {transfer.message && (
                <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
                  “{transfer.message}”
                </p>
              )}
            </div>

            <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
              Transferred gift card
            </p>
            <p className="font-archivo font-semibold text-[24.19px] leading-normal text-[#010817]">
              {transferredCard.code}
            </p>

            <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
              Ownership now belongs to {transfer.recipientEmail}. Your remaining balance on this
              card is ₦0.
            </p>
          </div>

          <div className="bg-white flex flex-col gap-[24px] items-start p-[32px] rounded-[12px] w-full lg:w-[432px] shrink-0">
            <h2 className="font-archivo font-semibold text-[24.19px] leading-normal text-[#010817]">
              Transfer receipt
            </h2>

            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">Balance transferred</span>
              <span className="font-archivo font-medium text-[#010817]">
                {formatNaira(transfer.transferredAmount)}
              </span>
            </div>
            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">Transfer fee</span>
              <span className="font-archivo font-medium text-[#010817]">₦0</span>
            </div>
            <div className="flex items-start justify-between font-archivo font-semibold text-[16.8px] text-[#010817] w-full">
              <span>Recipient received</span>
              <span>{formatNaira(transfer.transferredAmount)}</span>
            </div>

            <div className="bg-[#ebebeb] h-px w-full" />

            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">Transfer date</span>
              <span className="font-archivo font-medium text-[#010817]">
                {transfer.transferredDate}
              </span>
            </div>
            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">Reference</span>
              <span className="font-archivo font-medium text-[#010817]">{transfer.reference}</span>
            </div>

            <div className="bg-[#ebebeb] h-px w-full" />

            <ActionButton variant="primary" onClick={() => onNavigate('10-inactive-used')}>
              View Inactive/Used cards
            </ActionButton>
            <ActionButton variant="secondary" onClick={() => onNavigate('19-gift-select')}>
              Gift another card
            </ActionButton>
            <ActionButton variant="secondary" onClick={() => onNavigate('01-available')}>
              Back to gift cards
            </ActionButton>
          </div>
        </div>
      </div>
    );
  }

  // 22 · Gift — Transfer failed
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
        {'  /  Gift a card  /  Transfer failed'}
      </p>

      <div className="flex flex-col gap-[10px]">
        <h1 className="font-archivo font-semibold text-[29.03px] leading-normal text-[#010817]">
          Transfer unsuccessful
        </h1>
        <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
          Your gift card was not transferred.
        </p>
      </div>

      <div className="bg-white flex flex-col gap-[24px] items-start p-[32px] md:p-[48px] rounded-[12px] w-full">
        <h2 className="font-archivo font-semibold text-[24.19px] leading-normal text-[#010817]">
          Let’s try that again
        </h2>

        <div className="bg-[#fce8d7] flex flex-col gap-[10px] items-start p-[20px] rounded-[12px] text-[#010817] w-full">
          <p className="font-archivo font-semibold text-[16.8px] leading-normal text-[#bf5933]">
            We could not complete this transfer
          </p>
          <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
            Your gift card is still active and no balance was transferred. Check the recipient email
            and try again.
          </p>
        </div>

        <div className="flex items-start justify-between text-[14px] w-full">
          <span className="font-archivo text-[#6c727f]">Gift card</span>
          <span className="font-archivo font-medium text-[#010817]">{targetCard.code}</span>
        </div>
        <div className="flex items-start justify-between text-[14px] w-full">
          <span className="font-archivo text-[#6c727f]">Balance</span>
          <span className="font-archivo font-medium text-[#010817]">
            {formatNaira(targetCard.currentBalance)}
          </span>
        </div>
        <div className="flex items-start justify-between text-[14px] w-full">
          <span className="font-archivo text-[#6c727f]">Recipient</span>
          <span className="font-archivo font-medium text-[#010817]">
            {recipientEmail.trim() || 'chidi.nwosu@example.com'}
          </span>
        </div>

        <div className="bg-[#ebebeb] h-px w-full" />

        <div className="flex flex-wrap gap-[16px] w-full">
          <ActionButton variant="primary" onClick={() => onNavigate('20-gift-transfer')}>
            Try transfer again
          </ActionButton>
          <ActionButton variant="secondary" onClick={() => onNavigate('20-gift-transfer')}>
            Edit recipient details
          </ActionButton>
        </div>

        <ActionButton variant="secondary" onClick={() => onNavigate('01-available')}>
          Back to gift cards
        </ActionButton>
      </div>
    </div>
  );
}
