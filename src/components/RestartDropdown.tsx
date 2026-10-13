import React from "react";
import {
  RotateCcw,
  ChevronDown,
  Play,
  Compass,
  Clock,
  Sparkles,
  TimerReset,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface RestartDropdownProps {
  isRunning: boolean;
  remaining: number;
  onRestartVoyage: (seconds?: number) => void;
  onResetStandby: (seconds?: number) => void;
  onReturnToLaunch: () => void;
  className?: string;
}

export function RestartDropdown({
  isRunning,
  remaining,
  onRestartVoyage,
  onResetStandby,
  onReturnToLaunch,
  className = "",
}: RestartDropdownProps) {
  const formatTime = (secs: number) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, "0");
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`restart-btn ${className}`}
          aria-label="Restart Countdown (Options)"
          title="Restart Countdown (Press R for quick reset)"
        >
          <RotateCcw className="restart-icon" aria-hidden="true" />
          <span className="restart-label">Restart</span>
          <ChevronDown className="restart-chevron" aria-hidden="true" />
          <kbd className="restart-kbd">R</kbd>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="restart-dropdown-content w-72 p-2 rounded-xl border border-[#d4a753]/50 bg-[#180e06]/95 backdrop-blur-xl text-[#faecd0] shadow-2xl shadow-black/80 z-50 animate-in fade-in-0 zoom-in-95"
      >
        {/* Header with Live Status */}
        <div className="px-2.5 py-2 mb-1 rounded-lg bg-black/40 border border-[#d4a753]/20">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-semibold">
            <span className="text-[#d4a753]">Voyage Status</span>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest ${
                isRunning
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isRunning ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              {isRunning ? "LIVE" : "PAUSED"}
            </span>
          </div>
          <div className="mt-1 flex items-baseline justify-between font-mono text-xs">
            <span className="text-white/60">Remaining:</span>
            <span className="text-[#ffd478] font-bold text-sm tracking-wider">
              {formatTime(remaining)}
            </span>
          </div>
        </div>

        <DropdownMenuLabel className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#d4a753]/80">
          Quick Actions
        </DropdownMenuLabel>

        {/* 1. Full Restart (24 Hours - Starts Immediately) */}
        <DropdownMenuItem
          onClick={() => onRestartVoyage(24 * 3600)}
          className="group flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-150 hover:bg-[#3d2410] focus:bg-[#3d2410] text-[#faecd0]"
        >
          <div className="mt-0.5 p-1 rounded-md bg-amber-500/20 text-amber-300 group-hover:bg-amber-500/30 group-hover:text-amber-200 transition-colors">
            <Play className="w-3.5 h-3.5 fill-current" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-[#ffd478]">
              <span>Restart 24-Hour Voyage</span>
              <Sparkles className="w-3 h-3 text-amber-400 opacity-60 group-hover:opacity-100" />
            </div>
            <p className="text-[10px] text-white/60 mt-0.5 leading-snug">
              Reset clock to 24:00:00 & begin live countdown
            </p>
          </div>
        </DropdownMenuItem>

        {/* 2. Reset to 24h Standby (Paused) */}
        <DropdownMenuItem
          onClick={() => onResetStandby(24 * 3600)}
          className="group flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-150 hover:bg-[#3d2410] focus:bg-[#3d2410] text-[#faecd0]"
        >
          <div className="mt-0.5 p-1 rounded-md bg-blue-500/20 text-blue-300 group-hover:bg-blue-500/30 group-hover:text-blue-200 transition-colors">
            <TimerReset className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-white group-hover:text-[#ffd478]">
              Reset to Standby (24h)
            </div>
            <p className="text-[10px] text-white/60 mt-0.5 leading-snug">
              Reset clock to 24:00:00 in paused standby
            </p>
          </div>
        </DropdownMenuItem>

        {/* 3. Return to Opening Launch Screen */}
        <DropdownMenuItem
          onClick={() => onReturnToLaunch()}
          className="group flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-150 hover:bg-[#3d2410] focus:bg-[#3d2410] text-[#faecd0]"
        >
          <div className="mt-0.5 p-1 rounded-md bg-purple-500/20 text-purple-300 group-hover:bg-purple-500/30 group-hover:text-purple-200 transition-colors">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-white group-hover:text-[#ffd478]">
              Return to Launch Ceremony
            </div>
            <p className="text-[10px] text-white/60 mt-0.5 leading-snug">
              Reset countdown & return to start portal
            </p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1.5 bg-[#d4a753]/20" />

        {/* Quick Testing / Custom Duration Presets */}
        <DropdownMenuLabel className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#d4a753]/80 flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-[#d4a753]" />
          <span>Quick Presets</span>
        </DropdownMenuLabel>

        <div className="grid grid-cols-2 gap-1 px-1 pt-1 pb-1">
          <button
            type="button"
            onClick={() => onRestartVoyage(12 * 3600)}
            className="px-2 py-1 rounded-md bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-[11px] font-semibold text-white/80 hover:text-amber-200 transition-colors text-center"
          >
            12 Hours
          </button>
          <button
            type="button"
            onClick={() => onRestartVoyage(6 * 3600)}
            className="px-2 py-1 rounded-md bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-[11px] font-semibold text-white/80 hover:text-amber-200 transition-colors text-center"
          >
            6 Hours
          </button>
          <button
            type="button"
            onClick={() => onRestartVoyage(3600)}
            className="px-2 py-1 rounded-md bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-[11px] font-semibold text-white/80 hover:text-amber-200 transition-colors text-center"
          >
            1 Hour
          </button>
          <button
            type="button"
            onClick={() => onRestartVoyage(15 * 60)}
            className="px-2 py-1 rounded-md bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-[11px] font-semibold text-white/80 hover:text-amber-200 transition-colors text-center"
          >
            15 Mins
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
