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
import { ProductCustomizerModal } from './components/ProductCustomizerModal';
import { SocialProofToast } from './components/SocialProofToast';
import { MobileStickyCTA } from './components/MobileStickyCTA';
import { Product } from './types';

export default function App() {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [orderBundleId, setOrderBundleId] = useState<string>('combo-5');
  const [customSwitchConfig, setCustomSwitchConfig] = useState<{
    color: string;
    gangs: number;
    shape: string;
    quantity?: number;
  } | null>(null);

  const scrollToOrder = (bundleId?: string) => {
    if (bundleId) {
      setOrderBundleId(bundleId);
    }
    const element = document.getElementById('dat-hang');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProductForModal(product);
  };

  const handleCustomOrder = (config: {
    product: Product;
    shape: string;
    gangs?: number;
    color?: string;
    quantity: number;
  }) => {
    setOrderBundleId(config.product.id);
    setCustomSwitchConfig({
      color: config.color || '',
      gangs: config.gangs || 1,
      shape: config.shape,
      quantity: config.quantity,
    });
    scrollToOrder(config.product.id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fb] text-[#191c1e] relative">
      {/* Top Fixed Navigation */}
      <Navbar
        onOpenOrder={() => scrollToOrder()}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
      />

      {/* Main Content Sections (With padding-top to account for fixed navbar) */}
      <main className="flex-1 pt-28 sm:pt-32">
        {/* Section 1: Hero */}
        <HeroSection
          onOpenOrder={() => scrollToOrder()}
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
                setCustomSwitchConfig(config);
                scrollToOrder('switch-luxury');
              }}
            />
          </div>
        </section>

        {/* Section 3: Flagship Products */}
        <ProductShowcase
          onSelectProduct={handleSelectProduct}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
        />

        {/* Section 4: Comparison Table */}
        <ComparisonTable />

        {/* Section 5: 5.000+ Customer Reviews & 5 Golden Commitments */}
        <ReviewsAndCommitments />

        {/* Section 6: Flash Sale Banner & 3 Combo Packages */}
        <FlashSaleBanner
          onSelectCombo={(comboId) => scrollToOrder(comboId)}
        />

        {/* Section 7: Order Form & Instant Confirmation */}
        <OrderFormSection
          initialBundleId={orderBundleId}
          initialCustomConfig={customSwitchConfig}
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
            setCustomSwitchConfig(config);
            scrollToOrder('switch-luxury');
          }}
        />
      )}

      {/* Product Customizer Modal */}
      {selectedProductForModal && (
        <ProductCustomizerModal
          product={selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
          onProceedOrder={handleCustomOrder}
        />
      )}

      {/* Real-time Order Social Proof Toast */}
      <SocialProofToast />

      {/* Mobile Bottom Sticky Bar */}
      <MobileStickyCTA
        onOpenOrder={() => scrollToOrder()}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
      />
    </div>
  );
}
