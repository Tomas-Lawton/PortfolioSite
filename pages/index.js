import React, { useState, useEffect, useRef } from "react";
import LandingPage from "./page_components/landingpage";
import Scene from "./page_components/scene";
import Panel from "../components/Panel";

export default function App() {
  const [isClient, setIsClient] = useState(false);

  const [largeScreen, setlargeScreen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768;
    }
    return true; // Default for SSR
  });

  const [mode, setMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768 ? "landing" : null;
    }
    return null;
  });

  const [immersiveMode, setImmersiveMode] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);

  // Hydration safety
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/scifi-fantasy-soundscape-21618.mp3");
      audioRef.current.volume = 0.5;
      audioRef.current.loop = true; // Optional: loop the music
    }
  }, []);

  const playMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => {
          console.log("Audio play prevented:", err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        const isLarge = window.innerWidth >= 768;
        setlargeScreen(isLarge);

        // If user resizes to mobile while in scene mode, switch to landing
        if (!isLarge && mode === "scene") {
          setMode("landing");
          if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
          }
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mode]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Prevent hydration issues
  if (!isClient) {
    return null;
  }

  // Mobile devices skip Panel and go straight to LandingPage
  if (!mode) {
    return <Panel onSelectMode={setMode} />;
  }

  // Force mobile users to landing page
  const showScene = largeScreen && mode === "scene" && immersiveMode;

  return (
    <div className="overlay-black">
      {showScene ? <Scene /> : <LandingPage showFullWindow={true} />}

      {largeScreen && mode === "scene" && (
        <button
          className="fullscreen-btn"
          onClick={() => {
            if (immersiveMode) {
              audioRef.current?.pause();
              setIsPlaying(false);
            }
            setImmersiveMode((prev) => !prev);
          }}
          aria-label={
            immersiveMode ? "Exit fullscreen" : "Enter immersive mode"
          }
        >
          <svg
            viewBox="0 0 448 512"
            xmlns="http://www.w3.org/2000/svg"
            className={immersiveMode ? "" : "activebutton"}
          >
            <path d="M32 32C14.3 32 0 46.3 0 64v96c0 17.7 14.3 32 32 32s32-14.3 32-32V96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H64V352zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h64v64c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H320zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V352z"></path>
          </svg>
          <span className="tooltip">
            {immersiveMode ? "Fullscreen" : "Immersive"}
          </span>
        </button>
      )}

      {largeScreen && mode === "scene" && immersiveMode && (
        <div className="room-text text-2 tek">
          <input
            type="checkbox"
            id="checkboxInput"
            defaultChecked
            onChange={() => playMusic()}
            aria-label="Toggle music"
          />
          <label
            htmlFor="checkboxInput"
            className="toggleSwitch fullscreen-btn"
          >
            <div className="speaker">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.0"
                viewBox="0 0 75 75"
                aria-hidden="true"
              >
                <path d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z"></path>
                <path d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6"></path>
              </svg>
            </div>

            <div className="mute-speaker">
              <svg
                version="1.0"
                viewBox="0 0 75 75"
                stroke="#7fff00"
                strokeWidth="5"
                aria-hidden="true"
              >
                <path
                  d="m39,14-17,15H6V48H22l17,15z"
                  fill="#7fff00"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="m49,26 20,24m0-24-20,24"
                  fill="#7fff00"
                  strokeLinecap="round"
                ></path>
              </svg>
            </div>
          </label>
        </div>
      )}
    </div>
  );
}
