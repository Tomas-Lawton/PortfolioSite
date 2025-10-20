import * as THREE from "three";
import React, { Suspense, useRef, useEffect, useState } from "react";

import { Canvas, useThree } from "@react-three/fiber";
import { Html, useGLTF, OrbitControls } from "@react-three/drei";
import { stagger } from "../../animations";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";

import LandingPage from "./landingpage";
import ScrambleText from "scramble-text";

const handleKeyboardClick = () => {
  const audio = new Audio("/keypress.mp3");
  audio.volume = 0.5 + Math.random() * 0.4;
  audio.play();
};

const handleMouseClick = () => {
  const audio = new Audio("/mouseclick.mp3");
  audio.play();
};

function Model(props) {
  const { nodes, materials } = useGLTF("/puter.glb");
  const mouseModel = useGLTF("/mouse.glb");

  const group = useRef();
  const keyboardRef = useRef();
  const mouseRef = useRef();
  const computerMeshRef = useRef();
  const [mouseHover, setMouseHover] = useState(false);

  const { camera, raycaster: threeRaycaster } = useThree();
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const handleMouseMove = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([
      keyboardRef.current,
      mouseRef.current,
    ]);
    document.body.style.cursor = intersects.length > 0 ? "pointer" : "default";
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Fix material transparency
  useEffect(() => {
    if (materials["ibm_3178"]) {
      materials["ibm_3178"].transparent = false;
      materials["ibm_3178"].opacity = 1;
      materials["ibm_3178"].depthWrite = true;
      materials["ibm_3178"].depthTest = true;
    }
    if (materials["ibm_3178_keyboard"]) {
      materials["ibm_3178_keyboard"].transparent = false;
      materials["ibm_3178_keyboard"].opacity = 1;
      materials["ibm_3178_keyboard"].depthWrite = true;
      materials["ibm_3178_keyboard"].depthTest = true;
    }
    if (mouseModel.materials["Mouse"]) {
      mouseModel.materials["Mouse"].transparent = false;
      mouseModel.materials["Mouse"].opacity = 1;
      mouseModel.materials["Mouse"].depthWrite = true;
      mouseModel.materials["Mouse"].depthTest = true;
    }
    if (mouseModel.materials["rubber_feet"]) {
      mouseModel.materials["rubber_feet"].transparent = false;
      mouseModel.materials["rubber_feet"].opacity = 1;
      mouseModel.materials["rubber_feet"].depthWrite = true;
      mouseModel.materials["rubber_feet"].depthTest = true;
    }
  }, [materials, mouseModel.materials]);

  return (
    <group ref={group} {...props} dispose={null}>
      <Html
        className="content"
        rotation={[Math.PI / 2 - 0.18, 0, 0]}
        position={[-1.3, -3.5, 14.2]}
        transform
        occlude={[computerMeshRef, keyboardRef]}
        scale={0.5}
      >
        <div
          className={`wrapper custom-body overflow-hidden ${
            !props.zoomed && "cursor-pointer"
          }`}
          onClick={() => {
            !props.zoomed && props.toggleZoom();
          }}
        >
          <LandingPage showFullWindow={false} />
        </div>
      </Html>

      <mesh
        ref={computerMeshRef}
        material={materials["ibm_3178"]}
        geometry={nodes["ibm_3178_0"].geometry}
        castShadow
        receiveShadow
      />
      <mesh
        ref={keyboardRef}
        material={materials["ibm_3178_keyboard"]}
        geometry={nodes["ibm_3178_1"].geometry}
        castShadow
        receiveShadow
        onClick={() => {
          if (!props.zoomed) {
            handleKeyboardClick();
          }
        }}
      />
      <group
        ref={mouseRef}
        rotation={[-0.15, -0.6, 0.3]}
        position={[19.5, -18, 0]}
        scale={[29, 29, 29]}
        onPointerOver={() => !props.zoomed && setMouseHover(true)}
        onPointerOut={() => setMouseHover(false)}
      >
        <mesh
          material={mouseModel.materials["Mouse"]}
          geometry={mouseModel.nodes["mouse_Mouse_0"].geometry}
          castShadow
          receiveShadow
          onClick={() => {
            if (!props.zoomed) {
              handleMouseClick();
            }
          }}
        />
        <mesh
          material={mouseModel.materials["rubber_feet"]}
          geometry={mouseModel.nodes["mouse_rubber_feet_0"].geometry}
          castShadow
          receiveShadow
        />
      </group>
      {mouseHover && !props.zoomed && (
        <pointLight
          position={[0.67, -0.62, 0]}
          color="#7fff00"
          intensity={2}
          distance={5}
        />
      )}
    </group>
  );
}




function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <group position={[0, 38, -39]}>
      <Html
        transform
        center
        distanceFactor={15}
        style={{
          pointerEvents: "none",
        }}
      >
        <div
          className="digital-clock tek text-8xl font-bold opacity-80"
          style={{
            color: "#7fff00",
            textShadow: "0 0 15px #7fff00, 0 0 30px #7fff00",
          }}
        >
          {time.toLocaleTimeString("en-US", { hour12: false })}
        </div>
      </Html>
    </group>
  );
}

function NeonSign({ position, text, color }) {
  return (
    <group position={position}>
      <Html
        transform
        center
        distanceFactor={20}
        style={{
          pointerEvents: "none",
        }}
      >
        <div
          className="tek text-9xl font-bold tracking-wider"
          style={{
            color: color,
            textShadow: `0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}`,
            letterSpacing: "0.3em",
          }}
        >
          {text}
        </div>
      </Html>
      <pointLight
        position={[0, 0, 5]}
        color={color}
        intensity={6}
        distance={50}
      />
    </group>
  );
}



