import React, { useRef, useEffect, useState } from "react";
import ScrambleText from "scramble-text";
import { useRouter } from "next/router";
import BottomInfo from "../../components/BottomInfo";

export default function Panel({ onSelectMode }) {
  const titleRef = useRef();
  const descRef = useRef();
  const router = useRouter();

  const [selectedButton, setSelectedButton] = useState(0); // 0 for Scene, 1 for Landing
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        // Auto-redirect to landing page on mobile
        setTimeout(() => onSelectMode("landing"), 100);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [onSelectMode]);

  useEffect(() => {
    if (titleRef.current && !titleRef.current.hasAttribute("data-scrambled")) {
      titleRef.current.setAttribute("data-scrambled", "true");
      new ScrambleText(titleRef.current).start();
    }
  }, []);

  useEffect(() => {
    // Keyboard navigation
    const handleKeyDown = (e) => {
      if (isMobile) return;

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          setSelectedButton(0);
          handleKeyPress();
          break;
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          setSelectedButton(1);
          handleKeyPress();
          break;
        case "Tab":
          e.preventDefault();
          setSelectedButton((prev) => (prev === 0 ? 1 : 0));
          handleKeyPress();
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          handleSelect(selectedButton === 0 ? "scene" : "landing");
          break;
        case "1":
          e.preventDefault();
          handleSelect("scene");
          break;
        case "2":
          e.preventDefault();
          handleSelect("landing");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedButton, isMobile]);

  const handleKeyPress = () => {
    const audio = new Audio("/keypress.mp3");
    audio.volume = 0.5 + Math.random() * 0.4;
    audio.play().catch(() => {}); // Catch in case audio fails
  };

  const handleSelect = (mode) => {
    const audio = new Audio("/mouseclick.mp3");
    audio.volume = 0.5 + Math.random() * 0.4;
    audio.play().catch(() => {}); // Catch in case audio fails

    if (mode === "landing") {
      router.push("/projects");
    } else {
      onSelectMode(mode);
    }
  };

  // Don't render panel on mobile (auto-redirects)
  if (isMobile) {
    return (
      <div className="overlay-black flex items-center justify-center min-h-screen">
        <div className="terminal-loader max-w-md mx-4">
          <div className="terminal-header">
            <div className="terminal-title">T-SHELL</div>
            <div className="terminal-controls">
              <div className="control close"></div>
              <div className="control minimize"></div>
              <div className="control maximize"></div>
            </div>
          </div>
          <div className="p-6 tek text-center">
            <div className="mb-2">Loading mobile view...</div>
            <div className="text-sm opacity-70">Redirecting to portfolio</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overlay-black flex items-center justify-end min-h-screen p-4 flex-col">
      {/* <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-neutral-900 to-zinc-950">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(127,255,0,0.08),transparent_60%)]" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,255,200,0.05),transparent_70%)]" />
</div> */}

      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-neutral-900 to-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_45%,rgba(127,255,0,0.1),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_55%,rgba(255, 166, 0, 0.04),transparent_70%)]" />
      </div>

      <div className="terminal-loader max-w-3xl w-full">
        <div className="terminal-header">
          <div className="terminal-title">T-SHELL</div>
          <div className="terminal-controls">
            <div className="control close opacity-50"></div>
            <div className="control minimize opacity-50"></div>
            <div className="control maximize opacity-50"></div>
          </div>
        </div>

        <div className="p-8">
          <h2 ref={titleRef} className="text-2xl tek mb-6 text-[#7fff00]">
            Tommy&apos;s Portfolio
          </h2>

          <div ref={descRef} className="tek mb-8 leading-relaxed text-white">
            <p className="opacity-85">
              You are about to explore a 3D scene inside a webpage containing
              another webpage with a 3D scene.{" "}
              <span className="text-[#7fff00] font-semibold">
                That’s 3D-inception 🤯
              </span>{" "}
              Here you will find projects at the intersection of human-centered
              design, AI, and creative engineering.
            </p>
          </div>

          <div className="mt-8 mb-4 tek text-[#7fff00] text-lg">
            &gt; Select experience mode:
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              className={`tek border-2 px-8 py-4 transition-all duration-200 cursor-pointer flex-1 text-left relative group ${
                selectedButton === 0
                  ? "border-[#7fff00] bg-[#7fff00] bg-opacity-20 text-[#7fff00] shadow-[0_0_20px_rgba(127,255,0,0.3)]"
                  : "border-[#7fff00] border-opacity-50 text-[#7fff00] text-opacity-70 hover:border-opacity-100 hover:text-opacity-100 hover:bg-[#7fff00] hover:bg-opacity-10"
              }`}
              onClick={() => handleSelect("scene")}
              onMouseEnter={() => {
                setSelectedButton(0);
                handleKeyPress();
              }}
            >
              <span className="text-xl">→ Interactive Mode (Start Here)</span>
              <div className="text-sm mt-2 opacity-70">
                Interactive 3D web experience powered by THREE and Fiber
              </div>
              {selectedButton === 0 && (
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 text-[#7fff00] text-2xl ">
                  ▶
                </div>
              )}
            </button>

            <button
              className={`tek border-2 px-8 py-4 transition-all duration-200 cursor-pointer flex-1 text-left relative group ${
                selectedButton === 1
                  ? "border-[#7fff00] bg-[#7fff00] bg-opacity-20 text-[#7fff00] shadow-[0_0_20px_rgba(127,255,0,0.3)]"
                  : "border-[#7fff00] border-opacity-50 text-[#7fff00] text-opacity-70 hover:border-opacity-100 hover:text-opacity-100 hover:bg-[#7fff00] hover:bg-opacity-10"
              }`}
              onClick={() => handleSelect("landing")}
              onMouseEnter={() => {
                setSelectedButton(1);
                handleKeyPress();
              }}
            >
              <span className="text-xl">→ Project Mode</span>
              <div className="text-sm mt-2 opacity-70">
                View projects directly at /projects for quick access
              </div>
              {selectedButton === 1 && (
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 text-[#7fff00] text-2xl ">
                  ▶
                </div>
              )}
            </button>
          </div>

          <div className="mt-6 tek text-sm text-[#7fff00] opacity-60 text-center">
            Use arrow keys, Tab, or press 1/2 to select • Enter to confirm
          </div>
        </div>
      </div>

      <BottomInfo />
    </div>
  );
}
