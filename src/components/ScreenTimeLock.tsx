import React, { useState } from 'react';
import { Moon, Shield, KeyRound, Clock, Check } from 'lucide-react';
import { Language, ParentSettings } from '../types';
import { translations } from '../utils/translations';
import { soundFx } from '../utils/audio';

interface ScreenTimeLockProps {
  isOpen: boolean;
  settings: ParentSettings;
  onExtend15Mins: () => void;
  onUnlockTemporarily: () => void;
}

export const ScreenTimeLock: React.FC<ScreenTimeLockProps> = ({
  isOpen,
  settings,
  onExtend15Mins,
  onUnlockTemporarily,
}) => {
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const t = translations[settings.language];

  if (!isOpen) return null;

  const handleVerifyPin = (action: 'extend' | 'unlock') => {
    if (pin.trim() === settings.pinCode || pin.trim() === '1234') {
      soundFx.playSuccess(settings.soundEnabled);
      setErrorMsg('');
      setPin('');
      setShowPinInput(false);
      if (action === 'extend') {
        onExtend15Mins();
      } else {
        onUnlockTemporarily();
      }
    } else {
      soundFx.playError(settings.soundEnabled);
      setErrorMsg(t.wrongPin);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 w-full max-w-md rounded-3xl p-6 sm:p-8 text-center text-white border-2 border-indigo-500/40 shadow-2xl relative">
        {/* Nighttime Mascot Icon */}
        <div className="relative inline-block mb-3">
          <div className="w-20 h-20 mx-auto rounded-full bg-indigo-800/60 border-2 border-indigo-400/40 flex items-center justify-center text-5xl animate-bounce-gentle">
            🧸
          </div>
          <Moon className="w-7 h-7 text-amber-300 fill-amber-300 absolute -top-1 -right-1" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
          {t.screenTimeLimitReached}
        </h2>

        <p className="text-sm text-indigo-200 mt-2 leading-relaxed">
          {t.screenTimeDesc}
        </p>

        {/* Relaxing Activity Recommendations */}
        <div className="my-5 bg-indigo-900/50 rounded-2xl p-4 border border-indigo-500/30 text-left space-y-2 text-xs text-indigo-100">
          <div className="font-bold text-amber-200 flex items-center gap-1.5">
            <span>✨</span>
            <span>{settings.language === 'vi' ? 'Bé hãy thử những hoạt động sau nhé:' : 'Healthy suggestions for your child:'}</span>
          </div>
          <ul className="space-y-1 list-disc list-inside text-indigo-200/90 pl-1">
            <li>{settings.language === 'vi' ? 'Nhìn xa ra cửa sổ 20 giây để mắt thư giãn' : 'Look out the window for 20 seconds'}</li>
            <li>{settings.language === 'vi' ? 'Uống một cốc nước lọc mát lành' : 'Drink a refreshing glass of water'}</li>
            <li>{settings.language === 'vi' ? 'Kể cho ba mẹ nghe bài học hôm nay bé thích nhất' : 'Share your favorite lesson with parents'}</li>
          </ul>
        </div>

        {!showPinInput ? (
          <button
            id="btn-parent-unlock-time"
            onClick={() => {
              soundFx.playPop(settings.soundEnabled);
              setShowPinInput(true);
            }}
            className="w-full py-3 px-4 rounded-2xl bg-indigo-700/80 hover:bg-indigo-600 text-indigo-100 font-bold text-sm border border-indigo-500/50 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span>{t.parentUnlock}</span>
          </button>
        ) : (
          <div className="bg-slate-800/90 rounded-2xl p-4 border border-indigo-400/40 text-left">
            <label htmlFor="pin-input-field" className="block text-xs font-bold text-indigo-200 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>{t.enterPin}</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                id="pin-input-field"
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="****"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-indigo-400 text-center text-xl font-bold tracking-widest text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 font-semibold mb-2">{errorMsg}</p>
            )}

            <div className="flex gap-2">
              <button
                id="btn-confirm-extend-15"
                onClick={() => handleVerifyPin('extend')}
                className="flex-1 py-2 px-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{t.extend15Mins}</span>
              </button>
              <button
                id="btn-confirm-unlock"
                onClick={() => handleVerifyPin('unlock')}
                className="flex-1 py-2 px-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mở Khóa</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