function UpdateCameraPosition({ position }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(...position);
    camera.updateProjectionMatrix();
  }, [position, camera]);

  return null;
}

export default function Scene() {
  const textOn = useRef();
  const textOne = useRef();
  const canvasRef = useRef();

  const initialCameraPos = [-3, 2, 4];

  let zoomedCameraPos = [0, 1, 7];

  if (typeof window !== "undefined") {
    if (window.innerWidth > 1500) {
      zoomedCameraPos = [0, 1, 7];
    } else if (window.innerWidth > 1300) {
      zoomedCameraPos = [0, 1, 9];
    } else if (window.innerWidth > 980) {
      zoomedCameraPos = [0, 1, 11];
    } else {
      zoomedCameraPos = [0, 1, 18];
    }
  }

  const [cameraPosition, setCameraPosition] = useState(initialCameraPos);
  const [distance, setDistance] = useState(48);
  const [zoomed, setZoomed] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);

  const toggleZoom = () => {
    setZoomed((prev) => !prev);
    setCameraPosition(zoomed ? initialCameraPos : zoomedCameraPos);
    setDistance(zoomed ? 48 : 1);
    if (!zoomed) handleMouseClick();
  };

  useEffect(() => {
    const element = textOne.current;
    if (element && !element.hasAttribute("data-scrambled")) {
      element.setAttribute("data-scrambled", "true");
      const scrambleInstance = new ScrambleText(element);

      stagger(
        [textOn.current, textOne.current],
        { y: 40, x: -10, transform: "scale(0.95) skew(10deg)" },
        { y: 0, x: 0, transform: "scale(1)" },
        () => scrambleInstance.start()
      );
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const canvas = canvasRef.current;
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      renderer.setClearColor(0x0a0a0a, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {zoomed && (
        <button
          className="fullscreen-btn-2 fullscreen-btn"
          onClick={toggleZoom}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            height="1.2em"
            width="1.2em"
          >
            <path
              d="M36 12L12 36M12 12l24 24"
              stroke="#56ff56"
              strokeWidth="4"
            />
          </svg>
        </button>
      )}

      {!zoomed && showTerminal && (
        <div ref={textOn} className="room-text">
          <div className="terminal-loader">
            <div className="terminal-header">
              <div className="terminal-title">T-SHELL</div>
              <div className="terminal-controls">
                <div
                  className="control close cursor-pointer"
                  onClick={() => setShowTerminal(false)}
                ></div>
                <div className="control minimize"></div>
                <div className="control maximize"></div>
              </div>
            </div>
            <div className="mt-4 tek">Login Complete.</div>
            <div className="text tek">Click the screen to explore...</div>
            <div className="mt-4 tek">Made by Tommy.</div>
          </div>
        </div>
      )}

      <Canvas
        ref={canvasRef}
        camera={{ position: cameraPosition }}
        shadows
        gl={{ antialias: true }}
      >
        <UpdateCameraPosition position={cameraPosition} />
        <fog attach="fog" args={["#0a0a0a", 100, 200]} />
        <Suspense fallback={null}>
          <group
            castShadow
            rotation={[Math.PI / 2, Math.PI, Math.PI]}
            position={[0, 0, 0]}
          >
            <Model zoomed={zoomed} toggleZoom={toggleZoom} />
          </group>

          <DigitalClock />

          <NeonSign position={[-70, 20, -38]} text="CHAOS" color="#ff9500" />
          <NeonSign position={[70, 20, -38]} text="CODE" color="#7fff00" />

          <mesh
            position={[-100, 10, 0]}
            rotation={[0, Math.PI / 2, 0]}
            receiveShadow
          >
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial
              color={0x1a1a1a}
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>

          <mesh
            position={[100, 10, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            receiveShadow
          >
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial
              color={0x1a1a1a}
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>

          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial color={0x0a0a0a} roughness={1} />
          </mesh>

          <mesh position={[0, 10, -40]} receiveShadow>
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial
              color={0x1a1a1a}
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>

          <ambientLight intensity={0.1} />

          <EffectComposer disableNormalPass>
            <Bloom
              mipmapBlur
              luminanceThreshold={1}
              levels={10}
              intensity={0.35}
            />
            <ToneMapping />
          </EffectComposer>

          <mesh
            scale={10}
            position={[95, 10, -39]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <cylinderGeometry args={[0.1, 0.1, 5]} />
            <meshStandardMaterial
              emissiveIntensity={8}
              color={0x7fff00}
              emissive={0x7fff00}
            />
          </mesh>
          <mesh
            scale={10}
            position={[-98, 10, -39]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <cylinderGeometry args={[0.1, 0.1, 5]} />
            <meshStandardMaterial
              emissiveIntensity={9}
              color={"orange"}
              emissive={"orange"}
            />
          </mesh>

          <pointLight
            position={[0, 25, 15]}
            color="#7fff00"
            intensity={1.5}
            distance={50}
          />

          <directionalLight
            color={0x00ff00}
            position={[5, 5, 3]}
            intensity={0.2}
            castShadow
            shadow-camera-left={-150}
            shadow-camera-right={150}
            shadow-camera-top={150}
            shadow-camera-bottom={-150}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <directionalLight
            color={0xffa500}
            position={[-2, 0, -2]}
            intensity={0.35}
            castShadow
            shadow-camera-left={-150}
            shadow-camera-right={150}
            shadow-camera-top={150}
            shadow-camera-bottom={-150}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
        </Suspense>

        <OrbitControls
          target={[0, 14, 0]}
          minDistance={distance}
          enablePan={true}
          enableZoom={false}
          minPolarAngle={0.8}
          maxPolarAngle={Math.PI / 1.8}
          minAzimuthAngle={-Math.PI / 3}
          maxAzimuthAngle={Math.PI / 3}
        />
      </Canvas>
    </>
  );
}
