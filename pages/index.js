import React, { useState, useEffect } from "react";
import LandingPage from "./pages/landingpage";
import Scene from "./pages/scene";

export default function App() {
  const [fullscreen, setFullscreen] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(false);

  const showImmerisve = () => isWideScreen && fullscreen;

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsWideScreen(window.innerWidth > 768);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {showImmerisve() ? <Scene /> : <LandingPage />}
      <button
        className="fullscreen-btn"
        onClick={() => setFullscreen((prev) => !prev)}
      >
        <svg
          viewBox="0 0 448 512"
          xmlns="http://www.w3.org/2000/svg"
          className={showImmerisve() ? "" : "activebutton"}
        >
          <path d="M32 32C14.3 32 0 46.3 0 64v96c0 17.7 14.3 32 32 32s32-14.3 32-32V96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H64V352zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h64v64c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H320zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V352z"></path>
        </svg>
        <span className="tooltip">{showImmerisve() ? "Fullscreen" : "Immersive"}</span>
      </button>
    </div>
  );
}
