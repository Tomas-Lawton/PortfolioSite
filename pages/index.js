import { useRef, useEffect } from "react";
import Header from "../components/Header";
import ServiceCard from "../components/ServiceCard";
import Socials from "../components/Socials";
import WorkCard from "../components/WorkCard";
// import { useIsomorphicLayoutEffect } from "../utils";
import { stagger } from "../animations";
import Footer from "../components/Footer";
import Head from "next/head";
import Button from "../components/Button";
import Link from "next/link";
import Cursor from "../components/Cursor";
// import CustomAlert from "../components/CustomAlert";
import * as THREE from "three";
import ScrambleText from "scramble-text";

// Local Data
import data from "../data/portfolio.json";

export default function Home() {
  // Ref
  const workRef = useRef();
  const contactRef = useRef();
  const textOn = useRef();
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
    const element = textOne.current;
    if (element && !element.hasAttribute("data-scrambled")) {
      element.setAttribute("data-scrambled", "true"); // Mark as scrambled
      const scrambleInstance = new ScrambleText(element);

      stagger(
        [textOn.current, textOne.current, textTwo.current, textThree.current],
        { y: 40, x: -10, transform: "scale(0.95) skew(10deg)" },
        { y: 0, x: 0, transform: "scale(1)" },
        () => scrambleInstance.start()
      );
    }
  }, []);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true, // Transparent background
    });
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const geometries = [
      // new THREE.IcosahedronGeometry(1, 0),
      // new THREE.TorusGeometry( 1, 0.4, 12, 48 ),
      // new THREE.SphereGeometry(1, 16, 16),
      new THREE.TorusKnotGeometry(10, 0.4, 64, 8),
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

    function createShape() {
      const geometry =
        geometries[Math.floor(Math.random() * geometries.length)];
      const shape = new THREE.Mesh(geometry, material);
      const wireframe = new THREE.WireframeGeometry(geometry);
      // const shape2 = new THREE.Mesh(wireframe, material);
      const line = new THREE.LineSegments(wireframe);
      line.material.depthTest = false;
      line.material.opacity = 0.2;
      line.material.transparent = true;
      // shape.position.set(1.6, 0, 0);
      shape.add(line);
      scene.add(shape);
      return shape;
    }

    const shape = createShape();
    camera.position.z = 3;

    let targetIntensity = 0;
    let currentIntensity = 0;
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    document.addEventListener("mousemove", (event) => {
      mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
      shape.rotation.y = -(event.clientX / window.innerWidth) * 2 - 1 * Math.PI;
      shape.rotation.x =
        -(event.clientY / window.innerHeight) * 2 + 1 * Math.PI;
    });

    document.addEventListener("mousedown", () => {
      targetIntensity = 5;
    });
    document.addEventListener("mouseup", () => {
      targetIntensity = 0.0;
    });
    document.addEventListener("mouseleave", () => {
      targetIntensity = 0.0;
      mouse.targetX = 0;
      mouse.targetY = 0;
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

      shape.rotation.y += 0.001;
      shape.rotation.x += 0.001;
      // shape.rotation.y += (mouse.targetX - shape.rotation.y / Math.PI) * 0.1;
      // shape.rotation.x += (mouse.targetY - shape.rotation.x / Math.PI) * 0.1;

      currentIntensity += (targetIntensity - currentIntensity) * 0.01;
      material.uniforms.mouseIntensity.value = currentIntensity;
      material.uniforms.time.value += 0.05;
      renderer.render(scene, camera);
    }

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
        <title>Where Chaos, Meets Code</title>
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

      <canvas className="absolute z-0 top-0 right-0" ref={canvasRef}></canvas>

      <Header
        handleWorkScroll={handleWorkScroll}
        handleContactScroll={handleContactScroll}
      />

      <div className="scanlines"></div>
      <div className="intro-wrap container mx-auto relative z-1">
        {/* <CustomAlert handleContactScroll={handleContactScroll} /> */}

        <div className="h-screen flex flex-col z-1 relative">
          <div class="absolute bottom-9 right-0 p-4 bg-black text-white rounded-lg shadow-lg ">
            <h2>LAST</h2>
            <h2>UPDATED</h2>
            <hr className="p-1" />
            <h2 className="text-xs">30.11.24</h2>
            <p className="text-xs ">BY TOMMY</p>
          </div>
          <div className="mt-52">
            <h1
              ref={textOn}
              className="hero-font text-center tablet:text-left text-4xl tablet:text-6xl laptop:text-8xl pt-1 tablet:pt-2 font-bold w-full"
            >
              {data.headerTaglineOne}
            </h1>
            <h1
              ref={textOne}
              className="hero-font text-center tablet:text-left text-4xl tablet:text-6xl laptop:text-8xl pt-1 tablet:pt-2 font-bold w-full"
            >
              {data.headerTaglineOnea}
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
        {/* {process.env.NODE_ENV === "development" && (
          <div className="fixed bottom-5 right-5">
            <Link href="/edit">
              <Button type="primary">Edit Data</Button>
            </Link>
          </div>
        )} */}
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
