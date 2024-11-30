import { useRef, useEffect } from "react";
import Header from "../components/Header";
import ServiceCard from "../components/ServiceCard";
import Socials from "../components/Socials";
import WorkCard from "../components/WorkCard";
import { useIsomorphicLayoutEffect } from "../utils";
import { scramble } from "../animations";
import Footer from "../components/Footer";
import Head from "next/head";
import Button from "../components/Button";
import Link from "next/link";
import Cursor from "../components/Cursor";
// import CustomAlert from "../components/CustomAlert";
import * as THREE from "three";

// Local Data
import data from "../data/portfolio.json";

export default function Home() {
  // Ref
  const workRef = useRef();
  const contactRef = useRef();
  const textOne = useRef();
  const textTwo = useRef();
  const textThree = useRef();
  const canvasRef = useRef(null);

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

  useEffect(() => {
    scramble(textOne.current);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Cube geometry
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on component unmount
    return () => {
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative ${data.showCursor && "cursor-none"}`}>
      {data.showCursor && <Cursor />}
      <Head>
        <title>Projects by Tomas Lawton</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Exo+2:ital,wght@0,100..900;1,100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lexend+Mega:wght@100..900&family=Reenie+Beanie&family=Sixtyfour+Convergence&family=Tektur:wght@400..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        ></link>
      </Head>

      <canvas id="three-canvas" className="absolute z-0 top-0 left-0" ref={canvasRef}></canvas>

      <Header
        handleWorkScroll={handleWorkScroll}
        handleContactScroll={handleContactScroll}
      />


      <div className="scanlines"></div>
      <div className="intro-wrap container mx-auto relative z-1 pb-10 z-1">
        {/* <CustomAlert handleContactScroll={handleContactScroll} /> */}

        <div className="h-screen flex flex-col justify-center z-1">
          <div>
            <h1
              ref={textOne}
              // id="scramble"
              // id="text1"
              className="hero-font text-center tablet:text-left text-4xl tablet:text-6xl laptop:text-8xl pt-1 tablet:pt-2 font-bold w-full"
            >
              {data.headerTaglineOne}
            </h1>
            <h1
              ref={textTwo}
              className="text-center tablet:text-left text-2xl mob:text-2xl tablet:text-4xl laptop:text-6xl pt-1 tablet:pt-2 font-medium w-full"
            >
              {data.headerTaglineTwo}
            </h1>
            <h1
              ref={textThree}
              className="text-center tablet:text-left text-2xl mob:text-2xl tablet:text-4xl laptop:text-6xl pt-1 tablet:pt-2 font-medium w-full"
            >
              {data.headerTaglineThree}
            </h1>
          </div>

          <Socials className="mt-5" handleContactScroll={handleContactScroll} />
        </div>
        <div className="mb-10 laptop:mb-30 p-2 laptop:p-0" ref={workRef}>
          <h1 className="hero-font text-center tablet:text-left text-3xl tablet:text-5xl font-bold text-bold mb-10">
            Projects
          </h1>
          <h1 className="text-2xl text-center tablet:text-left mt-2">
            As an <span className="font-bold">AI Specialist</span> by day and{" "}
            <span className="font-bold">Creative Technologist</span> by night, I
            generate concepts and architect systems from start to finish. Each
            project below was hand-crafted by me from initial concept to the
            polished product.
          </h1>

          <div className="mt-5 laptop:mt-10 grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-2 gap-4">
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
          <h1 className="hero-font text-center tablet:text-left text-3xl tablet:text-5xl font-bold text-bold my-10">
            Services
          </h1>
          <h1 className="text-2xl text-center tablet:text-left mt-2">
            A specialise in end-to-end development, product design, and creative
            prototype research.
          </h1>
          <div className="grid dark-mode mt-5 laptop:mt-10 grid-cols-1 laptop:grid-cols-2 gap-6 bg-slate-100 tablet:p-12 laptop:p-12 rounded-lg">
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
        {/* <div className="mt-10 laptop:mt-40 p-2 laptop:p-0" ref={contactRef}>
          <h1 className="text-3xl tablet:text-5xl font-medium text-bold my-10">
            Let&apos;s work together!
          </h1>
          <p className="mt-2 text-2xl w-full opacity-50">{data.aboutpara}</p>
        </div> */}

        <div ref={contactRef} className="p-2 tablet:p-2 laptop:p-0">
          <h1 className="hero-font text-center tablet:text-left text-3xl tablet:text-5xl font-bold text-bold my-10">
            Contact
          </h1>
          <h1 className="text-2xl text-center tablet:text-left mt-2">
            I blend creative technologies, generative AI, and end-to-end product
            design to craft intelligent human-centric experiences.
          </h1>
          <Footer />
        </div>

        <hr className="custom-hr my-10" />
        <p className="text-center opacity-70">
          This site was coded by Tommy and hosted for free on Netlify {":)"}.
        </p>
      </div>
    </div>
  );
}
