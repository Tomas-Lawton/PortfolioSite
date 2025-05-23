import { Popover } from "@headlessui/react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import Button from "../Button";
// Local Data
import data from "../../data/portfolio.json";
import Image from "next/image";

const Header = ({ handleContactScroll, showFullWindow }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { name, showBlog, showResume } = data;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div
        // fixed breaks scroll
        className={`${
          showFullWindow ? "fixed" : "absolute"
        } drop-shadow-md w-full z-10 custom-p hidden tablet:block`}
      >
        <div className="flex flex-row justify-between w-full">
          <Image
            className="profile-icon link select-none"
            src={`/images/sprite.png`}
            alt="profile-icon"
            width={55}
            height={55}
            onClick={() =>
              window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
            }
          />

          <div className="flex items-center">
            {/* <Button onClick={handleContactScroll}>Contact</Button> */}
            <button
              onClick={handleContactScroll}
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-white rounded-lg group bg-gradient-to-br from-lime-400 to-green-500 group-hover:from-lime-500 group-hover:to-green-600 dark:focus:ring-green-800 focus:ring-4 focus:outline-none focus:ring-green-300"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Contact
              </span>
            </button>

            {mounted && theme && data.darkMode && (
              <Button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Image
                  width={100}
                  height={100}
                  className="h-6"
                  src={`/images/${theme === "dark" ? "moon.svg" : "sun.svg"}`}
                ></Image>
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
