import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Volume2, VolumeX, Sparkles, X, Rocket, ShieldCheck, Flame, Compass } from "lucide-react";
import odysseyEmblem from "@/assets/odyssey-emblem.png";
import logo from "@/assets/bcet-logo.png";
import falconLogo from "@/assets/falcon-logo-background.png";

// Resilient Web Audio Synthesizer for Ceremonial Chimes
export function playLaunchAudio(type: "tick" | "fanfare" | "click") {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const now = ctx.currentTime;

    if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === "tick") {
      // Rich acoustic gong chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(293.66, now + 0.4);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.42);
    } else if (type === "fanfare") {
      // Majestic Spartan / Olympic Major Fanfare (D Major chord with harmonic warmth)
      const freqs = [293.66, 369.99, 440.0, 587.33, 739.99, 880.0];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.4 / freqs.length, now + idx * 0.04 + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + 2.9);
      });
    }
  } catch {
    // Non-blocking fallback
  }
}

// High-Performance Golden Confetti & Shimmer Particle Canvas
export function GoldenConfettiBurst({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotSpeed: number;
      shape: "rect" | "circle" | "spark";
      opacity: number;
    };

    const colors = [
      "#ffd700", // Bright gold
      "#d4af37", // Metallic gold
      "#c59b27", // Antique gold
      "#faecd0", // Warm parchment shimmer
      "#b38728", // Bronze gold
      "#ffffff", // Diamond sparkle
    ];

    const particles: Particle[] = [];
    const count = Math.min(130, Math.floor(width / 10));

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      particles.push({
        x: width / 2,
        y: height / 2,
        vx: Math.cos(angle) * speed * (Math.random() * 1.5 + 0.5),
        vy: Math.sin(angle) * speed - (Math.random() * 5 + 3),
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)] ?? "#ffd700",
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        shape: Math.random() > 0.4 ? "rect" : Math.random() > 0.3 ? "spark" : "circle",
        opacity: 1,
      });
    }

    let startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);

      let alive = false;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28; // Gravity
        p.vx *= 0.985; // Drag
        p.rotation += p.rotSpeed;
        p.opacity = Math.max(0, 1 - elapsed / 3.4);

        if (p.opacity > 0 && p.y < height + 50) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;

          if (p.shape === "rect") {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          } else if (p.shape === "circle") {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // 4-point star sparkle
            ctx.beginPath();
            ctx.moveTo(0, -p.size);
            ctx.lineTo(p.size * 0.3, -p.size * 0.3);
            ctx.lineTo(p.size, 0);
            ctx.lineTo(p.size * 0.3, p.size * 0.3);
            ctx.lineTo(0, p.size);
            ctx.lineTo(-p.size * 0.3, p.size * 0.3);
            ctx.lineTo(-p.size, 0);
            ctx.lineTo(-p.size * 0.3, -p.size * 0.3);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();
        }
      });

      if (alive && elapsed < 3.8) {
        animId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="launch-confetti-canvas"
      aria-hidden="true"
    />
  );
}

interface LaunchCeremonyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartVoyage: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isTimerRunning: boolean;
}

