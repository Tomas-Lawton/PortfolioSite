import React from "react";
import Socials from "../Socials";
import Button from "../Button";

const Footer = ({}) => {
  return (
    <>
      <div className="mt-5 laptop:mt-40 p-2 laptop:p-0">
        <div>
          <div className="mt-10">
            <h1 className="text-3xl tablet:text-4xl laptop:text-4xl laptopl:text-5xl text-bold">
              Let&apos;s work
            </h1>
            <h1 className="text-3xl tablet:text-4xl laptop:text-4xl laptopl:text-5xl text-bold">
              together!
            </h1>
            <Button onClick={() => window.open("mailto:tomaslawton@gmail.com?subject=Interview&body=Dear%20Tomas...")} type="primary">Contact</Button>
            <div className="mt-10">
              <Socials />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
