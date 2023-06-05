import React from "react";
import Socials from "../Socials";
import Button from "../Button";

const Footer = ({}) => {
  return (
    <>
        <div>
          <div className="mt-10 bg-slate-100 p-6 laptop:p-14 tablet:p-12 rounded-lg">
            <h1 className="text-3xl tablet:text-4xl laptop:text-4xl laptopl:text-5xl text-bold">
              Let&apos;s work together!
            </h1>

            <h2 className="text-xl text-bold text-slate-500 mt-5">
            tomaslawton@gmail.com
            </h2>
            <Button classes={"m-0 my-0 mt-5"} onClick={() => window.open("mailto:tomaslawton@gmail.com?subject=Interview&body=Dear%20Tomas...")} type="primary">Contact Now</Button>
           
            <div className="mt-10 hidden tablet:block">
              <Socials />
            </div>
          </div>
      </div>
    </>
  );
};

export default Footer;