export function LaunchCeremonyModal({
  isOpen,
  onClose,
  onStartVoyage,
  soundEnabled,
  onToggleSound,
  isTimerRunning,
}: LaunchCeremonyModalProps) {
  const [countdownState, setCountdownState] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Trigger Inaugural Sequence: 3 -> 2 -> 1 -> LAUNCH!
  const handleLaunchClick = useCallback(() => {
    if (soundEnabled) playLaunchAudio("click");
    setCountdownState(3);
    if (soundEnabled) playLaunchAudio("tick");

    const timer2 = setTimeout(() => {
      setCountdownState(2);
      if (soundEnabled) playLaunchAudio("tick");
    }, 1000);

    const timer1 = setTimeout(() => {
      setCountdownState(1);
      if (soundEnabled) playLaunchAudio("tick");
    }, 2000);

    const timerLaunch = setTimeout(() => {
      setCountdownState(0); // 0 = LAUNCH!
      setShowConfetti(true);
      if (soundEnabled) playLaunchAudio("fanfare");
      onStartVoyage();
    }, 3000);

    const timerDone = setTimeout(() => {
      setCountdownState(null);
      onClose();
    }, 4500);

    return () => {
      clearTimeout(timer2);
      clearTimeout(timer1);
      clearTimeout(timerLaunch);
      clearTimeout(timerDone);
    };
  }, [soundEnabled, onStartVoyage, onClose]);

  if (!isOpen) return null;

  const romanNumbers: Record<number, string> = {
    3: "III",
    2: "II",
    1: "I",
    0: "VOYAGE COMMENCED!",
  };

  return (
    <div className="launch-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="launch-dialog-title">
      <GoldenConfettiBurst active={showConfetti} />

      <div className="launch-modal-card">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="launch-modal-close"
          aria-label="Close Launch Dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {countdownState !== null ? (
          /* Active Cinematic Launch Countdown */
          <div className="launch-countdown-container" aria-live="assertive">
            <div className="launch-countdown-ring" />
            <div className="launch-countdown-value">
              {romanNumbers[countdownState] || countdownState}
            </div>
            <div className="launch-countdown-sub">
              {countdownState === 0
                ? "The 24-Hour ODYSSEY Hackathon is Officially Live!"
                : "Synchronizing 24-Hour Master Clock..."}
            </div>
          </div>
        ) : (
          /* Grand Ceremonial Pre-Launch Dashboard */
          <>
            {/* Header Badge */}
            <div className="launch-modal-top">
              <div className="launch-insignia">
                <img src={odysseyEmblem} alt="" className="launch-emblem-icon" />
              </div>
              <div className="launch-eyebrow">
                <span>BALASORE COLLEGE OF ENGINEERING & TECHNOLOGY</span>
              </div>
            </div>

            {/* Title & Brand */}
            <div className="launch-title-block">
              <h2 id="launch-dialog-title" className="launch-title">
                ODYSSEY 2026
              </h2>
              <div className="launch-subtitle">THE 24-HOUR INTER-COLLEGE HACKATHON</div>
              <p className="launch-tagline">
                “Every great idea begins with a voyage. One arena, limitless ambition.”
              </p>
            </div>

            {/* Launch Parameters / Key Pillars */}
            <div className="launch-pillars">
              <div className="launch-pillar-item">
                <ShieldCheck className="pillar-icon" />
                <div className="pillar-text">
                  <strong>24 Hours</strong>
                  <span>Continuous Innovation</span>
                </div>
              </div>
              <div className="launch-pillar-item">
                <Flame className="pillar-icon" />
                <div className="pillar-text">
                  <strong>Real-Time Clock</strong>
                  <span>Mechanical 3D Split-Flap</span>
                </div>
              </div>
              <div className="launch-pillar-item">
                <Compass className="pillar-icon" />
                <div className="pillar-text">
                  <strong>Inter-College Arena</strong>
                  <span>Code • Build • Pitch</span>
                </div>
              </div>
            </div>

            {/* Action Deck */}
            <div className="launch-actions">
              <button
                type="button"
                onClick={handleLaunchClick}
                className="launch-start-btn"
                aria-label="Start the 24-Hour Hackathon Voyage"
              >
                <div className="btn-glow-aura" />
                <Rocket className="btn-icon" />
                <span className="btn-label-main">
                  {isTimerRunning ? "RE-LAUNCH CEREMONY" : "START THE VOYAGE"}
                </span>
                <span className="btn-label-sub">COMMENCE 24-HOUR COUNTDOWN</span>
              </button>

              {/* Utility Row: Sound toggle + Direct clock view */}
              <div className="launch-aux-controls">
                <button
                  type="button"
                  onClick={onToggleSound}
                  className={`sound-toggle-btn ${soundEnabled ? "is-active" : ""}`}
                  title={soundEnabled ? "Fanfare Sound Enabled" : "Sound Muted"}
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>Audio Fanfare: ON</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>Audio Fanfare: OFF</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="bypass-launch-btn"
                >
                  View Clock Directly →
                </button>
              </div>
            </div>

            {/* Partner Logos Footer */}
            <div className="launch-footer-logos">
              <img src={logo} alt="BCET" className="launch-footer-logo" />
              <span className="launch-footer-sep">◆</span>
              <img src={falconLogo} alt="Falcon Club" className="launch-footer-logo" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Inline Organizer Deck beneath the clock for instant Start, Pause, Reset, Launch
interface OrganizerControlsProps {
  isRunning: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onOpenLaunchModal: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isMaximized: boolean;
}

export function OrganizerControls({
  isRunning,
  onTogglePlay,
  onReset,
  onOpenLaunchModal,
  soundEnabled,
  onToggleSound,
  isMaximized,
}: OrganizerControlsProps) {
  return (
    <div className={`organizer-deck ${isMaximized ? "is-compact" : ""}`} aria-label="Hackathon Timer Controls">
      {/* Status indicator */}
      <div className="deck-status">
        <span className={`status-dot ${isRunning ? "is-live" : "is-paused"}`} />
        <span className="status-text">{isRunning ? "HACKATHON IN PROGRESS" : "STANDBY • READY TO START"}</span>
      </div>

      <div className="deck-buttons">
        {/* Main Start / Pause Button */}
        <button
          type="button"
          onClick={onTogglePlay}
          className={`deck-btn deck-btn-primary ${!isRunning ? "btn-pulse-ready" : ""}`}
          aria-label={isRunning ? "Pause Countdown" : "Start Countdown"}
          title={isRunning ? "Pause Countdown (Spacebar)" : "Start Countdown (Spacebar)"}
        >
          {isRunning ? (
            <>
              <span className="deck-btn-icon">⏸</span>
              <span>PAUSE</span>
            </>
          ) : (
            <>
              <Play className="deck-btn-icon w-3.5 h-3.5 fill-current" />
              <span>START TIMER</span>
            </>
          )}
        </button>

        {/* Ceremonial Launch Modal Trigger */}
        <button
          type="button"
          onClick={onOpenLaunchModal}
          className="deck-btn deck-btn-ceremony"
          aria-label="Open Launch Ceremony Screen"
          title="Open Launch Ceremony Stage Screen"
        >
          <Sparkles className="deck-btn-icon w-3.5 h-3.5" />
          <span>LAUNCH CEREMONY</span>
        </button>

        {/* Reset Button */}
        <button
          type="button"
          onClick={onReset}
          className="deck-btn deck-btn-secondary"
          aria-label="Reset Timer to 24 Hours"
          title="Reset Clock to 24:00:00"
        >
          <span>↺ RESET</span>
        </button>

        {/* Sound Toggle */}
        <button
          type="button"
          onClick={onToggleSound}
          className="deck-btn deck-btn-icon-only"
          aria-label={soundEnabled ? "Mute Fanfare" : "Enable Fanfare"}
          title={soundEnabled ? "Fanfare Sound ON" : "Fanfare Sound OFF"}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 opacity-60" />}
        </button>
      </div>
    </div>
  );
}
