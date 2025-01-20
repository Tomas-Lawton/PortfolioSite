import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const ServiceCard = ({ name1, name2, description }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState();

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div
      className={`w-full p-5 rounded-lg transition-all ease-out duration-300 ${
        mounted && theme === "dark" ? "hover:bg-slate-800" : "dark-mode"
      } tablet:hover:-translate-y-2 link`}
    >
      <h1 className="text-4xl">{name1 ? name1 : "Heading"}</h1>
      <h1 className="text-3xl mt-3">{name2 ? name2 : "Heading"}</h1>
      <p className="mt-5 opacity-80 text-xl">
        {description
          ? description
          : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "}
      </p>
    </div>
  );
};

export default ServiceCard;
