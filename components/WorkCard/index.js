import React, { useState } from "react";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";

const WorkCard = ({ 
  img, 
  hoverGif, 
  name, 
  description, 
  onClick, 
  url,
  subtitle,
  stats,
  tags,
  featured 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [gifLoaded, setGifLoaded] = useState(false);

  return (
    <div
      className={`${
        url !== "" && "hover:-translate-y-1"
      } flex flex-col overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm transition-all duration-300 hover:border-[#7fff00]/80 hover:shadow-2xl hover:shadow-[#7fff00]/40 group relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#7fff00]/20 via-[#7fff00]/5 to-transparent blur-xl"></div>
      </div>

      {/* Featured badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-20">
          <div className="text-[10px] px-3 py-1.5 bg-black/80 backdrop-blur-sm text-[#7fff00] rounded-full border border-[#7fff00]/50 font-mono">
            FEATURED
          </div>
        </div>
      )}

      {/* Tags */}
      {!isHovered && tags && tags.length > 0 && (
        <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 max-w-[70%]">
          {tags.slice(0, 3).map((tag, i) => (
            <span 
              key={i}
              className="text-[10px] px-2 py-1 bg-black/80 backdrop-blur-sm text-[#7fff00] rounded-full border border-[#7fff00]/50 font-mono"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Image container with hover GIF */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
        {/* Static image */}
        <Image
          width={540}
          height={300}
          alt={name}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isHovered && hoverGif ? 'opacity-0 scale-105' : 'opacity-100 scale-100 group-hover:scale-105'
          }`}
          src={img}
        />
        
        {/* Animated GIF on hover */}
        {hoverGif && (
          <>
            <img
              alt={`${name} demo`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                isHovered && gifLoaded ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
              src={hoverGif}
              onLoad={() => setGifLoaded(true)}
            />
            
            {isHovered && !gifLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="w-8 h-8 border-2 border-[#7fff00] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </>
        )}

        {/* Hover overlay with play icon */}
        {hoverGif && (
          <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:opacity-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[#7fff00]/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <FaPlay className="text-[#7fff00] text-md ml-1" />
            </div>
          </div>
        )}

        {/* Hover to play text */}
        {hoverGif && !isHovered && (
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm text-[#7fff00] text-[10px] font-mono rounded border border-[#7fff00]/30">
            HOVER TO PLAY
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-6 relative z-10">
        <h3 className="text-xl font-semibold text-white tracking-tight" style={{ letterSpacing: "-0.01em" }}>
          {name || "Project Name"}
        </h3>

        {subtitle && (
          <p className="text-xs text-[#7fff00] font-mono tracking-wide -mt-2">
            {subtitle}
          </p>
        )}

        <p className="text-sm text-white/80 leading-relaxed" style={{ letterSpacing: "0" }}>
          {description || "Description"}
        </p>

        {stats && (
          <div className="flex items-center gap-2 text-[10px] text-[#7fff00]/70 font-mono">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            <span>{stats}</span>
          </div>
        )}

        {url !== "" && (
          <div
            className="flex items-center gap-2 text-[#7fff00] text-sm font-medium mt-2 group-hover:gap-3 transition-all cursor-pointer"
            onClick={url !== "" ? onClick : undefined}
          >
            <span>View Project</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-1"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkCard;