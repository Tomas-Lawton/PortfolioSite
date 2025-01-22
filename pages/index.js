import * as THREE from "three";
import React, { Suspense, useRef, useEffect, useState } from "react";

import { Canvas, useThree } from "@react-three/fiber";
import { Html, useGLTF, OrbitControls } from "@react-three/drei";
import { stagger } from "../animations";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";

import LandingPage from "./landingpage";
import ScrambleText from "scramble-text";

const handleKeyboardClick = (event) => {
  console.log("keyboard");
  const audio = new Audio("/keypress.mp3");
  audio.volume = 0.5 + Math.random() * 0.4;
  audio.play();
};

const handleMouseClick = (event) => {
  console.log("mouse");
  const audio = new Audio("/mouseclick.mp3");
  audio.play();
};

function Model(props) {
  const group = useRef();
  const keyboardRef = useRef();
  const mouse = useGLTF("/mouse.glb");
  const { nodes, materials } = useGLTF("/puter.glb");

  return (
    <>
      <group ref={group} {...props} dispose={null}>
        <Html
          className="content"
          rotation={[Math.PI / 2 - 0.18, 0, 0]}
          position={[-1.3, -4, 14.2]}
          transform
          occlude
          scale={0.5}
        >
          <div
            className={`wrapper custom-body w-screen overflow-hidden ${
              !props.zoomed && "cursor-pointer"
            }`}
            onClick={() => {
              !props.zoomed && props.toggleZoom();
            }}
          >
            <LandingPage className="landing-page" />
          </div>
        </Html>

        <mesh
          material={materials["ibm_3178"]}
          geometry={nodes["ibm_3178_0"].geometry}
          castShadow
          // onClick={!props.zoomed && props.toggleZoom}
        />
        <mesh
          ref={keyboardRef}
          material={materials["ibm_3178_keyboard"]}
          geometry={nodes["ibm_3178_1"].geometry}
          castShadow
          onClick={() => {
            !props.zoomed && handleKeyboardClick();
          }}
        />

        <group rotation={[-0.15, -0.6, 0.3]} position={[19.5, -18, 0]}>
          <mesh
            material={mouse.materials["Mouse"]}
            geometry={mouse.nodes["mouse_Mouse_0"].geometry}
            castShadow
            onClick={handleMouseClick}
            scale={[29, 29, 29]}
          />

          <mesh
            material={mouse.materials["rubber_feet"]}
            geometry={mouse.nodes["mouse_rubber_feet_0"].geometry}
            castShadow
            scale={[29, 29, 29]}
          />
        </group>
      </group>
    </>
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

export default function App() {
  const textOn = useRef();
  const textOne = useRef();
  const canvasRef = useRef();

  const initialCameraPos = [-3, 2, 4];
  const zoomedCameraPos = [0, 0.8, 8];

  const [cameraPosition, setCameraPosition] = useState(initialCameraPos);
  const [distance, setDistance] = useState(48);
  const [zoomed, setZoomed] = useState(false);

  const [fullscreen, setFullscreen] = useState(false);



  const toggleZoom = () => {
    setZoomed((prev) => !prev);
    setCameraPosition(zoomed ? initialCameraPos : zoomedCameraPos);
    setDistance(zoomed ? 48 : 1);
    if (!zoomed) handleMouseClick();
  };

  useEffect(() => {
    const element = textOne.current;
    if (element && !element.hasAttribute("data-scrambled")) {
      element.setAttribute("data-scrambled", "true"); // Mark as scrambled
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

      renderer.setClearColor(0x5b5b5b, 1); // Black background
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call it once to set the initial size

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
              stroke-width="4"
            />
          </svg>
          {/* <span className="tooltip">Zoom Out</span> */}
        </button>
      )}

      {!zoomed && (
        <div ref={textOn} className="room-text">
          <div className="terminal-loader">
            <div className="terminal-header">
              <div className="terminal-title">T-SHELL</div>
              <div className="terminal-controls">
                <div className="control close"></div>
                <div className="control minimize"></div>
                <div className="control maximize"></div>
              </div>
            </div>
            <div className="mt-4 tek">Login Complete.</div>
            <div className="text tek">Click the screen to explore...</div>
          </div>
        </div>
      )}

      {!zoomed && (
        <div className="room-text text-2 tek">
          <p ref={textOne}>Made by Tommy</p>
        </div>
      )}

      <button className="fullscreen-btn">
        <svg
          viewBox="0 0 448 512"
          height="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M32 32C14.3 32 0 46.3 0 64v96c0 17.7 14.3 32 32 32s32-14.3 32-32V96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H64V352zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h64v64c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H320zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V352z"></path>
        </svg>
        <span className="tooltip">Fullscreen</span>
      </button>

      <Canvas ref={canvasRef} camera={{ position: cameraPosition }} shadows>
        <UpdateCameraPosition position={cameraPosition} />
        <Suspense fallback={null}>
          <group
            castShadow
            rotation={[Math.PI / 2, Math.PI, Math.PI]}
            position={[0, 0, 0]}
          >
            <Model zoomed={zoomed} toggleZoom={toggleZoom} />
          </group>

          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[300, 300]} />
            <meshPhongMaterial color={0x5b5b5b} />
          </mesh>

          {/* Wall behind the computer */}
          <mesh position={[0, 10, -40]} receiveShadow>
            <planeGeometry args={[300, 300]} />
            <meshStandardMaterial color={0x333333} />
          </mesh>

          {/* <ambientLight intensity={0.04} /> */}
          {/* <EffectComposer disableNormalPass>
            <Bloom
              mipmapBlur
              luminanceThreshold={1}
              levels={10}
              intensity={0.2}
            />
            <ToneMapping />
          </EffectComposer>
          <mesh
            scale={10}
            position={[150, 10, -39]}
            // rotation={[0, 0, Math.PI / 2]}
            rotation={[0, Math.PI / 2, 0]}

          >
            <cylinderGeometry args={[0.1, 0.1, 2]} />
            <meshStandardMaterial
              emissiveIntensity={5.5}
              color={0x7fff00}
              emissive={0x7fff00}
            />
          </mesh>
          <mesh
            scale={10}
            position={[-150, 10, -39]}
            // rotation={[0, 0, Math.PI / 2]}
            rotation={[0, Math.PI / 2, 0]}

          >
            <cylinderGeometry args={[0.1, 0.1, 2]} />
            <meshStandardMaterial
              emissiveIntensity={5.5}
              color={"red"}
              emissive={"red"}
            />
          </mesh> */}

          {/* Glowing rectangle */}

          {/* Lights */}
          <directionalLight
            color={0x00ff00}
            position={[5, 5, 3]}
            intensity={0.5}
            // intensity={0.2}

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
            position={[-2, 0, 2]}
            intensity={0.5}
            // intensity={0.2}

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
          minPolarAngle={1.2}
          maxPolarAngle={Math.PI / 2.2}
          minAzimuthAngle={-Math.PI / 7.4}
          maxAzimuthAngle={Math.PI / 7.4}
        />
      </Canvas>
    </>
  );
}
