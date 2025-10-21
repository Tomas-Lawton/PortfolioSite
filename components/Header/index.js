import React, { useEffect, useState } from "react";
import data from "../../data/portfolio.json";
import Image from "next/image";

const Header = ({
  handleContactScroll,
  showFullWindow,
  scrollToTop,
  scrollProgress,
  bodyRef,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (bodyRef && bodyRef.current) {
        const scrollTop = bodyRef.current.scrollTop;
        setIsScrolled(scrollTop > 10);
      }
    };

    const currentBody = bodyRef?.current;
    if (currentBody) {
      currentBody.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
    }

    return () => {
      if (currentBody) {
        currentBody.removeEventListener("scroll", handleScroll);
      }
    };
  }, [bodyRef]);

  return (
    <>
      <div
        className={`sticky top-0 w-full z-50 custom-p tablet:block pointer-events-none ${
          isScrolled ? "bg-black bg-opacity-30 backdrop-blur-sm" : ""
        }`}
        style={{
          transition:
            "background-color 0.3s ease, backdrop-filter 0.3s ease, border 0.3s ease",
        }}
      >
        <div
          className="pointer-events-auto absolute top-0 left-0 h-0.5 bg-[#7fff00] z-10"
          style={{
            width: `${scrollProgress}%`,
            boxShadow: "0 0 8px #7fff00",
          }}
        />

        <div className="flex flex-row justify-between items-center w-full py-2 pointer-events-auto">
          <button
            onClick={scrollToTop}
            className="cursor-pointer hover:text-[#7fff00] transition-colors duration-300 flex items-center gap-3 group"
            aria-label="Scroll to top"
          >
            <Image
              className="select-none"
              src={`/images/sprite.png`}
              alt="profile-icon"
              width={45}
              height={45}
            />
            <span className="hidden mob:block text-sm font-mono font-bold opacity-80 group-hover:opacity-100 transition-opacity">
              TOMMY
            </span>
          </button>

          <div className="flex items-center">
            <button
              onClick={handleContactScroll}
              className="text-sm font-medium text-white/80 hover:text-[#7fff00] transition-colors duration-300"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
