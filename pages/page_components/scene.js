import * as THREE from "three";
import React, { Suspense, useRef, useEffect, useState, useMemo } from "react";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Html, useGLTF, OrbitControls, Text } from "@react-three/drei";
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

// Simple particles
function Particles() {
  const count = 25;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 150;
      pos[i * 3 + 1] = Math.random() * 80 + 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80 - 20;
    }
    return pos;
  }, []);

  const pointsRef = useRef();

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        color="#00ff00"
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Model(props) {
  const { nodes, materials } = useGLTF("/puter.glb");
  const mouseModel = useGLTF("/mouse.glb");

  const group = useRef();
  const keyboardRef = useRef();
  const mouseRef = useRef();
  const mouseMesh1Ref = useRef();
  const mouseMesh2Ref = useRef();
  const computerMeshRef = useRef();
  const screenOccluderRef = useRef();
  const [mouseHover, setMouseHover] = useState(false);

  const { camera } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouse = useMemo(() => new THREE.Vector2(), []);

  const handleMouseMove = (event) => {
    if (!keyboardRef.current || !mouseRef.current) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([
      keyboardRef.current,
      mouseRef.current,
      computerMeshRef.current,
    ]);
    document.body.style.cursor = intersects.length > 0 ? "pointer" : "default";
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [camera, handleMouseMove]);

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
      <mesh
        ref={screenOccluderRef}
        position={[-1.3, -3.5, 14.0]}
        rotation={[Math.PI / 2 - 0.18, 0, 0]}
        visible={false}
      >
        <planeGeometry args={[4.5, 3.5]} />
        <meshBasicMaterial
          colorWrite={false}
          depthWrite={true}
          depthTest={true}
        />
      </mesh>

      <Html
        className="content"
        rotation={[Math.PI / 2 - 0.18, 0, 0]}
        position={[-1.3, -4, 14.2]}
        transform
        occlude={props.zoomed ? false : true}
        scale={0.5}
      >
        <div style={{ width: "1300px", height: "880px" }}>
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
        </div>
      </Html>

      <mesh
        ref={computerMeshRef}
        material={materials["ibm_3178"]}
        geometry={nodes["ibm_3178_0"].geometry}
        receiveShadow
        renderOrder={1}
        onClick={() => {
          if (!props.zoomed) {
            props.toggleZoom();
          }
        }}
        onPointerOver={() => {
          if (!props.zoomed) {
            document.body.style.cursor = "pointer";
          }
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      />
      <mesh
        ref={keyboardRef}
        material={materials["ibm_3178_keyboard"]}
        geometry={nodes["ibm_3178_1"].geometry}
        receiveShadow
        onClick={() => {
          if (!props.zoomed) {
            handleKeyboardClick();
          }
        }}
        renderOrder={0}
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
          ref={mouseMesh1Ref}
          material={mouseModel.materials["Mouse"]}
          geometry={mouseModel.nodes["mouse_Mouse_0"].geometry}
          receiveShadow
          onClick={() => {
            if (!props.zoomed) {
              handleMouseClick();
            }
          }}
          renderOrder={0}
        />
        <mesh
          ref={mouseMesh2Ref}
          material={mouseModel.materials["rubber_feet"]}
          geometry={mouseModel.nodes["mouse_rubber_feet_0"].geometry}
          receiveShadow
          renderOrder={0}
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

  const timeString = time.toLocaleTimeString("en-US", { hour12: false });

  return (
    <group position={[0, 38, -39]}>
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[28, 6]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.9}
          depthWrite={true}
          depthTest={true}
        />
      </mesh>

      <Text
        position={[0, 0, 0]}
        fontSize={2.5}
        color="#ff0000"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="#ff0000"
        outlineOpacity={1}
        depthTest={true}
        depthWrite={false}
      >
        {timeString}
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={5}
          toneMapped={false}
        />
      </Text>

      <pointLight
        position={[0, 0, 3]}
        color="#ff0000"
        intensity={3}
        distance={15}
      />
    </group>
  );
}
function NeonSign({ position, text, color }) {
  const textRef = useRef();

  useFrame((state) => {
    if (textRef.current) {
      const flicker = Math.random() > 0.97 ? 0.7 : 1;
      const pulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.08 + 0.92;
      textRef.current.fillOpacity = pulse * flicker;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0, -0.2]}>
        <planeGeometry args={[40, 10]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.8}
          depthWrite={true}
          depthTest={true}
        />
      </mesh>

      <Text
        ref={textRef}
        position={[0, 0, 0]}
        fontSize={4}
        color={color}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
        outlineWidth={0.15}
        outlineColor={color}
        outlineOpacity={1}
        depthTest={true}
        depthWrite={false}
      >
        {text}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </Text>

      <pointLight
        position={[0, 0, 5]}
        color={color}
        intensity={8}
        distance={60}
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

function Wall({ position, rotation, args, color = 0x0d0d0d }) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow renderOrder={0}>
      <planeGeometry args={args} />
      <meshStandardMaterial
        color={color}
        roughness={0.95}
        metalness={0.05}
        depthWrite={true}
        depthTest={true}
      />
    </mesh>
  );
}

function CylinderLight({ position, color, intensity = 8 }) {
  const colorValue = color === "orange" ? 0xff9500 : 0x7fff00;
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.2 + 1;
      meshRef.current.material.emissiveIntensity = intensity * pulse;
    }
  });

  return (
    <mesh
      ref={meshRef}
      scale={10}
      position={position}
      rotation={[0, Math.PI / 2, 0]}
      renderOrder={1}
    >
      <cylinderGeometry args={[0.1, 0.1, 5]} />
      <meshStandardMaterial
        emissiveIntensity={intensity}
        color={colorValue}
        emissive={colorValue}
        depthWrite={true}
        depthTest={true}
      />
    </mesh>
  );
}

