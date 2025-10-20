import { useRef, useEffect, useState } from "react";
import Header from "../../components/Header";
import ServiceCard from "../../components/ServiceCard";
import Socials from "../../components/Socials";
import WorkCard from "../../components/WorkCard";
import { stagger } from "../../animations";
import Footer from "../../components/Footer";
import Head from "next/head";
import * as THREE from "three";
import ScrambleText from "scramble-text";
import data from "../../data/portfolio.json";

import { LogoLinkedin, LogoGithub, LogoGoogle } from "react-ionicons";

export default function LandingPage({ showFullWindow }) {
  const bodyRef = useRef();
  const workRef = useRef();
  const servicesRef = useRef();
  const contactRef = useRef();
  const textOn = useRef();
  const textOne = useRef();
  const textTwo = useRef();
  const textThree = useRef();
  const innerCanvas = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [currentTime, setCurrentTime] = useState("");

  const handleScroll = (targetRef) => {
    if (bodyRef.current && targetRef.current) {
      bodyRef.current.scrollTo({
        top: targetRef.current.offsetTop,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  const scrollToTop = () => {
    if (bodyRef.current) {
      bodyRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  const handleWorkScroll = () => handleScroll(workRef);
  const handleServicesScroll = () => handleScroll(servicesRef);
  const handleContactScroll = () => handleScroll(contactRef);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScrollProgress = () => {
      if (bodyRef.current) {
        const scrollTop = bodyRef.current.scrollTop;
        const scrollHeight =
          bodyRef.current.scrollHeight - bodyRef.current.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        setScrollProgress(progress);

        const sections = [
          { ref: workRef, id: "work" },
          { ref: servicesRef, id: "services" },
          { ref: contactRef, id: "contact" },
        ];

        const newVisible = {};
        sections.forEach(({ ref, id }) => {
          if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            newVisible[id] = rect.top < window.innerHeight * 0.75;
          }
        });

        setIsVisible(newVisible);
      }
    };

    const currentBody = bodyRef.current;
    if (currentBody) {
      currentBody.addEventListener("scroll", handleScrollProgress);
      handleScrollProgress();
    }

    return () => {
      if (currentBody) {
        currentBody.removeEventListener("scroll", handleScrollProgress);
      }
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth > 768) {
      const element = textOne.current;
      if (element && !element.hasAttribute("data-scrambled")) {
        element.setAttribute("data-scrambled", "true");
        const scrambleInstance = new ScrambleText(element);

        stagger(
          [textOn.current, textOne.current, textTwo.current, textThree.current],
          { y: 40, x: -10, transform: "scale(0.95) skew(10deg)" },
          { y: 0, x: 0, transform: "scale(1)" },
          () => scrambleInstance.start()
        );
      }
    }
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 400) {
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const canvas = innerCanvas.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const geometries = [
      new THREE.TorusKnotGeometry(0.8, 0.3, 130, 12, 2, 1),
      new THREE.TorusKnotGeometry(0.8, 0.3, 130, 12, 2, 3),
      new THREE.TorusKnotGeometry(0.8, 0.3, 130, 12, 2, 4),
      new THREE.TorusKnotGeometry(0.8, 0.3, 130, 12, 2, 6),
    ];

    const material = new THREE.ShaderMaterial({
      uniforms: {
        baseColor: { value: new THREE.Color(0x7fff00) },
        secondaryColor: { value: new THREE.Color(0x0000ff) },
        time: { value: 0 },
        resolution: { value: new THREE.Vector2() },
        mouseIntensity: { value: 0.0 },
      },
      vertexShader: `
        uniform float time;
        uniform float mouseIntensity;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
  
        void main() {
          vUv = uv;
          vNormal = normal;
          float displacement = sin(position.x * 5.0 + time) * 
                               sin(position.y * 5.0 + time) * 
                               sin(position.z * 5.0 + time) * 
                               (0.1 + mouseIntensity * 0.2);
          vec3 newPosition = position + normal * displacement;
          vPosition = newPosition;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float mouseIntensity;
        uniform vec2 resolution;
        uniform vec3 baseColor;
        uniform vec3 secondaryColor;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
  
        vec3 plasma(vec2 uv, float time) {
          vec2 p = -1.0 + 2.0 * uv;
          float t = time * 0.2;
          float cx = p.x + 0.5 * sin(t * 0.7);
          float cy = p.y + 0.5 * cos(t * 0.3);
          float v1 = sin(cx * 10.0 + t);
          float v2 = cos(cy * 8.0 + t * 1.2);
          float v3 = sin((cx + cy + t) * 5.0);
          float intensity = sin(v1 + v2 + v3) * 0.5 + 0.5;
          return mix(baseColor, secondaryColor, intensity);
        }
  
        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(-vPosition);
          vec3 plasmaColor = plasma(vUv, time + mouseIntensity);
          float depth = length(vPosition) / 2.0;
          plasmaColor *= 1.0 - depth * 0.5;
          float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
          plasmaColor += vec3(1.0) * fresnel * 0.5;
          vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
          vec3 halfwayDir = normalize(lightDir + viewDir);
          float spec = pow(max(dot(normal, halfwayDir), 0.0), 32.0);
          plasmaColor += vec3(1.0) * spec * 0.5;
          gl_FragColor = vec4(plasmaColor, 1.0);
        }
      `,
    });

    let currentShape = null;

    function createShape() {
      let num = Math.floor(Math.random() * geometries.length);
      const geometry = geometries[num];
      const shape = new THREE.Mesh(geometry, material);
      const wireframe = new THREE.WireframeGeometry(geometry);
      const line = new THREE.LineSegments(wireframe);
      line.material.depthTest = false;
      line.material.opacity = 0.1;
      line.material.transparent = true;
      shape.add(line);

      shape.castShadow = true;
      shape.receiveShadow = false;
      scene.add(shape);
      shape.position.set(0, 0.3, 0);
      return shape;
    }

    const ambientLight = new THREE.AmbientLight(0xededed, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    scene.add(directionalLight);
    directionalLight.position.set(4, 20, -1);
    directionalLight.castShadow = true;

    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    ground.receiveShadow = true;
    scene.add(ground);

    if (!currentShape) {
      currentShape = createShape();
    }
    camera.position.z = 3;

    let targetIntensity = 0;
    let currentIntensity = 0;

    let prevMouseX = null;
    let prevMouseY = null;
    const strength = 1.2;

    document.addEventListener("mousemove", (event) => {
      const currentMouseX = event.clientX / window.innerWidth;
      const currentMouseY = event.clientY / window.innerHeight;

      if (prevMouseX !== null && prevMouseY !== null && currentShape) {
        const deltaX = currentMouseX - prevMouseX;
        const deltaY = currentMouseY - prevMouseY;

        currentShape.rotation.y += deltaX * Math.PI * strength;
        currentShape.rotation.x += deltaY * Math.PI * strength;
      }

      prevMouseX = currentMouseX;
      prevMouseY = currentMouseY;
    });

    document.addEventListener("mousedown", () => {
      targetIntensity = 5;
    });
    document.addEventListener("mouseup", () => {
      targetIntensity = 0.0;
    });
    document.addEventListener("mouseleave", () => {
      targetIntensity = 0.0;
    });

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.resolution.value.set(
        window.innerWidth,
        window.innerHeight
      );
    }

    window.addEventListener("resize", onWindowResize);
    onWindowResize();

    function animate() {
      requestAnimationFrame(animate);

      if (currentShape) {
        currentShape.rotation.y += 0.015;
        currentShape.rotation.x += 0.015;
      }

      currentIntensity += (targetIntensity - currentIntensity) * 0.05;
      material.uniforms.mouseIntensity.value = currentIntensity;
      material.uniforms.time.value += 0.05;
      renderer.render(scene, camera);
    }

    animate();

    return () => {
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      className={`gradient-background h-full relative ${
        data.showCursor && "cursor-none"
      }`}
    >
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-section {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .fade-in-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(127, 255, 0, 0.7);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(127, 255, 0, 0);
          }
        }

        .status-indicator {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #7fff00;
          border-radius: 50%;
          margin-right: 8px;
          animation: pulse-dot 2s infinite;
        }

        @keyframes pulse-dot {
          0%,
          100% {
            opacity: 1;
            box-shadow: 0 0 8px #7fff00;
          }
          50% {
            opacity: 0.6;
            box-shadow: 0 0 4px #7fff00;
          }
        }

        .card-glow {
          position: relative;
          overflow: hidden;
        }

        .card-glow::before {
          content: "";
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(127, 255, 0, 0.1),
            transparent
          );
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .card-glow:hover::before {
          opacity: 1;
        }

        .noise-bg {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.025'/%3E%3C/svg%3E");
          background-size: 250px 250px;
          will-change: transform;
        }

        .gradient-background {
          background: linear-gradient(
            135deg,
            #000000 0%,
            #0a0a0a 50%,
            #000000 100%
          );
        }
      `}</style>

      <div className="scanlines"></div>
      <div className="noise-bg fixed inset-0 pointer-events-none z-50"></div>

      <Head>
        <title>Tomas Lawton - Where Chaos Meets Code</title>
        <meta
          name="description"
          content="AI Specialist & Creative Technologist crafting intelligent human-centric experiences through design and code"
        />
        <meta
          property="og:title"
          content="Tomas Lawton - Where Chaos Meets Code"
        />
        <meta
          property="og:description"
          content="Portfolio of an AI Specialist & Creative Technologist"
        />
      </Head>

      <div className="h-full intro-wrap mx-auto relative z-1" ref={bodyRef}>
        <Header
          handleContactScroll={handleContactScroll}
          showFullWindow={showFullWindow}
          scrollToTop={scrollToTop}
          scrollProgress={scrollProgress}
          bodyRef={bodyRef}
        />

        <div className="absolute -z-10 top-0 right-0 tablet:w-10/12 overflow-hidden">
          <canvas ref={innerCanvas}></canvas>
        </div>
        <section
          className={`${
            showFullWindow ? "h-screen" : "h-full"
          } justify-center tablet:justify-start flex flex-col z-1 relative py-8 tablet:py-12`}
        >
          <div className="absolute top-4 tablet:top-6 left-1/2 transform -translate-x-1/2 text-[#7fff00] font-mono opacity-70 hidden tablet:flex items-center bg-black/40 backdrop-blur-sm px-3 tablet:px-5 py-2 tablet:py-2.5 rounded-full border border-[#7fff00]/30 shadow-lg shadow-[#7fff00]/5">
            <span className="status-indicator"></span>
            <span className="text-[0.625rem] tablet:text-xs tracking-widest">
              SYSTEM TIME: {currentTime}
            </span>
            <span className="mx-2 tablet:mx-3 opacity-50">•</span>
            <span className="text-[0.625rem] tablet:text-xs tracking-widest">
              STATUS: ONLINE
            </span>
          </div>

          <div className="absolute bottom-4 tablet:bottom-16 right-0 text-white rounded-lg hidden mob:block border border-[#7fff00]/30 hover:border-[#7fff00]/50 transition-all duration-300 bg-black/40 backdrop-blur-sm shadow-lg shadow-[#7fff00]/5 px-3 py-2.5 tablet:px-5 tablet:py-3.5">
            <div className="text-[0.563rem] tablet:text-[0.625rem] opacity-50 mb-1 tablet:mb-1.5 font-mono tracking-widest uppercase">
              Last Updated
            </div>
            <h2 className="text-sm tablet:text-base font-semibold tracking-tight mb-0.5">
              Jan 22, 2025
            </h2>
            <p className="text-[0.688rem] tablet:text-xs opacity-70 font-medium">
              Tomas Lawton
            </p>
          </div>

          <div className="absolute bottom-4 tablet:bottom-16 hidden tablet:flex gap-2 tablet:gap-4 text-white flex-col tablet:flex-row">
            <button
              className="group flex items-center rounded-lg px-3 py-2.5 tablet:px-5 tablet:py-3.5 cursor-pointer border border-[#7fff00]/30 hover:border-[#7fff00]/80 hover:bg-[#7fff00]/5 transition-all duration-300 bg-black/40 backdrop-blur-sm shadow-lg shadow-[#7fff00]/5"
              onClick={handleWorkScroll}
            >
              <span className="text-[0.563rem] tablet:text-[0.625rem] opacity-50 font-mono tracking-widest group-hover:opacity-70 transition-opacity mr-2">
                01
              </span>
              <span className="text-xs tablet:text-sm font-semibold tracking-wide">
                PROJECTS
              </span>
            </button>

            <button
              className="group flex items-center rounded-lg px-3 py-2.5 tablet:px-5 tablet:py-3.5 cursor-pointer border border-[#7fff00]/30 hover:border-[#7fff00]/80 hover:bg-[#7fff00]/5 transition-all duration-300 bg-black/40 backdrop-blur-sm shadow-lg shadow-[#7fff00]/5"
              onClick={handleServicesScroll}
            >
              <span className="text-[0.563rem] tablet:text-[0.625rem] opacity-50 font-mono tracking-widest group-hover:opacity-70 transition-opacity mr-2">
                02
              </span>
              <span className="text-xs tablet:text-sm font-semibold tracking-wide">
                SERVICES
              </span>
            </button>

            <button
              className="group flex items-center rounded-lg px-3 py-2.5 tablet:px-5 tablet:py-3.5 cursor-pointer border border-[#7fff00]/30 hover:border-[#7fff00]/80 hover:bg-[#7fff00]/5 transition-all duration-300 bg-black/40 backdrop-blur-sm shadow-lg shadow-[#7fff00]/5"
              onClick={handleContactScroll}
            >
              <span className="text-[0.563rem] tablet:text-[0.625rem] opacity-50 font-mono tracking-widest group-hover:opacity-70 transition-opacity mr-2">
                03
              </span>
              <span className="text-xs tablet:text-sm font-semibold tracking-wide">
                CONTACT
              </span>
            </button>
          </div>

          <div className="tablet:mt-32 laptop:mt-44 px-4 tablet:px-6 laptop:px-0 max-w-6xl mx-auto tablet:mx-0 w-full">
            <div className="inline-block mb-4 tablet:mb-6 px-3 tablet:px-4 py-1 tablet:py-1.5 border border-[#7fff00]/50 rounded-full text-[#7fff00] font-mono tracking-widest">
              <span>&lt;/&gt; PORTFOLIO v2.0</span>
            </div>

            <h1
              ref={textOn}
              className="hero-font text-center tablet:text-left text-4xl mob:text-5xl tablet:text-6xl laptop:text-7xl desktop:text-8xl font-bold w-full mb-1 tablet:mb-2"
              style={{ lineHeight: "1.1", letterSpacing: "-0.02em" }}
            >
              {data.headerTaglineOne}
            </h1>

            <h1
              ref={textOne}
              className="hero-font text-center tablet:text-left text-4xl mob:text-5xl tablet:text-6xl laptop:text-7xl desktop:text-8xl font-bold w-full mb-6 tablet:mb-8"
              style={{ lineHeight: "1.1", letterSpacing: "-0.02em" }}
            >
              {data.headerTaglineOnea}
            </h1>

            <h2
              ref={textTwo}
              className="text-center tablet:text-left text-lg mob:text-xl tablet:text-2xl laptop:text-3xl font-medium w-full text-white/90"
              style={{ lineHeight: "1.4", letterSpacing: "0.01em" }}
            >
              AI Development & Creative Technology
            </h2>

            <p
              className="text-center tablet:text-left text-sm mob:text-base tablet:text-lg laptop:text-xl mt-3 tablet:mt-4 text-white/90 font-normal max-w-3xl mx-auto tablet:mx-0"
              style={{ lineHeight: "1.6" }}
            >
              Building intelligent systems at the intersection of design and
              code
            </p>
          </div>

          <Socials
            className="mt-8 tablet:mt-10 px-4 tablet:px-6 laptop:px-0"
            handleContactScroll={handleContactScroll}
          />
        </section>
        <section
          className={`mb-10 laptop:mb-30 p-4 laptop:p-0 fade-in-section ${
            isVisible.work ? "visible" : ""
          }`}
          ref={workRef}
        >
          <div className="flex items-center gap-4 mb-10 relative">
            <span className="text-[#7fff00] text-2xl font-bold font-mono">
              01
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-[#7fff00] to-transparent"></div>
          </div>

          <h1 className="hero-font text-center tablet:text-left text-3xl tablet:text-5xl font-bold mb-6 tracking-tight">
            Featured Projects
          </h1>
          <p className="text-xl text-center tablet:text-left mt-2 opacity-90 leading-relaxed max-w-4xl">
            Building at the intersection of{" "}
            <span className="font-semibold text-[#7fff00]">
              artificial intelligence
            </span>{" "}
            and{" "}
            <span className="font-semibold text-[#7fff00]">
              human experience
            </span>
            . Every project represents a journey from abstract concept to
            tangible impact—architected, designed, and engineered end-to-end
            with obsessive attention to craft.
          </p>

          <div className="mt-8 laptop:mt-12 grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-8">
            {data.projects.map((project, index) => (
              <div
                key={project.id}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
              >
                <WorkCard
                  img={project.imageSrc}
                  name={project.title}
                  description={project.description}
                  onClick={() => project.url && window.open(project.url)}
                  url={project.url}
                />
              </div>
            ))}
          </div>
        </section>

        <section
          className={`mt-10 laptop:mt-30 p-4 laptop:p-0 fade-in-section ${
            isVisible.services ? "visible" : ""
          }`}
          ref={servicesRef}
        >
          <div className="flex items-center gap-4 mb-10 mt-44">
            <span className="text-[#7fff00] text-2xl font-bold font-mono">
              02
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-[#7fff00] to-transparent"></div>
          </div>
          <h1 className="hero-font text-center tablet:text-left text-3xl tablet:text-5xl font-bold mb-6 tracking-tight">
            Services & Capabilities
          </h1>
          <p className="text-xl text-center tablet:text-left mt-2 opacity-90 leading-relaxed max-w-4xl">
            Full-stack expertise spanning{" "}
            <span className="font-semibold text-[#7fff00]">AI systems</span>,
            <span className="font-semibold text-[#7fff00]">
              {" "}
              product design
            </span>
            , and{" "}
            <span className="font-semibold text-[#7fff00]">
              interactive experiences
            </span>
            . Specializing in bringing ambitious ideas to life through rapid
            prototyping, strategic architecture, and production-grade
            implementation.
          </p>
          <div className="grid dark-mode mt-8 laptop:mt-12 grid-cols-1 laptop:grid-cols-2 gap-6 transition-all ease-out duration-300 tablet:p-12 laptop:p-12 rounded-lg p-2">
            {data.services.map((service, index) => (
              <div
                key={index}
                style={{ animationDelay: `${index * 0.15}s` }}
                className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
              >
                <ServiceCard
                  name1={service.title}
                  name2={service.title1}
                  description={service.description}
                />
              </div>
            ))}
          </div>
        </section>

        <section
          ref={contactRef}
          className={`p-4 tablet:p-2 laptop:p-0 mb-44 fade-in-section ${
            isVisible.contact ? "visible" : ""
          }`}
        >
          <div className="flex items-center gap-4 mb-10 mt-44">
            <span className="text-[#7fff00] text-2xl font-bold font-mono">
              03
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-[#7fff00] to-transparent"></div>
          </div>
          <h1 className="hero-font text-center tablet:text-left text-3xl tablet:text-5xl font-bold mb-6 tracking-tight">
            Let's Build Together
          </h1>
          <p className="text-xl text-center tablet:text-left mt-2 opacity-90 leading-relaxed max-w-4xl mb-8">
            Working on something ambitious? Whether it's an AI integration, a
            creative prototype, or a full product vision—let's explore how we
            can collaborate.
          </p>
          <Footer />
        </section>

        <hr className="custom-hr opacity-50" />
        <div className="text-center py-10 my-12">
          <p className="text-sm mb-2 font-mono tracking-wide">
            © 2025 Tomas Lawton • Crafted with chaos & code
          </p>
          <p className="text-xs">
            Interactive 3D experience available on desktop • Optimized for
            Chrome/Firefox
          </p>

          <ul className="flex justify-center gap-6 list-none mt-6">
            <li>
              <a
                href="https://www.linkedin.com/in/tomas-lawton-512066199/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white transition"
              >
                <LogoLinkedin width="24px" height="24px" color="#ffffff" />
              </a>
            </li>
            <li>
              <a
                href="https://scholar.google.com/citations?hl=en&user=OeCxMCgAAAAJ"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-600 text-white transition"
              >
                <LogoGoogle width="24px" height="24px" color="#ffffff" />
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Tomas-Lawton"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 text-white transition"
              >
                <LogoGithub width="24px" height="24px" color="#ffffff" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
