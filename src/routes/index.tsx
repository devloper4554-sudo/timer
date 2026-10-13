import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback, Fragment, useRef } from "react";
import { Hourglass, Maximize, Play } from "lucide-react";
import background from "@/assets/odyssey-background-map.png";
import logo from "@/assets/bcet-logo.png";
import odysseyEmblem from "@/assets/odyssey-emblem.png";
import falconLogo from "@/assets/falcon-logo-background.png";
import sponsorYamaha from "@/assets/sponsors/sponsor_yamaha.png";
import sponsorTvs from "@/assets/sponsors/sponsor_tvs_trans.png";
import sponsorRoastly from "@/assets/sponsors/sponsor_roastly.jpg";
import sponsorOhoride from "@/assets/sponsors/sponsor_ohoride_trans.png";
import sponsorNalco from "@/assets/sponsors/sponsor_nalco_trans.png";
import sponsorSureSuccess from "@/assets/sponsors/sponsor_suresuccess_trans.png";
import sponsorDbMedicare from "@/assets/sponsors/sponsor_dbmedicare_trans.png";
import { GoldenConfettiBurst, playLaunchAudio } from "@/components/LaunchCeremony";
import { usePersistentTimer } from "@/hooks/usePersistentTimer";
import { RestartDropdown } from "@/components/RestartDropdown";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ODYSSEY — The 24-Hour Inter-College Hackathon" },
      { name: "description", content: "One journey. Twenty-four hours. ODYSSEY brings college innovators together to build beyond the ordinary." },
      { property: "og:title", content: "ODYSSEY — The 24-Hour Hackathon" },
      { property: "og:description", content: "An inter-college odyssey of ideas, invention, and ambition. The countdown begins." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function LaurelWreath({ flip = false }: { flip?: boolean }) {
  const idSuffix = flip ? "r" : "l";
  return (
    <svg
      className={`laurel-wreath ${flip ? "laurel-right" : "laurel-left"}`}
      viewBox="0 0 100 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`laurelGold-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fae6a4" />
          <stop offset="30%" stopColor="#d4a852" />
          <stop offset="65%" stopColor="#a37528" />
          <stop offset="100%" stopColor="#623f0e" />
        </linearGradient>
        <filter id={`laurelGlow-${idSuffix}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#381c00" floodOpacity="0.45" />
        </filter>
      </defs>
      <g
        filter={`url(#laurelGlow-${idSuffix})`}
        transform={flip ? "translate(100, 0) scale(-1, 1)" : undefined}
      >
        <path
          d="M 90 152 C 72 120 42 78 18 16"
          stroke={`url(#laurelGold-${idSuffix})`}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path d="M 18 16 C 14 6 17 1 20 1 C 24 1 25 8 18 16 Z" fill={`url(#laurelGold-${idSuffix})`} />
        <path d="M 21 28 C 9 22 7 14 13 12 C 19 10 24 18 21 28 Z" fill={`url(#laurelGold-${idSuffix})`} />
        <path d="M 25 32 C 34 22 42 21 41 27 C 40 33 33 36 25 32 Z" fill={`url(#laurelGold-${idSuffix})`} />
        <path d="M 29 48 C 13 42 10 32 17 30 C 24 28 31 38 29 48 Z" fill={`url(#laurelGold-${idSuffix})`} />
        <path d="M 34 52 C 46 40 55 39 55 46 C 55 53 44 57 34 52 Z" fill={`url(#laurelGold-${idSuffix})`} />
        <path d="M 39 70 C 20 62 17 50 25 48 C 34 46 42 59 39 70 Z" fill={`url(#laurelGold-${idSuffix})`} />
        <path d="M 45 74 C 60 60 70 60 69 68 C 67 76 55 80 45 74 Z" fill={`url(#laurelGold-${idSuffix})`} />
        <path d="M 51 94 C 30 86 26 73 36 71 C 46 69 54 83 51 94 Z" fill={`url(#laurelGold-${idSuffix})`} />
        <path d="M 58 98 C 76 82 86 84 85 92 C 83 100 70 105 58 98 Z" fill={`url(#laurelGold-${idSuffix})`} />
        <path d="M 64 120 C 44 112 40 98 50 96 C 60 94 68 108 64 120 Z" fill={`url(#laurelGold-${idSuffix})`} />
        <path d="M 72 124 C 91 108 101 112 98 120 C 95 128 82 132 72 124 Z" fill={`url(#laurelGold-${idSuffix})`} />
        <path d="M 78 144 C 58 136 56 122 65 120 C 74 118 82 132 78 144 Z" fill={`url(#laurelGold-${idSuffix})`} />
        <path d="M 85 146 C 102 134 107 140 104 147 C 101 154 92 155 85 146 Z" fill={`url(#laurelGold-${idSuffix})`} />
        <circle cx="24" cy="27" r="2.2" fill="#fae6a4" />
        <circle cx="32" cy="48" r="2.5" fill="#fae6a4" />
        <circle cx="43" cy="71" r="2.8" fill="#fae6a4" />
        <circle cx="56" cy="94" r="3" fill="#fae6a4" />
        <circle cx="70" cy="118" r="3" fill="#fae6a4" />
      </g>
    </svg>
  );
}

function FlipClockCard({ value }: { value: number }) {
  const formattedValue = String(value).padStart(2, "0");
  const [current, setCurrent] = useState(formattedValue);
  const [previous, setPrevious] = useState(formattedValue);
  const [flipKey, setFlipKey] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const prevRef = useRef(formattedValue);

  useEffect(() => {
    if (prevRef.current !== formattedValue) {
      setPrevious(prevRef.current);
      setCurrent(formattedValue);
      setIsFlipping(true);
      setFlipKey((k) => k + 1);
      prevRef.current = formattedValue;

      const timer = window.setTimeout(() => {
        setIsFlipping(false);
      }, 550);

      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [formattedValue]);

  return (
    <div className="time-face">
      {/* Background Top: Current top half */}
      <div className="flip-half flip-half-top">
        <div className="flip-numeral-wrap">
          <span className="time-number">{current}</span>
        </div>
      </div>

      {/* Background Bottom: Previous (or current when resting) bottom half */}
      <div className="flip-half flip-half-bottom">
        <div className="flip-numeral-wrap">
          <span className="time-number">{isFlipping ? previous : current}</span>
        </div>
      </div>

      {/* Active 3D Folding Flaps during transition */}
      {isFlipping && (
        <Fragment key={flipKey}>
          {/* Top Flap: Previous top half folding downwards */}
          <div className="flip-half flip-half-top flip-leaf-top">
            <div className="flip-numeral-wrap">
              <span className="time-number">{previous}</span>
            </div>
            <div className="flip-shadow flip-shadow-top" />
          </div>

          {/* Bottom Flap: Current bottom half unfolding into view */}
          <div className="flip-half flip-half-bottom flip-leaf-bottom">
            <div className="flip-numeral-wrap">
              <span className="time-number">{current}</span>
            </div>
            <div className="flip-shadow flip-shadow-bottom" />
          </div>
        </Fragment>
      )}

      {/* Center Seam & Metallic Bronze Side Hinges */}
      <span className="time-seam" />
      <span className="time-hinge time-hinge-left" />
      <span className="time-hinge time-hinge-right" />
    </div>
  );
}

function SponsorsTrack() {
  return (
    <div className="hero-sponsors" aria-label="Our Sponsors">
      <div className="sponsors-header">
        <span className="sponsors-rule" />
        <span className="sponsors-title">OUR SPONSORS</span>
        <span className="sponsors-rule" />
      </div>
      <div className="sponsors-track">
        <div className="sponsor-card">
          <img src={sponsorYamaha} alt="Yamaha Racing - Sai Ananta Automobiles" className="sponsor-img" />
        </div>
        <div className="sponsor-card">
          <img src={sponsorTvs} alt="Balasore TVS" className="sponsor-img" />
        </div>
        <div className="sponsor-card">
          <img src={sponsorDbMedicare} alt="DB MediCare - A Bond Beyond Prescription" className="sponsor-img" />
        </div>
        <div className="sponsor-card">
          <img src={sponsorRoastly} alt="Roastly" className="sponsor-img" />
        </div>
        <div className="sponsor-card">
          <img src={sponsorOhoride} alt="Oho Ride" className="sponsor-img" />
        </div>
        <div className="sponsor-card">
          <img src={sponsorNalco} alt="Nalco" className="sponsor-img" />
        </div>
        <div className="sponsor-card">
          <img src={sponsorSureSuccess} alt="Sure Success" className="sponsor-img" />
        </div>
      </div>
    </div>
  );
}

function Index() {
  const {
    viewMode,
    remaining,
    isRunning,
    setViewMode,
    handleStartVoyage: startTimer,
    handleTogglePlay: toggleTimer,
    handleReset: resetTimer,
  } = usePersistentTimer();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleMaximize = useCallback(async () => {
    const shouldMaximize = !isFullscreen && !isMaximized;
    setIsMaximized(shouldMaximize);

    try {
      if (!document.fullscreenElement) {
        const root = document.documentElement;
        if (root.requestFullscreen) {
          await root.requestFullscreen();
        } else if ((root as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
          await (root as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
        } else if ((root as unknown as { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen) {
          await (root as unknown as { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as unknown as { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
          await (document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
        } else if ((document as unknown as { msExitFullscreen?: () => Promise<void> }).msExitFullscreen) {
          await (document as unknown as { msExitFullscreen: () => Promise<void> }).msExitFullscreen();
        }
      }
    } catch (err) {
      console.warn("Fullscreen toggle error:", err);
    }
  }, [isFullscreen, isMaximized]);

  // When clicking START on the Launching Page:
  // Directly opens the Main Page and starts the countdown timer with persistence!
  const handleStartVoyage = useCallback(() => {
    if (soundEnabled) playLaunchAudio("fanfare");
    setShowConfetti(true);
    startTimer();
    setTimeout(() => setShowConfetti(false), 4500);
  }, [soundEnabled, startTimer]);

  const handleTogglePlay = useCallback(() => {
    if (soundEnabled) playLaunchAudio("click");
    toggleTimer();
  }, [soundEnabled, toggleTimer]);

  const handleReset = useCallback(() => {
    if (soundEnabled) playLaunchAudio("click");
    resetTimer();
  }, [soundEnabled, resetTimer]);

  const handleRestartVoyageFromDropdown = useCallback(
    (seconds: number = 24 * 3600) => {
      if (soundEnabled) playLaunchAudio("fanfare");
      setShowConfetti(true);
      startTimer(seconds);
      setViewMode("main");
      setTimeout(() => setShowConfetti(false), 4500);
    },
    [soundEnabled, startTimer, setViewMode],
  );

  const handleResetStandbyFromDropdown = useCallback(
    (seconds: number = 24 * 3600) => {
      if (soundEnabled) playLaunchAudio("click");
      resetTimer(seconds, "main");
    },
    [soundEnabled, resetTimer],
  );

  const handleReturnToLaunchFromDropdown = useCallback(() => {
    if (soundEnabled) playLaunchAudio("click");
    resetTimer(24 * 3600, "launch");
  }, [soundEnabled, resetTimer]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = Boolean(document.fullscreenElement);
      setIsFullscreen(active);
      if (!active) {
        setIsMaximized(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const targetTag = (event.target as HTMLElement | null)?.tagName;
      if (targetTag === "INPUT" || targetTag === "TEXTAREA") return;

      if (event.key === " " || event.code === "Space") {
        event.preventDefault();
        if (viewMode === "launch") {
          handleStartVoyage();
        } else {
          handleTogglePlay();
        }
      } else if (event.key === "f" || event.key === "F" || event.key === "m" || event.key === "M") {
        event.preventDefault();
        toggleMaximize();
      } else if (event.key === "r" || event.key === "R") {
        event.preventDefault();
        handleReset();
      } else if (event.key === "l" || event.key === "L") {
        event.preventDefault();
        setViewMode((prev) => (prev === "launch" ? "main" : "launch"));
      } else if (event.key === "Escape" && isMaximized) {
        setIsMaximized(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleMaximize, handleStartVoyage, handleTogglePlay, handleReset, viewMode, isMaximized, setViewMode]);

  const handleHeroDoubleClick = (e: React.MouseEvent) => {
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag !== "BUTTON" && tag !== "A" && tag !== "IMG") {
      toggleMaximize();
    }
  };

  const isExpanded = isFullscreen || isMaximized;

  const time = [
    { label: "HOURS", value: Math.floor(remaining / 3600) },
    { label: "MINUTES", value: Math.floor((remaining % 3600) / 60) },
    { label: "SECONDS", value: remaining % 60 },
  ];

  return (
    <>
      {/* Global Celebratory Confetti Burst on Start */}
      <GoldenConfettiBurst active={showConfetti} />

      {viewMode === "launch" ? (
        /* ========================================================
           1. PROFESSIONAL STRUCTURED LAUNCHING PAGE
           ======================================================== */
        <section
          className={`launch-page-view odyssey-hero ${isExpanded ? "is-maximized" : ""}`}
          aria-label="ODYSSEY Launching Page"
          data-fullscreen={isExpanded}
          onDoubleClick={handleHeroDoubleClick}
        >
          <img className="hero-art" src={background} alt="" fetchPriority="high" />

          {/* Header Bar */}
          <header className="hero-nav">
            <div className="hero-flank hero-flank-left">
              <img className="hero-logo" src={logo} alt="BCET emblem" width="421" height="560" />
            </div>

            <div className="nav-center">
              <div className="launch-college-badge">
                BALASORE COLLEGE OF ENGINEERING & TECHNOLOGY
              </div>
            </div>

            <div className="hero-flank hero-flank-right">
              {!isExpanded && (
                <div className="hero-flank-controls">
                  <RestartDropdown
                    isRunning={isRunning}
                    remaining={remaining}
                    onRestartVoyage={handleRestartVoyageFromDropdown}
                    onResetStandby={handleResetStandbyFromDropdown}
                    onReturnToLaunch={handleReturnToLaunchFromDropdown}
                  />
                  <button
                    type="button"
                    onClick={toggleMaximize}
                    className="maximize-btn"
                    aria-label="Maximize to Full Screen (Press F or M)"
                    title="Maximize to Full Screen (Press F or M)"
                  >
                    <Maximize aria-hidden="true" className="maximize-icon" />
                    <span className="maximize-label">Maximize</span>
                    <kbd className="maximize-kbd">F</kbd>
                  </button>
                </div>
              )}
              <img className="hero-falcon-logo" src={falconLogo} alt="Falcon logo" />
            </div>
          </header>

          {/* Center Structured Launch Card */}
          <main className="launch-main">
            <div className="launch-stage-card">
              <div className="launch-title-row">
                <LaurelWreath />
                <h1 className="launch-title" aria-label="ODYSSEY 2026">
                  <img className="launch-title-emblem" src={odysseyEmblem} alt="" aria-hidden="true" />
                  <span>DYSSEY 2026</span>
                </h1>
                <LaurelWreath flip />
              </div>

              <div className="launch-subtitle">THE 24-HOUR INTER-COLLEGE HACKATHON</div>

              <p className="launch-tagline">
                “Every great idea begins with a voyage. One arena, limitless ambition. 24 hours to turn your vision into a legacy.”
              </p>

              {/* The Grand START BUTTON */}
              <div className="launch-start-action">
                <button
                  type="button"
                  onClick={handleStartVoyage}
                  className="grand-start-btn"
                  aria-label="Start the 24-Hour Hackathon Voyage"
                >
                  <Play className="grand-start-btn-icon fill-current" />
                  <span>START THE 24-HOUR VOYAGE</span>
                </button>
              </div>
            </div>
          </main>

          {/* Sponsors at bottom */}
          <SponsorsTrack />
        </section>
      ) : (
        /* ========================================================
           2. LIVE MAIN PAGE (24-Hour Countdown Clock Dashboard)
           ======================================================== */
        <section
          className={`odyssey-hero ${isExpanded ? "is-maximized" : ""}`}
          aria-label="ODYSSEY inter-college hackathon"
          data-fullscreen={isExpanded}
          onDoubleClick={handleHeroDoubleClick}
        >
          <img className="hero-art" src={background} alt="" fetchPriority="high" />

          {/* Top Header: 3-column balanced symmetry */}
          <header className="hero-nav">
            {/* Left Flank: BCET Emblem */}
            <div className="hero-flank hero-flank-left">
              <img className="hero-logo" src={logo} alt="BCET emblem" width="421" height="560" />
            </div>

            {/* Center: Main Branding & Challenge Info */}
            <div className="nav-center">
              <div className="hero-eyebrow">A journey beyond the ordinary</div>
              <div className="hero-title-wrap">
                <LaurelWreath />
                <h1 className="hero-title" aria-label="ODYSSEY">
                  <img className="hero-title-emblem" src={odysseyEmblem} alt="" aria-hidden="true" />
                  <span>DYSSEY</span>
                </h1>
                <LaurelWreath flip />
              </div>
              <div className="hero-scroll-card">
                <p className="hero-tagline">EVERY GREAT IDEA BEGINS WITH A VOYAGE.</p>
                <p className="hero-description">
                  One arena, limitless possibilities.<br />24 hours to turn your vision into a legacy.
                </p>
                <div className="countdown-badge">
                  <Hourglass aria-hidden="true" className="countdown-badge-icon" />
                  <span>
                    {remaining === 0
                      ? "THE VOYAGE IS COMPLETE"
                      : isRunning
                      ? "THE 24-HOUR CHALLENGE • LIVE"
                      : "STANDBY • PAUSED"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Flank: Controls (Restart Dropdown + Maximize) + Falcon Emblem */}
            <div className="hero-flank hero-flank-right">
              {!isExpanded && (
                <div className="hero-flank-controls">
                  <RestartDropdown
                    isRunning={isRunning}
                    remaining={remaining}
                    onRestartVoyage={handleRestartVoyageFromDropdown}
                    onResetStandby={handleResetStandbyFromDropdown}
                    onReturnToLaunch={handleReturnToLaunchFromDropdown}
                  />
                  <button
                    type="button"
                    onClick={toggleMaximize}
                    className="maximize-btn"
                    aria-label="Maximize to Full Screen (Press F or M)"
                    title="Maximize to Full Screen (Press F or M)"
                  >
                    <Maximize aria-hidden="true" className="maximize-icon" />
                    <span className="maximize-label">Maximize</span>
                    <kbd className="maximize-kbd">F</kbd>
                  </button>
                </div>
              )}
              <img className="hero-falcon-logo" src={falconLogo} alt="Falcon logo" />
            </div>
          </header>

          {/* Main Section: Flip-Clock, Organizer Deck, Motto, Unified Sponsors */}
          <main className="hero-main">
            {/* Flip-Clock */}
            <div className="countdown" role="timer" aria-label={`${Math.floor(remaining / 3600)} hours, ${Math.floor((remaining % 3600) / 60)} minutes, ${remaining % 60} seconds remaining`}>
              <div className="time-display" aria-hidden="true">
                {time.map((unit, index) => (
                  <Fragment key={unit.label}>
                    {index > 0 && (
                      <div className="time-colon-wrap">
                        <span className="time-colon">:</span>
                      </div>
                    )}
                    <div className="time-unit">
                      <div className="time-frame">
                        <FlipClockCard value={unit.value} />
                      </div>
                      <span className="time-label">{unit.label}</span>
                    </div>
                  </Fragment>
                ))}
              </div>

              <div className="countdown-divider" aria-hidden="true" />
            </div>

            {/* Motto */}
            <div className="hero-motto">
              <span>IMAGINE</span>
              <span className="motto-divider">◆</span>
              <span>BUILD</span>
              <span className="motto-divider">◆</span>
              <span>TRANSCEND</span>
            </div>

            {/* Sponsors */}
            <SponsorsTrack />
          </main>
        </section>
      )}
    </>
  );
}