export default function Scene() {
  const textOn = useRef();
  const textOne = useRef();
  const canvasRef = useRef();

  const initialCameraPos = [0, 5, 4];

  let zoomedCameraPos = [0, 0.8, 8];

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
      if (canvas) {
        const scene = canvas.__r3f;
        if (scene && scene.camera) {
          scene.camera.aspect = width / height;
          scene.camera.updateProjectionMatrix();
        }
      }
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
            <div ref={textOne} className="text tek">
              Click the screen to explore...
            </div>
            <div className="mt-4 tek">Made by Tommy.</div>
          </div>
        </div>
      )}

      <Canvas
        ref={canvasRef}
        camera={{ position: cameraPosition }}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          depth: true,
        }}
        performance={{ min: 0.5 }}
      >
        <UpdateCameraPosition position={cameraPosition} />
        <fog attach="fog" args={["#050505", 20, 200]} />

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

          <Wall
            position={[-100, 10, 0]}
            rotation={[0, Math.PI / 2, 0]}
            args={[200, 200]}
          />
          <Wall
            position={[100, 10, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            args={[200, 200]}
          />
          <Wall
            position={[0, 10, -40]}
            rotation={[0, 0, 0]}
            args={[200, 200]}
          />

          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow renderOrder={0}>
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial
              color={0x050505}
              roughness={0.95}
              depthWrite={true}
              depthTest={true}
            />
          </mesh>

          <Particles />

          <ambientLight intensity={0.45} color="#001a00" />

          <CylinderLight
            position={[95, 10, -39]}
            color={0x7fff00}
            intensity={10}
          />
          <CylinderLight
            position={[-98, 10, -39]}
            color={"orange"}
            intensity={11}
          />

          <EffectComposer>
            <Bloom
              mipmapBlur
              luminanceThreshold={0.5}
              levels={9}
              intensity={1.2}
            />
            <ToneMapping />
          </EffectComposer>

          <pointLight
            position={[0, 25, 15]}
            color="#00ff00"
            intensity={2}
            distance={60}
          />

          <directionalLight
            color={0x00ff00}
            position={[5, 5, 3]}
            intensity={0.3}
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
            intensity={0.4}
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
          minPolarAngle={1}
          maxPolarAngle={Math.PI / 2.2}
          minAzimuthAngle={zoomed ? -Math.PI / 5 : -Math.PI / 2}
          maxAzimuthAngle={zoomed ? Math.PI / 5 : Math.PI / 2}
        />
      </Canvas>
    </>
  );
}
