import { formatNaira, DENOMINATIONS } from '../data/giftCards';
import type { GiftCardItem, ScreenId } from '../types/giftCard';
import { ActionButton } from '../components/Buttons';
import { GiftCardTabs } from '../components/GiftCardTabs';
import { GiftCardVisual } from '../components/GiftCardVisual';

interface ManageCardsProps {
  screen:
    | '06-active'
    | '07-active-details'
    | '08-share'
    | '09-linked-recipient'
    | '10-inactive-used'
    | '11-used-details'
    | '18-empty-active';
  activeCards: GiftCardItem[];
  usedCards: GiftCardItem[];
  selectedCard: GiftCardItem;
  onSelectCard: (card: GiftCardItem, targetScreen: ScreenId) => void;
  onNavigate: (screen: ScreenId) => void;
  onCopyCode: (code: string) => void;
  copiedCode: string | null;
}

export function ManageCardsScreens({
  screen,
  activeCards,
  usedCards,
  selectedCard,
  onSelectCard,
  onNavigate,
  onCopyCode,
  copiedCode,
}: ManageCardsProps) {
  if (screen === '06-active') {
    const totalActiveBalance = activeCards.reduce((sum, c) => sum + c.currentBalance, 0);
    const readyToShareCount = activeCards.filter((c) => c.status === 'unredeemed').length;

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
            Manage your balance and share a little possibility.
          </p>
        </div>

        <GiftCardTabs
          activeTab="active"
          availableCount={DENOMINATIONS.length}
          activeCount={activeCards.length}
          usedCount={usedCards.length}
          onSelectTab={onNavigate}
        />

        <div className="bg-white grid grid-cols-1 sm:grid-cols-3 gap-[24px] md:gap-[60px] p-[24px] rounded-[12px] w-full">
          <div className="flex flex-col gap-[8px]">
            <p className="font-archivo font-semibold text-[24.19px] leading-normal text-[#010817]">
              {formatNaira(totalActiveBalance)}
            </p>
            <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
              Total active balance
            </p>
          </div>
          <div className="flex flex-col gap-[8px]">
            <p className="font-archivo font-semibold text-[24.19px] leading-normal text-[#010817]">
              {activeCards.length} {activeCards.length === 1 ? 'card' : 'cards'}
            </p>
            <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
              With a balance
            </p>
          </div>
          <div className="flex flex-col gap-[8px]">
            <p className="font-archivo font-semibold text-[24.19px] leading-normal text-[#010817]">
              {readyToShareCount} {readyToShareCount === 1 ? 'card' : 'cards'}
            </p>
            <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
              Ready to share
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] w-full">
          {activeCards.map((card) => (
            <div
              key={card.id}
              className="bg-white flex flex-col gap-[18px] items-start p-[24px] rounded-[12px]"
            >
              <GiftCardVisual amount={card.initialValue} theme={card.theme} />
              <p className="font-archivo font-semibold text-[16.8px] leading-normal text-[#010817]">
                {card.status === 'linked' ? 'Linked to a recipient' : 'Not yet redeemed'}
              </p>
              <p className="font-archivo font-semibold text-[20.16px] leading-normal text-[#010817] whitespace-pre-wrap">
                {`Current balance   ${formatNaira(card.currentBalance)}`}
              </p>
              <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f] whitespace-pre-wrap">
                {`Purchased ${card.purchasedDate}   ·   ${card.code}`}
              </p>
              <ActionButton
                variant="secondary"
                onClick={() =>
                  onSelectCard(
                    card,
                    card.status === 'linked' ? '09-linked-recipient' : '07-active-details'
                  )
                }
              >
                View card details
              </ActionButton>
            </div>
          ))}
        </div>

        <div className="bg-[#d7f1d3] flex flex-col gap-[8px] items-start p-[20px] rounded-[12px] text-[#010817] w-full">
          <p className="font-archivo font-semibold text-[16.8px] leading-normal">
            Your cards stay organised
          </p>
          <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
            Cards with a balance appear here. When the balance reaches zero, they move to
            Inactive/Used automatically.
          </p>
        </div>
      </div>
    );
  }

  if (screen === '07-active-details') {
    const isCopied = copiedCode === selectedCard.code;

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
            onClick={() => onNavigate('06-active')}
            className="hover:underline cursor-pointer"
          >
            Active
          </button>
          {'  /  Card details'}
        </p>

        <div className="flex flex-col gap-[10px]">
          <h1 className="font-archivo font-semibold text-[29.03px] leading-normal text-[#010817]">
            Your {formatNaira(selectedCard.initialValue)} gift card
          </h1>
          <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
            Ready when you are. Use it yourself or share it with one person.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-[32px] items-start w-full">
          <div className="bg-[#010817] flex flex-1 flex-col gap-[20px] items-start p-[32px] rounded-[12px] text-white w-full">
            <p className="font-archivo font-medium text-[14px] leading-normal whitespace-pre-wrap">
              {'connect NIGERIA   /   GIFT CARD'}
            </p>
            <p className="font-archivo font-semibold text-[29.03px] leading-normal">
              {formatNaira(selectedCard.currentBalance)}
            </p>
            <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
              Current balance
            </p>
            <div className="bg-[#ebebeb] h-px w-full" />
            <p className="font-archivo font-semibold text-[20.16px] leading-normal">
              {selectedCard.code}
            </p>
          </div>

          <div className="bg-white flex flex-1 flex-col gap-[20px] items-start p-[32px] rounded-[12px] w-full">
            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">Status</span>
              <span className="font-archivo font-medium text-[#010817]">
                Active · Not yet redeemed
              </span>
            </div>
            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">Purchase date</span>
              <span className="font-archivo font-medium text-[#010817]">
                {selectedCard.purchasedDate}
              </span>
            </div>
            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">Initial value</span>
              <span className="font-archivo font-medium text-[#010817]">
                {formatNaira(selectedCard.initialValue)}
              </span>
            </div>
            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">Current balance</span>
              <span className="font-archivo font-medium text-[#010817]">
                {formatNaira(selectedCard.currentBalance)}
              </span>
            </div>
            <div className="flex flex-wrap gap-[16px] w-full">
              <ActionButton
                variant="secondary"
                onClick={() => onCopyCode(selectedCard.code)}
              >
                {isCopied ? 'Code copied' : 'Copy code'}
              </ActionButton>
              <ActionButton
                variant="primary"
                onClick={() => onSelectCard(selectedCard, '08-share')}
              >
                Share gift card
              </ActionButton>
            </div>
          </div>
        </div>

        <div className="bg-[#d7f1d3] flex flex-col gap-[10px] items-start p-[20px] rounded-[12px] text-[#010817] w-full">
          <p className="font-archivo font-semibold text-[16.8px] leading-normal">
            Only one recipient can use this card
          </p>
          <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
            The first person to redeem it successfully becomes the recipient. Once linked, it cannot
            be used by someone else.
          </p>
        </div>

        <div className="bg-white flex flex-col gap-[16px] items-start p-[28px] rounded-[12px] w-full">
          <h2 className="font-archivo font-semibold text-[20.16px] leading-normal text-[#010817]">
            Payment history
          </h2>
          <p className="font-archivo font-semibold text-[16.8px] leading-normal text-[#010817]">
            No payments yet
          </p>
          <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
            Successful deductions will appear here after the card is used at checkout.
          </p>
        </div>
      </div>
    );
  }

  if (screen === '08-share') {
    const shareMsg = `A gift for you! Use code ${selectedCard.code} to pay for services on Connect Nigeria or Quote Request. Your gift card is worth ${formatNaira(selectedCard.currentBalance)}.`;

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
            onClick={() => onNavigate('06-active')}
            className="hover:underline cursor-pointer"
          >
            Active
          </button>
          {'  /  Share'}
        </p>

        <div className="flex flex-col gap-[10px]">
          <h1 className="font-archivo font-semibold text-[29.03px] leading-normal text-[#010817]">
            Share a little possibility
          </h1>
          <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
            Send the code privately to your intended recipient.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-[32px] items-start w-full">
          <div className="bg-[#d7f1d3] flex flex-1 flex-col gap-[24px] items-start p-[32px] rounded-[12px] text-[#010817] w-full">
            <h2 className="font-archivo font-semibold text-[24.19px] leading-normal">
              A gift for someone special
            </h2>
            <p className="font-archivo font-semibold text-[29.03px] leading-normal">
              {formatNaira(selectedCard.initialValue)}
            </p>
            <div className="font-archivo font-normal text-[14px] leading-[115.625%]">
              <p className="mb-0">CN gift card</p>
              <p>For services on Connect Nigeria and Quote Request.</p>
            </div>
            <p className="font-archivo font-semibold text-[16.8px] leading-normal">
              Not yet redeemed · Balance {formatNaira(selectedCard.currentBalance)}
            </p>
          </div>

          <div className="bg-white flex flex-1 flex-col gap-[24px] items-start p-[32px] rounded-[12px] w-full">
            <h2 className="font-archivo font-semibold text-[20.16px] leading-normal text-[#010817]">
              Your gift card code
            </h2>

            <div className="bg-[#d7f1d3] flex flex-col gap-[10px] items-start p-[20px] rounded-[12px] text-[#010817] w-full">
              <p className="font-archivo font-semibold text-[16.8px] leading-normal">
                {selectedCard.code}
              </p>
              <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
                Code copied. Paste it into a private message.
              </p>
            </div>

            <div className="flex flex-wrap gap-[16px] w-full">
              <ActionButton
                variant="secondary"
                onClick={() => onCopyCode(selectedCard.code)}
              >
                {copiedCode === selectedCard.code ? 'Copied!' : 'Copy code again'}
              </ActionButton>
              <a
                href={`mailto:?subject=${encodeURIComponent(
                  'Your Connect Nigeria Gift Card'
                )}&body=${encodeURIComponent(shareMsg)}`}
                className="inline-flex items-center justify-center gap-[8px] px-[18px] py-[10px] rounded-[12px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] font-inter font-semibold text-[16px] leading-[24px] whitespace-nowrap bg-[#35bb25] border border-[#35bb25] text-[#010817] hover:bg-[#2fa820] transition-colors"
              >
                Share by email
              </a>
            </div>

            <h3 className="font-archivo font-semibold text-[16.8px] leading-normal text-[#010817]">
              Message preview
            </h3>
            <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#010817]">
              {shareMsg}
            </p>

            <div className="bg-[#ebebeb] h-px w-full" />

            <h3 className="font-archivo font-semibold text-[16.8px] leading-normal text-[#010817]">
              Share with one person only
            </h3>
            <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
              The first successful redemption locks this card to that person. Do not post your code
              publicly.
            </p>

            <ActionButton
              variant="secondary"
              onClick={() => onSelectCard(selectedCard, '07-active-details')}
            >
              Done
            </ActionButton>
          </div>
        </div>

        <div className="bg-[#d7f1d3] flex flex-col gap-[10px] items-start p-[20px] rounded-[12px] text-[#010817] w-full">
          <p className="font-archivo font-semibold text-[16.8px] leading-normal">
            For your recipient
          </p>
          <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
            At service checkout, select Pay with Gift Card, enter this code, and choose the amount
            to use.
          </p>
        </div>
      </div>
    );
  }

  if (screen === '09-linked-recipient') {
    const linkedCard =
      selectedCard.status === 'linked'
        ? selectedCard
        : activeCards.find((c) => c.status === 'linked') || selectedCard;
    const totalUsed = linkedCard.initialValue - linkedCard.currentBalance;
    const isCopied = copiedCode === linkedCard.code;

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
            onClick={() => onNavigate('06-active')}
            className="hover:underline cursor-pointer"
          >
            Active
          </button>
          {'  /  Card details'}
        </p>

        <div className="flex flex-col gap-[10px]">
          <h1 className="font-archivo font-semibold text-[29.03px] leading-normal text-[#010817]">
            Your {formatNaira(linkedCard.initialValue)} gift card
          </h1>
          <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
            Keep track of your gift and every successful payment.
          </p>
        </div>

        <div className="bg-[#d7f1d3] flex flex-col gap-[10px] items-start p-[20px] rounded-[12px] text-[#010817] w-full">
          <p className="font-archivo font-semibold text-[16.8px] leading-normal">
            This card is linked to its recipient
          </p>
          <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
            The first successful redemption linked this card to one person. Only that recipient can
            use the remaining balance.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-[32px] items-start w-full">
          <div className="bg-[#010817] flex flex-1 flex-col gap-[16px] items-start p-[28px] rounded-[12px] text-white w-full">
            <p className="font-archivo font-medium text-[14px] leading-normal whitespace-pre-wrap">
              {'connect NIGERIA   /   GIFT CARD'}
            </p>
            <p className="font-archivo font-semibold text-[29.03px] leading-normal">
              {formatNaira(linkedCard.currentBalance)}
            </p>
            <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
              Current balance · {formatNaira(linkedCard.initialValue)} initial value
            </p>
            <p className="font-archivo font-semibold text-[20.16px] leading-normal">
              {linkedCard.code}
            </p>
          </div>

          <div className="bg-white flex flex-1 flex-col gap-[16px] items-start p-[28px] rounded-[12px] w-full">
            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">Purchased</span>
              <span className="font-archivo font-medium text-[#010817]">
                {linkedCard.purchasedDate}
              </span>
            </div>
            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">First redeemed</span>
              <span className="font-archivo font-medium text-[#010817]">
                {linkedCard.firstRedeemedDate || '19 Nov 2026'}
              </span>
            </div>
            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">Total used</span>
              <span className="font-archivo font-medium text-[#010817]">
                {formatNaira(totalUsed)}
              </span>
            </div>
            <ActionButton
              variant="secondary"
              onClick={() => onCopyCode(linkedCard.code)}
            >
              {isCopied ? 'Code copied' : 'Copy code'}
            </ActionButton>
            <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
              Copying the code does not change who can use it.
            </p>
          </div>
        </div>

        <div className="bg-white flex flex-col gap-[20px] items-start p-[28px] rounded-[12px] w-full overflow-x-auto">
          <h2 className="font-archivo font-semibold text-[20.16px] leading-normal text-[#010817]">
            Payment history
          </h2>
          <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
            Every successful deduction from this card.
          </p>

          <div className="min-w-[680px] w-full">
            <div className="bg-[#f4f4f4] grid grid-cols-[160px_1fr_210px_180px] gap-[24px] p-[16px] rounded-[12px] font-archivo font-medium text-[14px] text-[#6c727f]">
              <span>Date</span>
              <span>Service</span>
              <span>Deduction</span>
              <span>Balance after</span>
            </div>
            {linkedCard.history.map((row, idx) => (
              <div key={idx}>
                <div className="grid grid-cols-[160px_1fr_210px_180px] gap-[24px] p-[16px] text-[14px] text-[#010817]">
                  <span className="font-archivo font-normal leading-[115.625%]">{row.date}</span>
                  <span className="font-archivo font-normal leading-[115.625%]">
                    {row.service}
                  </span>
                  <span className="font-archivo font-semibold leading-normal">
                    −{formatNaira(row.deduction)}
                  </span>
                  <span className="font-archivo font-normal leading-[115.625%]">
                    {formatNaira(row.balanceAfter)}
                  </span>
                </div>
                <div className="bg-[#ebebeb] h-px w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (screen === '10-inactive-used') {
    const usedCard = usedCards[0];

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
            Your previously used gift cards, all in one place.
          </p>
        </div>

        <GiftCardTabs
          activeTab="used"
          availableCount={DENOMINATIONS.length}
          activeCount={activeCards.length}
          usedCount={usedCards.length}
          onSelectTab={onNavigate}
        />

        {usedCards.map((card) => (
          <div
            key={card.id}
            className="bg-white flex flex-col md:flex-row gap-[32px] items-start p-[24px] rounded-[12px] w-full"
          >
            <div className="w-full md:w-[390px] shrink-0">
              <GiftCardVisual
                amount={card.initialValue}
                theme="peach"
                subtitle="Fully used · Balance ₦0"
              />
            </div>

            <div className="flex flex-1 flex-col gap-[16px] items-start">
              <h2 className="font-archivo font-semibold text-[24.19px] leading-normal text-[#010817]">
                {formatNaira(card.initialValue)} gift card
              </h2>
              <p className="font-archivo font-semibold text-[16.8px] leading-normal text-[#6c727f]">
                Fully used
              </p>
              <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#010817] whitespace-pre-wrap">
                {`${card.code}   ·   Purchased ${card.purchasedDate}`}
              </p>
              <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f] whitespace-pre-wrap">
                {`Current balance  ₦0  ·  Last used ${card.lastUsedDate || '18 Nov 2026'}`}
              </p>
              <ActionButton
                variant="secondary"
                onClick={() => onSelectCard(card, '11-used-details')}
              >
                View payment history
              </ActionButton>
            </div>
          </div>
        ))}

        {usedCard && (
          <div className="bg-[#d7f1d3] flex flex-col gap-[8px] items-start p-[20px] rounded-[12px] text-[#010817] w-full">
            <p className="font-archivo font-semibold text-[16.8px] leading-normal">
              Every gift has a story
            </p>
            <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
              Your payment history stays available after a card is fully used. Buy another card
              whenever you are ready.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (screen === '11-used-details') {
    const usedCard =
      selectedCard.status === 'used' ? selectedCard : usedCards[0];

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
            onClick={() => onNavigate('10-inactive-used')}
            className="hover:underline cursor-pointer"
          >
            Inactive/Used
          </button>
          {'  /  Card details'}
        </p>

        <div className="flex flex-col gap-[10px]">
          <h1 className="font-archivo font-semibold text-[29.03px] leading-normal text-[#010817]">
            Your {formatNaira(usedCard.initialValue)} gift card
          </h1>
          <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
            Fully used, with your payment history safely kept here.
          </p>
        </div>

        <div className="bg-white flex flex-col md:flex-row gap-[40px] items-start p-[28px] rounded-[12px] w-full">
          <div className="bg-[#fce8d7] flex flex-1 flex-col gap-[14px] items-start p-[24px] rounded-[12px] text-[#010817] w-full">
            <p className="font-archivo font-semibold text-[16.8px] leading-normal">Fully used</p>
            <p className="font-archivo font-semibold text-[29.03px] leading-normal">₦0</p>
            <p className="font-archivo font-normal text-[14px] leading-[115.625%]">
              Current balance · {usedCard.code}
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-[18px] items-start w-full">
            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">Purchased</span>
              <span className="font-archivo font-medium text-[#010817]">
                {usedCard.purchasedDate}
              </span>
            </div>
            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">Initial value</span>
              <span className="font-archivo font-medium text-[#010817]">
                {formatNaira(usedCard.initialValue)}
              </span>
            </div>
            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">Total used</span>
              <span className="font-archivo font-medium text-[#010817]">
                {formatNaira(usedCard.initialValue)}
              </span>
            </div>
            <div className="flex items-start justify-between text-[14px] w-full">
              <span className="font-archivo text-[#6c727f]">Last used</span>
              <span className="font-archivo font-medium text-[#010817]">
                {usedCard.lastUsedDate || '18 Nov 2026'}
              </span>
            </div>
            <ActionButton variant="primary" onClick={() => onNavigate('01-available')}>
              Buy another gift card
            </ActionButton>
          </div>
        </div>

        <div className="bg-white flex flex-col gap-[20px] items-start p-[28px] rounded-[12px] w-full overflow-x-auto">
          <h2 className="font-archivo font-semibold text-[20.16px] leading-normal text-[#010817]">
            Payment history
          </h2>
          <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
            Every successful deduction from this card.
          </p>

          <div className="min-w-[680px] w-full">
            <div className="bg-[#f4f4f4] grid grid-cols-[160px_1fr_210px_180px] gap-[24px] p-[16px] rounded-[12px] font-archivo font-medium text-[14px] text-[#6c727f]">
              <span>Date</span>
              <span>Service</span>
              <span>Deduction</span>
              <span>Balance after</span>
            </div>
            {usedCard.history.map((row, idx) => (
              <div key={idx}>
                <div className="grid grid-cols-[160px_1fr_210px_180px] gap-[24px] p-[16px] text-[14px] text-[#010817]">
                  <span className="font-archivo font-normal leading-[115.625%]">{row.date}</span>
                  <span className="font-archivo font-normal leading-[115.625%]">
                    {row.service}
                  </span>
                  <span className="font-archivo font-semibold leading-normal">
                    −{formatNaira(row.deduction)}
                  </span>
                  <span className="font-archivo font-normal leading-[115.625%]">
                    {formatNaira(row.balanceAfter)}
                  </span>
                </div>
                <div className="bg-[#ebebeb] h-px w-full" />
              </div>
            ))}
          </div>
        </div>

        <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
          This card has no balance left and has moved to Inactive/Used. It cannot be redeemed again.
        </p>
      </div>
    );
  }

  // 18 · Gift cards — Empty active
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
          Buy, manage and share gift cards on Connect Nigeria.
        </p>
      </div>

      <GiftCardTabs
        activeTab="active"
        availableCount={DENOMINATIONS.length}
        activeCount={0}
        usedCount={0}
        onSelectTab={onNavigate}
      />

      <div className="bg-white flex flex-col gap-[20px] items-center p-[40px] md:p-[64px] rounded-[12px] text-center w-full">
        <h2 className="font-archivo font-semibold text-[24.19px] leading-normal text-[#010817]">
          Your next thoughtful gift starts here
        </h2>
        <div className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#010817]">
          <p className="mb-0">You do not have any active gift cards yet. Buy a card for yourself</p>
          <p>or share the code with someone special.</p>
        </div>
        <ActionButton variant="primary" onClick={() => onNavigate('01-available')}>
          Browse available cards
        </ActionButton>
        <div className="bg-[#ebebeb] h-px w-full" />
        <p className="font-archivo font-normal text-[14px] leading-[115.625%] text-[#6c727f]">
          Received a gift card? Choose Pay with Gift Card at service checkout.
        </p>
      </div>
    </div>
  );
}
