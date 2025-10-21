import React from "react";
import Image from "next/image";

const WorkCard = ({ img, name, description, onClick, url }) => {
  return (
    <div
      className={`${
        url !== "" && "hover:-translate-y-1"
      } flex flex-col overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm transition-all duration-300 hover:border-[#7fff00]/80 hover:shadow-2xl hover:shadow-[#7fff00]/40 group relative`}
    >
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#7fff00]/20 via-[#7fff00]/5 to-transparent blur-xl"></div>
      </div>

      <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
        <Image
          width={540}
          height={300}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={img}
        />
      </div>

      <div className="flex flex-col gap-3 p-6 relative z-10">
        <h3
          className="text-xl font-semibold text-[white] tracking-tight"
          style={{ letterSpacing: "-0.01em" }}
        >
          {name || "Project Name"}
        </h3>

        <p
          className="text-sm text-white/80 leading-relaxed"
          style={{ letterSpacing: "0" }}
        >
          {description || "Description"}
        </p>

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
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
          // <button
          //   onClick={onClick}
          //   src={`/images/link.svg`}
          //   alt="link-icon"
          //   className="w-50 relative inline items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-white rounded-lg group bg-gradient-to-br from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 dark:focus:ring-green-800 focus:ring-4 focus:outline-none focus:ring-green-300"
          // >
          //   <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 dark:bg-gray-900 rounded-md hover:bg-opacity-0">
          //     View Project
          //   </span>
          // </button>
        )}
      </div>
    </div>
  );
};

export default WorkCard;
