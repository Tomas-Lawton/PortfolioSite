import React from "react";

const WorkCard = ({ img, name, description, onClick, url }) => {
  return (
    <div
      className={`${url !== "" && `hover:scale-105`} overflow-hidden rounded-lg p-2 laptop:p-4 first:ml-0 link transition-all ease-out duration-500`}
      onClick={onClick}
    >
      <div
        className="custom-drop relative rounded-lg overflow-hidden transition-all ease-out duration-300 h-48 mob:h-auto"
        style={{ height: "auto" }}
      >
        <img alt={name} className="h-full w-full object-cover" src={img}></img>
      </div>

<div className="mt-5 flex items-center">
<h1 className="text-3xl font-medium align-middle">
        {name ? name : "Project Name"}
      </h1>
{url !== "" &&
        <img
          className="w-6 h-6 -mt-1 ml-2"
          src={`/images/link.svg`}
          alt="link-icon"
        ></img>}
   

        </div>
      <h2 className="text-xl opacity-50">
        {description ? description : "Description"}
      </h2>
    </div>
  );
};

export default WorkCard;
