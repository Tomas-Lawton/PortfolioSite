import { useRef, useEffect } from "react";
import Header from "../../components/Header";
import ServiceCard from "../../components/ServiceCard";
import Socials from "../../components/Socials";
import WorkCard from "../../components/WorkCard";
import { stagger } from "../../animations";
import Footer from "../../components/Footer";
import Head from "next/head";
import * as THREE from "three";
import ScrambleText from "scramble-text";

// Local Data
import data from "../../data/portfolio.json";

export default function LandingPage({ showFullWindow }) {
  // Ref
  const bodyRef = useRef();

  const workRef = useRef();
  const servicesRef = useRef();
  const contactRef = useRef();
  const textOn = useRef();
  const textOne = useRef();
  const textTwo = useRef();
  const textThree = useRef();
  const innerCanvas = useRef(null);
  // Handling Scroll
  const handleScroll = (targetRef) => {
    console.log(targetRef.current ? targetRef.current.id : "no target");
    if (bodyRef.current && targetRef.current) {
      bodyRef.current.scrollTo({
        top: targetRef.current.offsetTop,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  // Usage examples
  const handleWorkScroll = () => {
    console.log("work");
    handleScroll(workRef);
  };

  const handleServicesScroll = () => {
    console.log("services");
    handleScroll(servicesRef);
  };

  const handleContactScroll = () => {
    console.log("contact");
    handleScroll(contactRef);
  };
  
  useEffect(() => {
    if (window.innerWidth > 768) {
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
    }
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 400) {
      //768
      console.log("Use Large Display for Animations");
      return; // Skip initializing Three.js for small screens
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const canvas = innerCanvas.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const geometries = [
      // new THREE.TorusGeometry(1, 0.4, 12, 48),
      // new THREE.IcosahedronGeometry(1, 0),
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
      console.log(num);
      const geometry = geometries[num];
      const shape = new THREE.Mesh(geometry, material);
      const wireframe = new THREE.WireframeGeometry(geometry);
      const line = new THREE.LineSegments(wireframe);
      line.material.depthTest = false;
      line.material.opacity = 0.1;
      line.material.transparent = true;
      shape.add(line);

      // shape.receiveShadow = true;
      // shape.traverse(function (node) {
      //   if (node.isMesh) node.castShadow = true;
      // });
      shape.castShadow = true;
      shape.receiveShadow = false;
      scene.add(shape);
      shape.position.set(0, 0.3, 0);
      console.log("Created Shape");
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
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

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
      scene.clear(); // Clear all children and objects
      renderer.dispose();
    };
  }, []);

  return (
    <div
      className={`gradient-background h-full relative ${
        data.showCursor && "cursor-none"
      }`}
    >
      {/* {data.showCursor && <Cursor />} */}
      <div className="scanlines"></div>
      <Head>
        <title>Where Chaos, Meets Code</title>
      </Head>

      <div className="h-full intro-wrap mx-auto relative z-1" ref={bodyRef}>
        {/* NAV */}
        <Header
          handleContactScroll={handleContactScroll}
          showFullWindow={showFullWindow}
        />

        {/* CANVAS */}
        <div className="absolute -z-10 top-0 right-0 tablet:w-10/12 overflow-hidden">
          <canvas ref={innerCanvas}></canvas>
        </div>

        <section
          className={`${
            showFullWindow ? "h-screen" : "h-full"
          }  justify-center tablet:justify-start flex flex-col z-1 relative`}
        >
          <div className="absolute bottom-12 right-0 p-3 text-white vhs-text vhs-back rounded-md hidden mob:block">
            <h2>UPDATED</h2>
            <h2 className="text-xs">2025.22.01</h2>
            <p className="text-xs ">한국 서울</p>
            <p>_________</p>
          </div>

          <div className="absolute bottom-12 left-0 flex flex-col tablet:flex-row gap-3 text-white vhs-text hidden tablet:flex">
            <div
              className="play mr-2 tablet:mr-20 rounded-md p-3 vhs-back cursor-pointer"
              data-splitting
              onClick={() => handleWorkScroll()}
            >
              PROJECTS
            </div>
            <div
              className="play mr-2 tablet:mr-20 rounded-md p-3 vhs-back cursor-pointer"
              data-splitting
              onClick={() => handleServicesScroll()}
            >
              SERVICES
            </div>
            <div
              className="play mr-2 tablet:mr-20 rounded-md p-3 vhs-back cursor-pointer"
              data-splitting
              onClick={() => handleContactScroll()}
            >
              CONTACT
            </div>
          </div>

          <div className="tablet:mt-44">
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
        </section>

        <section className="mb-10 laptop:mb-30 p-2 laptop:p-0" ref={workRef}>
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
        </section>

        <section
          className="mt-10 laptop:mt-30 p-2 laptop:p-0"
          ref={servicesRef}
        >
          <h1 className="mt-44 hero-font text-center tablet:text-left text-3xl tablet:text-5xl font-bold text-bold my-10">
            Services
          </h1>
          <h1 className="text-2xl text-center tablet:text-left mt-2">
            I specialise in end-to-end development, product design, and creative
            prototype research.
          </h1>
          <div className="grid dark-mode mt-5 laptop:mt-10 grid-cols-1 laptop:grid-cols-2 gap-6 transition-all ease-out duration-300 tablet:p-12 laptop:p-12 rounded-lg p-2">
            {data.services.map((service, index) => (
              <ServiceCard
                key={index}
                name1={service.title}
                name2={service.title1}
                description={service.description}
              />
            ))}
          </div>
        </section>

        <section ref={contactRef} className="p-2 tablet:p-2 laptop:p-0 mb-44">
          <h1 className="mt-44 hero-font text-center tablet:text-left text-3xl tablet:text-5xl font-bold text-bold my-10">
            Contact
          </h1>
          {/* <h1 className="text-2xl text-center tablet:text-left mt-2">
            I blend creative technologies, generative AI, and end-to-end product
            design to craft intelligent human-centric experiences.
          </h1> */}
          <Footer />
        </section>

        <hr className="custom-hr" />
        <p className="text-center opacity-80 mb-10 mt-10">
          3D experience available on large screens.
        </p>
      </div>
    </div>
  );
}
