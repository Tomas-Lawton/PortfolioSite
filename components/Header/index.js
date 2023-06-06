import { Popover } from "@headlessui/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Button from "../Button";
// Local Data
import data from "../../data/portfolio.json";

const Header = ({ handleWorkScroll, handleAboutScroll, handleContactScroll, isBlog }) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { name, showBlog, showResume } = data;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Popover className="block tablet:hidden mt-10 p-2 tablet:p-2 laptop:p-0">
        {({ open }) => (
          <>
            <div className="flex items-center justify-between p-0">

              <img
                className="profile-icon link"
                src={`/images/profile.jpeg`}
                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
              ></img>


              <div className="flex items-center">
                {data.darkMode && (
                  <Button
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                  >
                    <img
                      className="h-6"
                      src={`/images/${theme === "dark" ? "moon.svg" : "sun.svg"
                        }`}
                    ></img>
                  </Button>
                )}

                <Popover.Button>
                  <img
                    className="h-5"
                    src={`/images/${!open
                      ? theme === "dark"
                        ? "menu-white.svg"
                        : "menu.svg"
                      : theme === "light"
                        ? "cancel.svg"
                        : "cancel-white.svg"
                      }`}
                  ></img>
                </Popover.Button>
              </div>
            </div>
            <Popover.Panel
              className={`absolute right-0 z-10 w-11/12 p-4 ${theme === "dark" ? "bg-slate-800" : "bg-white"
                } shadow-md rounded-md`}
            >
              <div className="grid grid-cols-1">
                <Button onClick={handleWorkScroll}>Work</Button>
                <Button onClick={handleAboutScroll}>About</Button>
                {showBlog && (
                  <Button onClick={() => router.push("/blog")}>Blog</Button>
                )}
                <Button
                  onClick={handleContactScroll}
                >
                  Contact
                </Button>
                <Button
                  onClick={() => window.open("https://drive.google.com/drive/folders/1nqMDPDiyenabbyaDCz6vh_fXoiXxxJO2?usp=share_link", "_blank")}>
                  Resume
                </Button>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
      <div
        className={`background-white mt-10 hidden flex-row items-center justify-between sticky ${theme === "light" && "bg-white"
          } dark:text-white top-0 z-10 tablet:flex`}
      >

        <img
          className="profile-icon link"
          src={`/images/profile.jpeg`}
          onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
        ></img>

        {!isBlog ? (
          <div className="flex">
            <Button onClick={handleWorkScroll}>Work</Button>
            <Button onClick={handleAboutScroll}>About</Button>
            <Button onClick={handleContactScroll}>
              Contact
            </Button>
            <Button onClick={() => window.open("https://drive.google.com/drive/folders/1nqMDPDiyenabbyaDCz6vh_fXoiXxxJO2?usp=share_link", "_blank")}>
              Resume
            </Button>
          </div>
        ) : (
          <div className="flex">
            <Button onClick={() => router.push("/")}>Home</Button>
            {showBlog && (
              <Button onClick={() => router.push("/blog")}>Blog</Button>
            )}
            {showResume && (
              <Button
              onClick={() => window.open("https://drive.google.com/drive/folders/1nqMDPDiyenabbyaDCz6vh_fXoiXxxJO2?usp=share_link", "_blank")}
                classes="first:ml-1"
              >
                Resume
              </Button>
            )}

            <Button onClick={handleContactScroll}>
              Contact
            </Button>

            {mounted && theme && data.darkMode && (
              <Button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <img
                  className="h-6"
                  src={`/images/${theme === "dark" ? "moon.svg" : "sun.svg"}`}
                ></img>
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
