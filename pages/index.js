import { useRef } from "react";
import Header from "../components/Header";
import ServiceCard from "../components/ServiceCard";
import Socials from "../components/Socials";
import WorkCard from "../components/WorkCard";
import { useIsomorphicLayoutEffect } from "../utils";
import { stagger } from "../animations";
import Footer from "../components/Footer";
import Head from "next/head";
import Button from "../components/Button";
import Link from "next/link";
import Cursor from "../components/Cursor";
import CustomAlert from "../components/CustomAlert";

// Local Data
import data from "../data/portfolio.json";

export default function Home() {
  // Ref
  const workRef = useRef();
  const contactRef = useRef();
  const textOne = useRef();
  const textTwo = useRef();
  const textThree = useRef();
  const textFour = useRef();

  // Handling Scroll
  const handleWorkScroll = () => {
    window.scrollTo({
      top: workRef.current.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleContactScroll = () => {
    window.scrollTo({
      top: contactRef.current.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  useIsomorphicLayoutEffect(() => {
    stagger(
      [textOne.current, textTwo.current, textThree.current, textFour.current],
      { y: 40, x: -10, transform: "scale(0.95) skew(10deg)" },
      { y: 0, x: 0, transform: "scale(1)" }
    );
  }, []);

  return (
    <div className={`relative ${data.showCursor && "cursor-none"}`}>
      {data.showCursor && <Cursor />}
      <Head>
        <title>Projects by Tomas Lawton</title>
      </Head>

      <div id="main-view" className="container mx-auto mb-10">
        <CustomAlert handleContactScroll={handleContactScroll} />

        <Header
          handleWorkScroll={handleWorkScroll}
          handleContactScroll={handleContactScroll}
        />
        <div className="laptop:mt-20 mt-10 p-2 tablet:p-2 laptop:p-0">
          <div className="mt-5">
            <h1
              ref={textOne}
              className="text-center text-3xl tablet:text-5xl laptop:text-7xl pt-1 tablet:pt-2 font-bold w-full"
            >
              {data.headerTaglineOne}
            </h1>
            <h1
              ref={textTwo}
              className="text-center text-3xl tablet:text-5xl laptop:text-7xl pt-1 tablet:pt-2 font-bold w-full"
            >
              {data.headerTaglineTwo}
            </h1>
            <h1
              ref={textThree}
              className="text-center text-3xl tablet:text-5xl laptop:text-7xl pt-1 tablet:pt-2 font-bold w-full"
            >
              {data.headerTaglineThree}
            </h1>
          </div>

          <Socials className="mt-6 laptop:mt-5" />
        </div>
        <div className="mt-10 laptop:mt-30 p-2 laptop:p-0" ref={workRef}>
          <h1 className="text-3xl tablet:text-5xl font-medium text-bold my-10">
            Projects
          </h1>
          <h1 className="text-2xl text-slate-600 mt-2">
            From concept to code, each project was crafted by me.
          </h1>

          <div className="mt-5 laptop:mt-10 grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-4">
            {data.projects.map((project) => (
              <WorkCard
                key={project.id}
                img={project.imageSrc}
                name={project.title}
                description={project.description}
                onClick={() => project.url !== "" && window.open(project.url)}
                url={project.url}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 laptop:mt-30 p-2 laptop:p-0">
          <h1 className="text-3xl tablet:text-5xl font-medium text-bold my-10">
            Services
          </h1>
          <div className="grid grid-cols-1 laptop:grid-cols-2 gap-6 bg-slate-100 tablet:p-12 laptop:p-12 rounded-lg">
            {data.services.map((service, index) => (
              <ServiceCard
                key={index}
                name={service.title}
                description={service.description}
              />
            ))}
          </div>
        </div>
        {/* This button should not go into production */}
        {process.env.NODE_ENV === "development" && (
          <div className="fixed bottom-5 right-5">
            <Link href="/edit">
              <Button type="primary">Edit Data</Button>
            </Link>
          </div>
        )}
        <div className="mt-10 laptop:mt-40 p-2 laptop:p-0" ref={contactRef}>
          <h1 className="text-3xl tablet:text-5xl font-medium text-bold my-10">
            Let&apos;s work together!
          </h1>
          <p className="mt-2 text-2xl w-full opacity-50">{data.aboutpara}</p>
        </div>

        <div className="mt-10 laptop:mt-12 p-2 tablet:p-2 laptop:p-0">
          <Footer />
        </div>
      </div>
    </div>
  );
}
