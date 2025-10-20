import React, { useEffect, useState } from "react";
import data from "../../data/portfolio.json";
import Image from "next/image";

const Header = ({ handleContactScroll, showFullWindow, scrollToTop, scrollProgress, bodyRef }) => {
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
        className={`${
          showFullWindow ? "fixed" : "absolute"
        } w-full z-50 custom-p hidden tablet:block ${
          isScrolled ? "bg-black bg-opacity-30 backdrop-blur-sm" : ""
        }`}
        style={{
          transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease, border 0.3s ease'
        }}
      >
        <div 
          className="absolute top-0 left-0 h-0.5 bg-[#7fff00] z-10"
          style={{ 
            width: `${scrollProgress}%`, 
            boxShadow: '0 0 8px #7fff00',
            transition: 'width 0.1s linear'
          }}
        />

        <div className="flex flex-row justify-between items-center w-full py-2">
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
            <span className="hidden laptop:block text-sm font-mono font-bold opacity-80 group-hover:opacity-100 transition-opacity">
              TOMAS
            </span>
          </button>

          <div className="flex items-center">
            <button
              onClick={handleContactScroll}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-white rounded-lg group bg-gradient-to-br from-lime-400 to-green-500 group-hover:from-lime-500 group-hover:to-green-600 focus:ring-4 focus:outline-none focus:ring-green-300"
            >
              <span className="relative px-5 py-2 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Contact
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;