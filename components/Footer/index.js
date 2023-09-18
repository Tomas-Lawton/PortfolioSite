import React from "react";
import Button from "../Button";

const Footer = ({}) => {
  return (
    <>
      <div>
        <div className="gradient mt-10 bg-slate-100 p-6 laptop:p-16 tablet:p-12 rounded-lg flex flex-col items-center">
          <h2 className="text-3xl p-3 tablet:text-3xl laptop:text-5xl text-bold mt-6 w-full text-center">
            tomaslawton@gmail.com
          </h2>
          <Button
            classes={"m-0 my-5 mt-5"}
            onClick={() =>
              window.open(
                "mailto:tomaslawton@gmail.com?subject=Hello&body=Hello%20Tomas%2C%0D%0A%0D%0A"
              )
            }
            target="_blank"
            type="primary"
          >
            Email
          </Button>
        </div>
      </div>
    </>
  );
};

export default Footer;
