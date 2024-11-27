import React from "react";
import Button from "../Button";

import { aboutpara } from "../../data/portfolio.json";

const Footer = ({}) => {
  return (
    <>
      <div>
        <div className="dark-mode bg-slate-100 p-6 laptop:p-16 tablet:p-12 rounded-lg flex flex-col items-start gap-3 mt-10">
        <h1 className="text-3xl font-bold w-full">Send me an email</h1>
          <h2 className="text-xl">{aboutpara}</h2>
          <h2 className="text-xl font-bold w-full">tomaslawton@gmail.com</h2>
          {/* <Button
            classes={"m-0 my-5 mt-5"}
            onClick={() =>
              window.open(
                "mailto:tomaslawton@gmail.com?subject=Hello&body=Hello%20Tomas%2C%0D%0A%0D%0A"
              )
            }
            target="_blank"
            type="primary"
          >
            Contact
          </Button> */}

          {/* <button
            onClick={() =>
              window.open(
                "mailto:tomaslawton@gmail.com?subject=Hello&body=Hello%20Tomas%2C%0D%0A%0D%0A"
              )
            }
            target="_blank"
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Email Now
            </span>
          </button> */}
          <button
  onClick={() =>
    window.open(
      "mailto:tomaslawton@gmail.com?subject=Hello&body=Hello%20Tomas%2C%0D%0A%0D%0A"
    )
  }
  target="_blank"
  className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-white rounded-lg group bg-gradient-to-br from-lime-400 to-green-500 group-hover:from-lime-500 group-hover:to-green-600 dark:focus:ring-green-800 focus:ring-4 focus:outline-none focus:ring-green-300"
>
  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
    Email Now
  </span>
</button>
        </div>
      </div>
    </>
  );
};

export default Footer;
