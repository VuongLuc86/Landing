/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PainPointsSection } from './components/PainPointsSection';
import { ProductShowcase } from './components/ProductShowcase';
import { ComparisonTable } from './components/ComparisonTable';
import { ReviewsAndCommitments } from './components/ReviewsAndCommitments';
import { FlashSaleBanner } from './components/FlashSaleBanner';
import { OrderFormSection } from './components/OrderFormSection';
import { Footer } from './components/Footer';
import { SmartSwitchSimulator } from './components/SmartSwitchSimulator';
import { QuickOrderModal, QuickOrderTarget } from './components/QuickOrderModal';
import { OrdersFileModal } from './components/OrdersFileModal';
import { SocialProofToast } from './components/SocialProofToast';
import { MobileStickyCTA } from './components/MobileStickyCTA';
import { VisualMiniCartModal } from './components/VisualMiniCartModal';
import { FloatingCartButton } from './components/FloatingCartButton';
import { CartProvider, useCart } from './context/CartContext';
import { Product } from './types';

function AppContent() {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState<boolean>(false);
  const [quickOrderTarget, setQuickOrderTarget] = useState<QuickOrderTarget | null>(null);
  const [isOrdersFileModalOpen, setIsOrdersFileModalOpen] = useState<boolean>(false);
  const [ordersFileLastUpdated, setOrdersFileLastUpdated] = useState<number>(Date.now());

  const { openCheckoutWithItem, setCheckoutStep, setIsCartOpen } = useCart();

  // Function to open the quick order modal or visual mini cart with prefilled product
  const handleOpenOrder = (target?: QuickOrderTarget | Product | string) => {
    if (typeof target === 'string') {
      setQuickOrderTarget({ bundleId: target });
      setIsQuickOrderOpen(true);
    } else if (target && 'price' in target && 'category' in target) {
      // Product object: Open streamlined 3-field checkout directly
      openCheckoutWithItem({
        productId: target.id,
        name: target.name,
        category: target.category,
        price: target.price,
        originalPrice: target.originalPrice,
        imageUrl: target.imageUrl,
        quantity: 1,
        shape: 'Đế Chữ nhật',
        gangs: 4,
        color: 'Đen Huyền Bí',
        warranty: target.warranty,
      });
    } else if (target) {
      setQuickOrderTarget(target as QuickOrderTarget);
      setIsQuickOrderOpen(true);
    } else {
      setCheckoutStep('cart');
      setIsCartOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fb] text-[#191c1e] relative">
      {/* Top Fixed Navigation */}
      <Navbar
        onOpenOrder={() => handleOpenOrder('switch-luxury')}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1 pt-28 sm:pt-32">
        {/* Section 1: Hero */}
        <HeroSection
          onOpenOrder={() => handleOpenOrder('switch-luxury')}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
        />

        {/* Section 2: Pain Points & Solution */}
        <PainPointsSection />

        {/* Interactive Live Testing Zone */}
        <section className="w-full py-12 lg:py-16 bg-white border-y border-slate-200" id="trai-nghiem">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs sm:text-sm text-blue-700 uppercase tracking-widest font-bold flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">touch_app</span>
                Trải Nghiệm Tương Tác Thực Tế
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 mt-2">
                Trải Nghiệm Thử Công Tắc Hunonic Luxury (Phản Hồi 0.1s)
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Bấm trực tiếp vào các nút cảm ứng bên dưới để kiểm tra tốc độ phản hồi máy chủ Việt Nam
              </p>
            </div>

            <SmartSwitchSimulator
              onSelectForOrder={(config) => {
                handleOpenOrder({
                  bundleId: 'switch-luxury',
                  color: config.color,
                  gangs: config.gangs,
                  shape: config.shape,
                  quantity: config.quantity || 1,
                });
              }}
            />
          </div>
        </section>

        {/* Section 3: Flagship Products with Mini-Cart & Buy Now Integration */}
        <ProductShowcase
          onSelectProduct={(product) => handleOpenOrder(product)}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
        />

        {/* Section 4: Comparison Table */}
        <ComparisonTable />

        {/* Section 5: Customer Reviews & Golden Commitments */}
        <ReviewsAndCommitments />

        {/* Section 6: Flash Sale Banner & Combo Packages */}
        <FlashSaleBanner
          onSelectCombo={(comboId) => handleOpenOrder(comboId)}
        />

        {/* Section 7: Streamlined 3-Field Order Section */}
        <OrderFormSection
          initialBundleId={quickOrderTarget?.bundleId || 'switch-luxury'}
          onOpenQuickOrderModal={(target) => handleOpenOrder(target)}
          onOpenOrdersFileModal={() => {
            setOrdersFileLastUpdated(Date.now());
            setIsOrdersFileModalOpen(true);
          }}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Simulator Modal (when opened from buttons/nav) */}
      {isSimulatorOpen && (
        <SmartSwitchSimulator
          isOpen={true}
          onClose={() => setIsSimulatorOpen(false)}
          onSelectForOrder={(config) => {
            setIsSimulatorOpen(false);
            handleOpenOrder({
              bundleId: 'switch-luxury',
              color: config.color,
              gangs: config.gangs,
              shape: config.shape,
              quantity: config.quantity || 1,
            });
          }}
        />
      )}

      {/* Visual Mini Cart Popup & 3-Field Instant Checkout */}
      <VisualMiniCartModal
        onViewOrdersFile={() => {
          setOrdersFileLastUpdated(Date.now());
          setIsOrdersFileModalOpen(true);
        }}
      />

      {/* Floating Cart Button with Realtime Count & Price */}
      <FloatingCartButton />

      {/* Quick Order Popup Modal (for detailed config options) */}
      <QuickOrderModal
        isOpen={isQuickOrderOpen}
        onClose={() => setIsQuickOrderOpen(false)}
        target={quickOrderTarget}
        onViewOrdersFile={() => {
          setOrdersFileLastUpdated(Date.now());
          setIsOrdersFileModalOpen(true);
        }}
      />

      {/* Orders CSV File Viewer Modal */}
      <OrdersFileModal
        isOpen={isOrdersFileModalOpen}
        onClose={() => setIsOrdersFileModalOpen(false)}
        lastUpdated={ordersFileLastUpdated}
      />

      {/* Real-time Order Social Proof Toast */}
      <SocialProofToast />

      {/* Mobile Bottom Sticky Bar */}
      <MobileStickyCTA
        onOpenOrder={() => {
          setCheckoutStep('cart');
          setIsCartOpen(true);
        }}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
