import React from "react";
import Button from "../Button";

import yourData from "../../data/portfolio.json";
import CustomAlert from "../CustomAlert";

const Socials = ({ className, handleContactScroll}) => {
  return (
    // <div
    //   className={`${className} mt-6 flex justify-center tablet:justify-start flex-row`}
    // >
    //   {yourData.socials.map((social, index) => (
    //     <Button
    //       key={index}
    //       onClick={() => window.open(social.link, "")}
    //       target="_blank"
    //       classes={"hero-button"}
    //     >
    //       {social.title}
    //     </Button>
    //   ))}
    // </div>
    <div
      className={`${className} flex justify-center tablet:justify-start flex-row`}
    >
      <CustomAlert handleContactScroll={handleContactScroll}/>
    </div>
  );
};

export default Socials;
