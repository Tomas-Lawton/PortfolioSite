import React from "react";
import Image from "next/image";

const WorkCard = ({ img, name, description, onClick, url }) => {
  return (
    <div
      className={`${
        url !== "" && `hover:-translate-y-2`
      } dark-mode justify-between gap-2 flex flex-col overflow-hidden rounded-xl p-5 first:ml-0 link transition-all ease-out duration-300 bg-zinc-100 group`}
    >
      <h1 className="text-3xl font-medium mb-2 align-middle text-center mv-4">
        {name ? name : "Project Name"}
      </h1>

      <div className="relative rounded-lg overflow-hidden transition-all ease-out duration-300 mob:h-auto">
        <Image
          width={540}
          height={300}
          alt={name}
          className="rounded-md w-full object-cover"
          src={img}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-70 transition-opacity duration-300 ease-out group-hover:opacity-0"></div>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          height="24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="w-16 h-16 bg-gradient-to-br from-lime-400 to-green-500 rounded-full p-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-100 transition-opacity duration-300 ease-out group-hover:opacity-0"
        >
          <path
            d="m8.032 12 1.984 1.984 4.96-4.96m4.55 5.272.893-.893a1.984 1.984 0 0 0 0-2.806l-.893-.893a1.984 1.984 0 0 1-.581-1.403V7.04a1.984 1.984 0 0 0-1.984-1.984h-1.262a1.983 1.983 0 0 1-1.403-.581l-.893-.893a1.984 1.984 0 0 0-2.806 0l-.893.893a1.984 1.984 0 0 1-1.403.581H7.04A1.984 1.984 0 0 0 5.055 7.04v1.262c0 .527-.209 1.031-.581 1.403l-.893.893a1.984 1.984 0 0 0 0 2.806l.893.893c.372.372.581.876.581 1.403v1.262a1.984 1.984 0 0 0 1.984 1.984h1.262c.527 0 1.031.209 1.403.581l.893.893a1.984 1.984 0 0 0 2.806 0l.893-.893a1.985 1.985 0 0 1 1.403-.581h1.262a1.984 1.984 0 0 0 1.984-1.984V15.7c0-.527.209-1.031.581-1.403Z"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            stroke="currentColor"
          ></path>
        </svg>
      </div>

      <div className="flex items-center arrange-card">
        <p className="text-xl text-center tablet:text-left mt-2 opacity-90 leading-relaxed max-w-4xl">{description ? description : "Description"}</p>
        {url !== "" && (
          <button
            onClick={onClick}
            src={`/images/link.svg`}
            alt="link-icon"
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-white rounded-lg group bg-gradient-to-br from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 dark:focus:ring-green-800 focus:ring-4 focus:outline-none focus:ring-green-300"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 dark:bg-gray-900 rounded-md hover:bg-opacity-0">
              View Project
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default WorkCard;
