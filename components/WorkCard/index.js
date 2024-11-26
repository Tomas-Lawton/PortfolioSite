import React from "react";
import Image from 'next/image';

const WorkCard = ({ img, name, description, onClick, url }) => {
  return (
    <div
      className={`${
        url !== "" && `hover:scale-105`
      } justify-between gap-4 flex flex-col overflow-hidden rounded-xl p-5 first:ml-0 link transition-all ease-out duration-500 bg-zinc-100	`}
      onClick={onClick}
    >
      <div
        className="relative rounded-lg overflow-hidden transition-all ease-out duration-300 h-48 mob:h-auto"
        // style={{ height: "auto" }}
      >
        <Image alt={name} className="h-full w-full object-cover" src={img}></Image>
      </div>

      <div className="flex items-center arrange-card">
        <h1 className="text-3xl font-medium align-middle">
          {name ? name : "Project Name"}
        </h1>
        {/* {url !== "" &&
          <Image
            className="w-6 h-6 -mt-1 ml-2"
            src={`/images/link.svg`}
            alt="link-icon"
          ></Image>} */}

        <h2 className="text-xl">{description ? description : "Description"}</h2>

        {url !== "" && (
          <button
            src={`/images/link.svg`}
            alt="link-icon"
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              View Project
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default WorkCard;
