import React from "react";
import { FaLinkedin, FaGoogle, FaGithub } from "react-icons/fa";

const BottomInfo = () => {
  return (
    <div className="text-center my-12 p-4 z-10">
      <p className="text-sm mb-2 font-mono tracking-wide opacity-70 cursor-default">
        © 2025 Tomas Lawton • Crafted with chaos & code
      </p>
      <p className="text-xs opacity-60  cursor-default" style={{ letterSpacing: "0.01em" }}>
        Interactive 3D experience available on desktop • Optimized for Chrome/Firefox
      </p>

      <ul className="flex justify-center gap-6 list-none mt-6">
        <li>
          <a
            href="https://www.linkedin.com/in/tomas-lawton-512066199/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white transition hover:bg-blue-600"
          >
            <FaLinkedin size={20} />
          </a>
        </li>
        <li>
          <a
            href="https://scholar.google.com/citations?hl=en&user=OeCxMCgAAAAJ"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white transition hover:bg-orange-600"
          >
            <FaGoogle size={20} />
          </a>
        </li>
        <li>
          <a
            href="https://github.com/Tomas-Lawton"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white transition hover:bg-purple-600"
          >
            <FaGithub size={20} />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default BottomInfo;
