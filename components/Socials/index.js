import React from "react";
import Button from "../Button";

import yourData from "../../data/portfolio.json";

const Socials = ({ className }) => {
  return (
    <div
      className={`${className} flex flex-wrap mob:flex-nowrap link justify-center`}
    >
      {yourData.socials.map((social, index) => (
        <Button
          key={index}
          onClick={() => window.open(social.link, "")}
          target="_blank"
          classes={"hero-button"}
        >
          {social.title}
        </Button>
      ))}
    </div>
  );
};

export default Socials;
