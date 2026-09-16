import React, { useState } from 'react';

interface SimulatorProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSelectForOrder?: (config: { color: string; gangs: number; shape: string }) => void;
}

export const SmartSwitchSimulator: React.FC<SimulatorProps> = ({
  isOpen = false,
  onClose,
  onSelectForOrder,
}) => {
  const [gangCount, setGangCount] = useState<number>(4);
  const [color, setColor] = useState<'champagne' | 'black'>('champagne');
  const [shape, setShape] = useState<'rectangular' | 'square'>('rectangular');
  const [channels, setChannels] = useState<{ [key: number]: boolean }>({
    1: true,
    2: false,
    3: true,
    4: false,
  });
  const [lastLatency, setLastLatency] = useState<number>(95);
  const [activeTab, setActiveTab] = useState<'switch' | 'room'>('switch');

  const channelLabels: { [key: number]: string } = {
    1: 'Đèn Chùm Phòng Khách',
    2: 'Đèn Led Hắt Trần',
    3: 'Bình Nóng Lạnh',
    4: 'Đèn Cầu Thang',
  };

  const toggleChannel = (gangIndex: number) => {
    const start = performance.now();
    setChannels((prev) => ({
      ...prev,
      [gangIndex]: !prev[gangIndex],
    }));

    // Simulate real Vietnamese cloud server latency (~70ms to 110ms)
    setTimeout(() => {
      const simulatedTime = Math.floor(Math.random() * 25 + 85);
      setLastLatency(simulatedTime);
    }, 20);
  };

  const activeCount = Array.from({ length: gangCount }, (_, i) => i + 1).filter(
    (i) => channels[i]
  ).length;

  const estimatedPower = activeCount * 45 + (channels[3] && gangCount >= 3 ? 1500 : 0);

  const content = (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-w-4xl w-full mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-5 sm:p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
            <span className="material-symbols-outlined text-[24px]">touch_app</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg sm:text-xl font-heading">
                Phòng Thử Nghiệm Công Tắc Hunonic Luxury
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/40 hidden sm:inline-block">
                Live Test
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Chạm vào các nút cảm ứng để cảm nhận tốc độ phản hồi 0.1s tức thì
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        )}
      </div>

      {/* Simulator Workspace */}
      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50/50">
        {/* Left Column: Physical Switch Rendering */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          {/* View Toggle Tabs */}
          <div className="flex items-center bg-slate-200/80 p-1 rounded-xl mb-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('switch')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeTab === 'switch' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              Mặt Công Tắc Cảm Ứng
            </button>
            <button
              onClick={() => setActiveTab('room')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeTab === 'room' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              Xem Hiệu Ứng Phòng Khách
            </button>
          </div>

          {activeTab === 'switch' ? (
            <div className="relative p-6 sm:p-8 flex items-center justify-center">
              {/* Glowing Aura */}
              <div
                className={`absolute inset-0 rounded-3xl blur-2xl transition-opacity duration-500 ${
                  activeCount > 0 ? 'bg-blue-500/20 opacity-100' : 'bg-transparent opacity-0'
                }`}
              />

              {/* Physical Switch Plate */}
              <div
                className={`relative z-10 transition-all duration-300 shadow-2xl select-none ${
                  shape === 'rectangular'
                    ? 'w-[280px] sm:w-[320px] h-[175px] sm:h-[195px] rounded-2xl'
                    : 'w-[240px] sm:w-[260px] h-[240px] sm:h-[260px] rounded-2xl'
                } ${
                  color === 'champagne'
                    ? 'bg-gradient-to-b from-[#fbf5e8] via-[#f7ecd5] to-[#eeddb9] border-[6px] border-[#d4af37] shadow-[0_15px_35px_rgba(212,175,55,0.25)]'
                    : 'bg-gradient-to-b from-[#1c222e] via-[#111622] to-[#0a0d14] border-[6px] border-[#334155] shadow-[0_15px_35px_rgba(0,0,0,0.5)]'
                }`}
              >
                {/* 2.5D Tempered Glass Bevel & Logo */}
                <div className="w-full h-full p-4 flex flex-col justify-between relative overflow-hidden rounded-xl">
                  {/* Glass Sheen reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 pointer-events-none" />

                  {/* Brand Hunonic watermark */}
                  <div className="flex justify-between items-center text-[10px] tracking-widest uppercase font-bold text-slate-400/80">
                    <span>HUNONIC</span>
                    <span className="flex items-center gap-1 text-[9px] text-emerald-600 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 led-indicator" />
                      WIFI ONLINE
                    </span>
                  </div>

                  {/* Gang Buttons Layout */}
                  <div
                    className={`grid gap-4 sm:gap-6 my-auto items-center justify-center ${
                      gangCount === 1
                        ? 'grid-cols-1'
                        : gangCount === 2
                        ? 'grid-cols-2'
                        : gangCount === 3
                        ? 'grid-cols-3'
                        : 'grid-cols-4'
                    }`}
                  >
                    {Array.from({ length: gangCount }, (_, i) => i + 1).map((idx) => {
                      const isOn = !!channels[idx];
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleChannel(idx)}
                          className="flex flex-col items-center gap-1 group/btn focus:outline-none"
                          title={`Chạm để bật/tắt: ${channelLabels[idx]}`}
                        >
                          {/* Circular Capacitive Touch Ring */}
                          <div
                            className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                              isOn
                                ? 'bg-blue-600 shadow-[0_0_18px_#2563eb,inset_0_0_8px_#93c5fd] scale-105 border-2 border-blue-300'
                                : color === 'champagne'
                                ? 'bg-slate-300/40 border border-slate-400/50 hover:bg-slate-400/30'
                                : 'bg-slate-800/80 border border-slate-700/80 hover:bg-slate-700/60'
                            }`}
                          >
                            <span
                              className={`material-symbols-outlined text-[20px] transition-colors ${
                                isOn ? 'text-white font-bold' : 'text-slate-400 group-hover/btn:text-slate-600'
                              }`}
                            >
                              power_settings_new
                            </span>
                          </div>
                          <span
                            className={`text-[9px] font-semibold tracking-wider ${
                              isOn
                                ? 'text-blue-600 font-bold'
                                : color === 'champagne'
                                ? 'text-slate-600'
                                : 'text-slate-400'
                            }`}
                          >
                            NÚT {idx}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Bottom spec imprint */}
                  <div className="flex justify-between items-center text-[9px] text-slate-400">
                    <span>90-250V AC</span>
                    <span>500W/GANG</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Room Atmosphere Preview */
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-lg group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0JOYXPQDCPpLc2e4QLXxGj45-G0X2fK2-n9soT34V2u99QAd4J0gnGvZMfXBF16fW8AlBU-cBasjs-Xgpp7rmsYyLM7d_U7I1RNbOPnDLZy1knscAIViC7Q66pmoQqVzzCwsT6hi87eI2xxrkrGT6jFdHRer9vCrPIQtxUf1q9QXZKG8b-f4S4Do03LiAcDz0vYPrPeOLgyA-V6te4cr7AG8RZ5xY_Qo7KJoeTzkpgT7en-6AngrE"
                alt="Phòng khách mô phỏng ánh sáng"
                className={`w-full h-full object-cover transition-all duration-700 ${
                  activeCount === 0 ? 'brightness-50 contrast-125' : 'brightness-105'
                }`}
                referrerPolicy="no-referrer"
              />
              <div
                className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
                  channels[1] ? 'bg-amber-400/10' : ''
                } ${channels[2] ? 'bg-blue-500/10' : ''}`}
              />
              <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md rounded-xl p-3 text-white flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 led-indicator" />
                  Đang bật: {activeCount}/{gangCount} thiết bị
                </span>
                <span className="text-amber-300 font-bold">
                  {channels[3] ? '🔥 Bình nóng lạnh đang bật' : 'Bình nóng lạnh đang tắt'}
                </span>
              </div>
            </div>
          )}

          <p className="text-xs text-slate-500 mt-2 italic text-center">
            💡 Gợi ý: Bấm trực tiếp vào các nút cảm ứng phía trên để trải nghiệm độ nhạy
          </p>
        </div>

        {/* Right Column: Interactive Configuration & Metrics */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          {/* Live Telemetry Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
              <span className="text-xs text-blue-700 font-semibold block uppercase">Tốc độ phản hồi</span>
              <span className="text-xl sm:text-2xl font-bold text-blue-800 font-heading">
                0.{Math.floor(lastLatency / 10)}s
              </span>
              <span className="text-[10px] text-blue-600 block">({lastLatency}ms)</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <span className="text-xs text-emerald-700 font-semibold block uppercase">Phí duy trì</span>
              <span className="text-xl sm:text-2xl font-bold text-emerald-700 font-heading">0 VNĐ</span>
              <span className="text-[10px] text-emerald-600 block">Trọn đời</span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
              <span className="text-xs text-amber-700 font-semibold block uppercase">Công suất tải</span>
              <span className="text-xl sm:text-2xl font-bold text-amber-700 font-heading">
                {estimatedPower}W
              </span>
              <span className="text-[10px] text-amber-600 block">Real-time</span>
            </div>
          </div>

          {/* Configurator Controls */}
          <div className="space-y-4">
            {/* Gang Count Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                1. Chọn Số Nút Cảm Ứng (1 - 4 Nút)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGangCount(g)}
                    className={`py-2.5 px-3 rounded-xl font-bold text-sm transition-all ${
                      gangCount === g
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {g} Nút
                  </button>
                ))}
              </div>
            </div>

            {/* Shape Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                2. Chọn Chuẩn Đế Âm Tường Nhà Bạn
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShape('rectangular')}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    shape === 'rectangular'
                      ? 'bg-blue-50/80 border-blue-600 text-blue-900 font-semibold ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-sm font-bold">Chữ Nhật (120x72mm)</span>
                  <span className="text-[11px] text-slate-500 block">Chuẩn Sino, Panasonic 90% VN</span>
                </button>

                <button
                  onClick={() => setShape('square')}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    shape === 'square'
                      ? 'bg-blue-50/80 border-blue-600 text-blue-900 font-semibold ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-sm font-bold">Vuông (86x86mm)</span>
                  <span className="text-[11px] text-slate-500 block">Chuẩn Châu Âu, Schneider</span>
                </button>
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                3. Tùy Chọn Màu Sắc Viền Kim Loại
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setColor('champagne')}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
                    color === 'champagne'
                      ? 'border-[#d4af37] bg-[#fbf5e8] font-bold text-amber-900 ring-2 ring-[#d4af37]/30'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-[#d4af37] border border-amber-300 shadow-sm shrink-0" />
                  <span className="text-xs">Vàng Champagne Gold</span>
                </button>

                <button
                  onClick={() => setColor('black')}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
                    color === 'black'
                      ? 'border-slate-800 bg-slate-900 text-white font-bold ring-2 ring-slate-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-600 shadow-sm shrink-0" />
                  <span className="text-xs">Đen Titan Viền Vàng</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Order Confirmation with this customized config */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (onSelectForOrder) {
                  onSelectForOrder({
                    color: color === 'champagne' ? 'Vàng Champagne' : 'Đen Titan',
                    gangs: gangCount,
                    shape: shape === 'rectangular' ? 'Đế chữ nhật 120x72mm' : 'Đế vuông 86x86mm',
                  });
                }
              }}
              className="w-full py-3.5 px-5 rounded-xl text-white font-bold text-sm btn-cta-action shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
              <span>ĐẶT MUA THEO CẤU HÌNH NÀY (GIẢM 15% HÔM NAY)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isOpen && onClose) {
    return null;
  }

  // If used as a modal
  if (onClose) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto my-auto">{content}</div>
      </div>
    );
  }

  // If embedded in the page
  return <div className="w-full my-8">{content}</div>;
};
