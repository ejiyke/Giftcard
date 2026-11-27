import { useState } from 'react';
import { Header } from './components/Header';
import { ScreenExplorerBar } from './components/ScreenExplorerBar';
import {
  DENOMINATIONS,
  INITIAL_ACTIVE_CARDS,
  INITIAL_USED_CARDS,
} from './data/giftCards';
import { GiftTransferScreens } from './screens/GiftTransferScreens';
import { ManageCardsScreens } from './screens/ManageCardsScreens';
import { PurchaseFlowScreens } from './screens/PurchaseFlowScreens';
import { ServiceCheckoutScreens } from './screens/ServiceCheckoutScreens';
import type {
  Denomination,
  GiftCardItem,
  ScreenId,
  TransferDetails,
} from './types/giftCard';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('01-available');
  const [selectedDenom, setSelectedDenom] = useState<Denomination>(DENOMINATIONS[3]); // ₦25,000
  const [activeCards, setActiveCards] = useState<GiftCardItem[]>(INITIAL_ACTIVE_CARDS);
  const [usedCards, setUsedCards] = useState<GiftCardItem[]>(INITIAL_USED_CARDS);
  const [selectedCard, setSelectedCard] = useState<GiftCardItem>(INITIAL_ACTIVE_CARDS[1]);
  const [lastPurchasedCard, setLastPurchasedCard] = useState<GiftCardItem>(
    INITIAL_ACTIVE_CARDS[1]
  );
  const [lastTransferSummary, setLastTransferSummary] = useState<{
    card: GiftCardItem;
    transfer: TransferDetails;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode((prev) => (prev === code ? null : prev));
    }, 2500);
  };

  const handleCompletePurchase = () => {
    const randomPart = () =>
      Math.random().toString(36).substring(2, 6).toUpperCase();
    const newCard: GiftCardItem = {
      id: `CN-${randomPart()}-${randomPart()}`,
      code:
        selectedDenom.amount === 25000 &&
        !activeCards.some((c) => c.code === 'CN-8R3D-6T5W')
          ? 'CN-8R3D-6T5W'
          : `CN-${randomPart()}-${randomPart()}`,
      initialValue: selectedDenom.amount,
      currentBalance: selectedDenom.amount,
      purchasedDate: '25 Nov 2026',
      status: 'unredeemed',
      theme: selectedDenom.theme,
      artStyle: selectedDenom.artStyle,
      colorVariant: selectedDenom.colorVariant,
      history: [],
    };
    setActiveCards((prev) => [newCard, ...prev]);
    setLastPurchasedCard(newCard);
    setSelectedCard(newCard);
    setCurrentScreen('04-purchase-success');
  };

  const handleShareCard = (card: GiftCardItem) => {
    setSelectedCard(card);
    setCurrentScreen('08-share');
  };

  const handleSelectCard = (card: GiftCardItem, targetScreen: ScreenId) => {
    setSelectedCard(card);
    setCurrentScreen(targetScreen);
  };

  const handleConfirmServicePayment = (code: string, deductionAmount: number) => {
    const target = activeCards.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (!target) return;

    const newBalance = Math.max(0, target.currentBalance - deductionAmount);
    const newEntry = {
      date: '25 Nov 2026',
      service: 'Quote Request service',
      deduction: deductionAmount,
      balanceAfter: newBalance,
    };

    if (newBalance === 0) {
      const movedCard: GiftCardItem = {
        ...target,
        currentBalance: 0,
        status: 'used',
        lastUsedDate: '25 Nov 2026',
        history: [newEntry, ...target.history],
      };
      setActiveCards((prev) => prev.filter((c) => c.id !== target.id));
      setUsedCards((prev) => [movedCard, ...prev]);
      setSelectedCard(movedCard);
    } else {
      const updatedCard: GiftCardItem = {
        ...target,
        currentBalance: newBalance,
        status: 'linked',
        firstRedeemedDate: target.firstRedeemedDate || '25 Nov 2026',
        history: [newEntry, ...target.history],
      };
      setActiveCards((prev) =>
        prev.map((c) => (c.id === target.id ? updatedCard : c))
      );
      setSelectedCard(updatedCard);
    }
  };

  const handleViewHistoryForCard = (code: string) => {
    const active = activeCards.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (active) {
      setSelectedCard(active);
      setCurrentScreen(active.status === 'linked' ? '09-linked-recipient' : '07-active-details');
      return;
    }
    const used = usedCards.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (used) {
      setSelectedCard(used);
      setCurrentScreen('11-used-details');
      return;
    }
    setCurrentScreen('09-linked-recipient');
  };

  const handleCompleteTransfer = (
    cardCode: string,
    input: { recipientEmail: string; recipientName?: string; message?: string }
  ) => {
    const target = activeCards.find((c) => c.code.toUpperCase() === cardCode.toUpperCase());
    if (!target || target.currentBalance <= 0) return;

    const transferredDate = '26 Nov 2026';
    const transfer: TransferDetails = {
      recipientEmail: input.recipientEmail,
      recipientName: input.recipientName,
      message: input.message,
      transferredAmount: target.currentBalance,
      reference: `TRF-261126-${Math.floor(1000 + Math.random() * 9000)}`,
      transferredDate,
    };

    const newEntry = {
      date: transferredDate,
      service: `Ownership transferred to ${transfer.recipientEmail}`,
      deduction: target.currentBalance,
      balanceAfter: 0,
    };

    const movedCard: GiftCardItem = {
      ...target,
      currentBalance: 0,
      status: 'used',
      lastUsedDate: transferredDate,
      history: [newEntry, ...target.history],
      transferDetails: transfer,
    };

    setActiveCards((prev) => prev.filter((c) => c.id !== target.id));
    setUsedCards((prev) => [movedCard, ...prev]);
    setSelectedCard(movedCard);
    setLastTransferSummary({ card: movedCard, transfer });
    setCurrentScreen('21-gift-success');
  };

  const isPurchaseScreen =
    currentScreen === '01-available' ||
    currentScreen === '02-buy' ||
    currentScreen === '03-purchase-checkout' ||
    currentScreen === '04-purchase-success' ||
    currentScreen === '05-payment-failed';

  const isManageScreen =
    currentScreen === '06-active' ||
    currentScreen === '07-active-details' ||
    currentScreen === '08-share' ||
    currentScreen === '09-linked-recipient' ||
    currentScreen === '10-inactive-used' ||
    currentScreen === '11-used-details' ||
    currentScreen === '18-empty-active';

  const isGiftTransferScreen =
    currentScreen === '19-gift-select' ||
    currentScreen === '20-gift-transfer' ||
    currentScreen === '21-gift-success' ||
    currentScreen === '22-gift-failed';

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex flex-col">
      <Header onNavigate={setCurrentScreen} />

      <main className="flex-1 w-full">
        {isPurchaseScreen && (
          <PurchaseFlowScreens
            screen={currentScreen}
            selectedDenom={selectedDenom}
            onSelectDenom={setSelectedDenom}
            onNavigate={setCurrentScreen}
            activeCount={activeCards.length}
            usedCount={usedCards.length}
            lastPurchasedCard={lastPurchasedCard}
            onCompletePurchase={handleCompletePurchase}
            onShareCard={handleShareCard}
            onCopyCode={handleCopyCode}
            copiedCode={copiedCode}
          />
        )}

        {isManageScreen && (
          <ManageCardsScreens
            screen={currentScreen}
            activeCards={activeCards}
            usedCards={usedCards}
            selectedCard={selectedCard}
            onSelectCard={handleSelectCard}
            onNavigate={setCurrentScreen}
            onCopyCode={handleCopyCode}
            copiedCode={copiedCode}
          />
        )}

        {isGiftTransferScreen && (
          <GiftTransferScreens
            screen={currentScreen}
            activeCards={activeCards}
            usedCards={usedCards}
            selectedCard={selectedCard}
            lastTransferSummary={lastTransferSummary}
            onSelectCardToGift={setSelectedCard}
            onCompleteTransfer={handleCompleteTransfer}
            onNavigate={setCurrentScreen}
          />
        )}

        {!isPurchaseScreen && !isManageScreen && !isGiftTransferScreen && (
          <ServiceCheckoutScreens
            screen={currentScreen}
            activeCards={activeCards}
            onNavigate={setCurrentScreen}
            onConfirmServicePayment={handleConfirmServicePayment}
            onViewHistoryForCard={handleViewHistoryForCard}
          />
        )}
      </main>

      <ScreenExplorerBar
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
      />
    </div>
  );
}

export default App;
