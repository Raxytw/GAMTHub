import { useState, useEffect, useRef } from 'react';

export default function TimerRemind() {
  const [now, setNow] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const autoCloseTimerRef = useRef(null);

  useEffect(() => {
    const triggerAutoOpen = () => {
      setIsOpen(true);
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 5000);
    };

    // 初次載入時自動展開並在 5 秒後收回
    triggerAutoOpen();

    let lastSecond = new Date().getSeconds();

    const timer = setInterval(() => {
      const d = new Date();
      setNow(d);

      const h = d.getHours();
      const m = d.getMinutes();
      const s = d.getSeconds();

      // 當秒數剛好跨到 0 時做判定，避免一秒內多次觸發
      if (s === 0 && lastSecond !== 0) {
        const isHourly = m === 0;
        const isMealTime = (h === 11 && m === 30) || (h === 17 && m === 30) || (h === 22 && m === 30);

        // 每個整點、或是特定提醒時間到了，自動展開提示 5 秒
        if (isHourly || isMealTime) {
          triggerAutoOpen();
        }
      }
      lastSecond = s;
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getReminderMessage = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeValue = hours + minutes / 60;

    if (timeValue >= 6 && timeValue < 9) {
      return "🌅 該吃早餐了喔！";
    } else if (timeValue >= 11.5 && timeValue < 13.5) {
      return "🍱 午餐時間到了！";
    } else if (timeValue >= 17.5 && timeValue < 19.5) {
      return "🍲 晚餐時間到啦！";
    } else if (timeValue >= 22 || timeValue < 6) {
      return "🌙 夜深了，早點休息睡覺吧！";
    } else {
      return "🚶‍♂️ 起來走動一下、喝杯水吧！";
    }
  };

  const message = getReminderMessage(now);
  const timeString = now.toLocaleTimeString('zh-TW', { hour12: false });

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-none">

      {/* 切換按鈕 */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          // 如果手動點開或收合，取消自動收合的計時器
          if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
        }}
        className={`absolute bottom-0 left-0 pointer-events-auto flex items-center justify-center w-14 h-14 bg-zinc-800/90 backdrop-blur-md border shadow-lg rounded-full transition-all duration-300 hover:scale-110 active:scale-95 z-20 ${isOpen ? 'border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-zinc-700/50 text-zinc-300 hover:text-white'
          }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {isOpen ? (
            <>
              {/* 打開時顯示 X */}
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </>
          ) : (
            <>
              {/* 收合時顯示時鐘 */}
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </>
          )}
        </svg>
      </button>

      {/* 提示面板 */}
      <div
        className={`absolute bottom-16 left-0 w-[280px] group bg-zinc-900/90 backdrop-blur-md border border-zinc-700/50 rounded-2xl p-4 md:p-5 transition-all duration-500 shadow-2xl origin-bottom-left pointer-events-auto z-10 ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-10 pointer-events-none'
          }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-start gap-3">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-lg md:text-xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-widest drop-shadow-sm">
              溫馨提醒
            </h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              NOW
            </p>
          </div>

          <p className="text-sm md:text-base font-bold text-gray-100 leading-relaxed">
            {message}
          </p>

          <div className="flex flex-col items-center mt-2 bg-black/40 w-full py-3 rounded-xl border border-white/5 shadow-inner">
            <p className="text-2xl md:text-3xl font-mono font-black text-white tracking-wider drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              {timeString}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}