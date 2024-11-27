import React from "react";
import Image from "next/image";

const WorkCard = ({ img, name, description, onClick, url }) => {
  return (
    <div
      className={`${
        url !== "" && `hover:scale-105`
      } dark-mode justify-between gap-2 flex flex-col overflow-hidden rounded-xl p-5 first:ml-0 link transition-all ease-out duration-500 bg-zinc-100	`}
      onClick={onClick}
    >
      <div
        className="relative rounded-lg overflow-hidden transition-all ease-out duration-300 mob:h-auto"
        // style={{ height: "auto" }}
      >
                <h1 className="text-3xl font-medium mb-2 align-middle">
          {name ? name : "Project Name"}
        </h1>
        <Image
          width={540} 
          height={300}
          // objectFit='contain'
          // width={0}
          // height={0}
          // sizes="100%"
          alt={name}
          className="rh-full w-full object-cover"
          src={img}
        ></Image>
      </div>

      <div className="flex items-center arrange-card">
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
