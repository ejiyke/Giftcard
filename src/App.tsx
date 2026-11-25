import { useState } from 'react';
import { Header } from './components/Header';
import { ScreenExplorerBar } from './components/ScreenExplorerBar';
import {
  DENOMINATIONS,
  INITIAL_ACTIVE_CARDS,
  INITIAL_USED_CARDS,
} from './data/giftCards';
import { ManageCardsScreens } from './screens/ManageCardsScreens';
import { PurchaseFlowScreens } from './screens/PurchaseFlowScreens';
import { ServiceCheckoutScreens } from './screens/ServiceCheckoutScreens';
import type { Denomination, GiftCardItem, ScreenId } from './types/giftCard';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('01-available');
  const [selectedDenom, setSelectedDenom] = useState<Denomination>(DENOMINATIONS[3]); // ₦25,000
  const [activeCards, setActiveCards] = useState<GiftCardItem[]>(INITIAL_ACTIVE_CARDS);
  const [usedCards, setUsedCards] = useState<GiftCardItem[]>(INITIAL_USED_CARDS);
  const [selectedCard, setSelectedCard] = useState<GiftCardItem>(INITIAL_ACTIVE_CARDS[1]);
  const [lastPurchasedCard, setLastPurchasedCard] = useState<GiftCardItem>(
    INITIAL_ACTIVE_CARDS[1]
  );
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

        {!isPurchaseScreen && !isManageScreen && (
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
