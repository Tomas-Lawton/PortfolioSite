import * as THREE from "three";
import React, {
  Suspense,
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  Html,
  useGLTF,
  OrbitControls,
  Text,
  RoundedBox,
  useTexture,
} from "@react-three/drei";
import { stagger } from "../../animations";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";

import LandingPage from "./landingpage";

const handleKeyboardClick = () => {
  const audio = new Audio("/keypress.mp3");
  audio.volume = 0.5 + Math.random() * 0.4;
  audio.play();
};

const handleMouseClick = () => {
  const audio = new Audio("/mouseclick.mp3");
  audio.play();
};

// Simple particles with mixed colors
function Particles({ position = [0, 55, -60], spread = 40 }) {
  const count = 20;
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread + position[0]; // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread + position[1]; // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread + position[2]; // Z

      // 60% green, 40% orange
      if (Math.random() > 0.6) {
        col[i * 3] = 1.0; // R
        col[i * 3 + 1] = 0.4; // G
        col[i * 3 + 2] = 0.0; // B (orange)
      } else {
        col[i * 3] = 0.0; // R
        col[i * 3 + 1] = 1.0; // G
        col[i * 3 + 2] = 0.0; // B (green)
      }
    }
    return { positions: pos, colors: col };
  }, [position, spread]);

  const pointsRef = useRef();

  // useFrame((state) => {
  //   if (pointsRef.current) {
  //     pointsRef.current.rotation.y = state.clock.elapsedTime * 0.005;
  //   }
  // });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        vertexColors
        emissive={true}
        toneMapped={false}
      />
    </points>
  );
}

function Door({ position, rotation, scale = 1 }) {
  const { scene } = useGLTF("/door.glb");
  return (
    <primitive
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

function Couch({ position, rotation, scale = 1 }) {
  const { scene } = useGLTF("/couch.glb");
  return (
    <primitive
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

function Cat({ position, rotation, scale = 1 }) {
  const { scene } = useGLTF("/cat.glb");
  return (
    <primitive
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

function ElectricBox({ position, rotation, scale = 1 }) {
  const { scene } = useGLTF("/electricbox.glb");
  return (
    <primitive
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

function Generator({ position, rotation, scale = 1 }) {
  const { scene } = useGLTF("/generator.glb");
  return (
    <primitive
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

// Parallax Cityscape Background
function ParallaxCityscape({ position, rotation = [0, 0, 0] }) {
  const texture = useTexture("/city.jpg");
  const meshRef = useRef();
  const { camera } = useThree();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = position[0] + camera.position.x * 0.02;
      meshRef.current.position.y = camera.position.y * 0.02 + position[1];
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={2}>
      <planeGeometry args={[200, 150]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

// New Props Components
function NoodleSign({ position, rotation, scale = 1 }) {
  const { scene } = useGLTF("/noodle-sign.glb");
  return (
    <primitive
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

function SciFiDesk({ position, rotation, scale = 1 }) {
  const { scene } = useGLTF("/desk.glb");
  return (
    <primitive
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

function LantianLamp({ position, rotation, scale = 1 }) {
  const { scene } = useGLTF("/lamp.glb");
  return (
    <primitive
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

function SciFiLight({ position, rotation, scale = 1 }) {
  const { scene } = useGLTF("/scifi-light.glb");
  return (
    <primitive
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

function HangingLight({ position, rotation, scale = 1 }) {
  const { scene } = useGLTF("/hanginglight.glb");
  return (
    <primitive
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

function HangingLED({ position, rotation, scale = 1 }) {
  const { scene } = useGLTF("/hangingled.glb");
  return (
    <primitive
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

function WallLight({ position, rotation, scale = 1 }) {
  const { scene } = useGLTF("/walllight.glb");
  return (
    <primitive
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

function ElectricCable({ position, rotation, scale = 1 }) {
  const { scene } = useGLTF("/cable.glb");
  return (
    <primitive
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

function ModularCables({ position, rotation, scale = 1 }) {
  const { scene } = useGLTF("/cables.glb");
  return (
    <primitive
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

function PlantPot({ position, rotation, scale = 1 }) {
  const { scene } = useGLTF("/plant.glb");
  return (
    <primitive
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

function Chair({ position, rotation, scale = 1 }) {
  const { scene } = useGLTF("/chair.glb");
  return (
    <primitive
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
    />
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
  const [mouseHover, setMouseHover] = useState(false);

  const { camera } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouse = useMemo(() => new THREE.Vector2(), []);

  const handleMouseMove = useCallback(
    (event) => {
      if (!keyboardRef.current || !mouseRef.current || !computerMeshRef.current)
        return;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const objectsToIntersect = [keyboardRef.current, mouseRef.current];
      if (!props.zoomed) objectsToIntersect.push(computerMeshRef.current);

      const intersects = raycaster.intersectObjects(objectsToIntersect, true);
      document.body.style.cursor =
        intersects.length > 0 ? "pointer" : "default";
    },
    [camera, mouse, raycaster, props.zoomed]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    if (materials["ibm_3178"]) {
      materials["ibm_3178"].transparent = false;
      materials["ibm_3178"].opacity = 1;
      materials["ibm_3178"].depthWrite = true;
      materials["ibm_3178"].depthTest = true;
      materials["ibm_3178"].side = THREE.DoubleSide;
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
        position={[-1.3, -3.65, 14]}
        transform
        occlude="blending"
        scale={0.5}
      >
        <div style={{ width: "1250px", height: "920px" }}>
          <div
            className={`wrapper custom-body overflow-hidden`}
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
        onPointerOver={() => {
          if (!props.zoomed) {
            document.body.style.cursor = "pointer";
          }
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      />
      <group
        ref={mouseRef}
        rotation={[-0.15, -0.6, 0.3]}
        position={[19.5, -18, 0]}
        scale={[29, 29, 29]}
        onPointerOver={() => {
          if (!props.zoomed) {
            setMouseHover(true);
            document.body.style.cursor = "pointer";
          }
        }}
        onPointerOut={() => {
          setMouseHover(false);
          document.body.style.cursor = "default";
        }}
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
        />
        <mesh
          ref={mouseMesh2Ref}
          material={mouseModel.materials["rubber_feet"]}
          geometry={mouseModel.nodes["mouse_rubber_feet_0"].geometry}
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

  const timeString = time.toLocaleTimeString("en-US", { hour12: false });

  return (
    <group position={[0, 82, -79]} scale={2}>
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

function Wall({ position, rotation, args, color = 0x2a2a2a }) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <planeGeometry args={args} />
      <meshStandardMaterial
        color={color}
        roughness={0.5}
        metalness={0.5}
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

  const initialCameraPos = [0, 55, 70];

  let zoomedCameraPos = [0, 57, -50];

  if (typeof window !== "undefined") {
    if (window.innerWidth > 1500) {
      zoomedCameraPos = [0, 57, -50];
    } else if (window.innerWidth > 1300) {
      zoomedCameraPos = [0, 57, -49];
    } else if (window.innerWidth > 980) {
      zoomedCameraPos = [0, 57, -48];
    } else {
      zoomedCameraPos = [0, 57, -46];
    }
  }

  const [cameraPosition, setCameraPosition] = useState(initialCameraPos);
  const [distance, setDistance] = useState(48);
  const [zoomed, setZoomed] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);

  const animateCamera = (start, end, duration = 1000) => {
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-in-out)
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const newPos = [
        start[0] + (end[0] - start[0]) * eased,
        start[1] + (end[1] - start[1]) * eased,
        start[2] + (end[2] - start[2]) * eased,
      ];

      setCameraPosition(newPos);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const toggleZoom = () => {
    const newZoomed = !zoomed;
    setZoomed(newZoomed);
    setDistance(newZoomed ? 1 : 48);

    animateCamera(
      cameraPosition,
      newZoomed ? zoomedCameraPos : initialCameraPos,
      800 // Duration in ms
    );

    if (!newZoomed) handleMouseClick();
  };

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
              Click on monitor to explore...
            </div>
            <div className="mt-4 tek">Made by Tommy.</div>
          </div>
        </div>
      )}

      <Canvas
        ref={canvasRef}
        camera={{ position: cameraPosition }}
        shadows="basic"
        gl={{
          antialias: true,
          alpha: true,
          depth: true,
          powerPreference: "high-performance",
        }}
        performance={{ min: 0.5 }}
        dpr={[1, 1.5]}
        style={{ zIndex: 0 }}
      >
        <UpdateCameraPosition position={cameraPosition} />
        <fog attach="fog" args={["#1a1a1a", 100, 400]} />

        <Suspense fallback={null}>
          <group
            castShadow
            rotation={[Math.PI / 2, Math.PI, Math.PI]}
            position={[0, 40.5, -62]}
          >
            <Model zoomed={zoomed} toggleZoom={toggleZoom} />
          </group>

          <Particles position={[0, 55, -60]} spread={50} />

          {/* PARALLAX CITYSCAPE - Further behind the window so visible through glass */}
          <ParallaxCityscape
            position={[200, 70, 50]}
            rotation={[0, -Math.PI / 2, 0]}
          />

          {/* RIGHT WALL with window cutout - 4 separate pieces */}
          <Wall
            position={[130, 10, 30]}
            rotation={[0, -Math.PI / 2, 0]}
            args={[220, 50]}
          />
          <Wall
            position={[130, 138, 30]}
            rotation={[0, -Math.PI / 2, 0]}
            args={[220, 65]}
          />
          <Wall
            position={[130, 50, -85]}
            rotation={[0, -Math.PI / 2, 0]}
            args={[70, 200]}
          />
          <Wall
            position={[130, 50, 135]}
            rotation={[0, -Math.PI / 2, 0]}
            args={[50, 200]}
          />

          {/* GLASS WINDOW with hollow CSG frame */}
          <group position={[130, 70, 30]} rotation={[0, -Math.PI / 2, 0]}>
            {/* Glass Window */}
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[160, 70]} />
              <meshPhysicalMaterial
                color="#88ccff"
                transparent
                opacity={0.05}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>

            {/* Frame bars - metallic */}
            <mesh position={[0, 35, 0]}>
              <boxGeometry args={[168, 4, 1]} />
              <meshStandardMaterial
                color="#2a2a2a"
                metalness={0.95}
                roughness={0.15}
              />
            </mesh>
            <mesh position={[0, -35, 0]}>
              <boxGeometry args={[168, 4, 1]} />
              <meshStandardMaterial
                color="#2a2a2a"
                metalness={0.95}
                roughness={0.15}
              />
            </mesh>
            <mesh position={[-84, 0, 0]}>
              <boxGeometry args={[4, 74, 1]} />
              <meshStandardMaterial
                color="#2a2a2a"
                metalness={0.95}
                roughness={0.15}
              />
            </mesh>
            <mesh position={[84, 0, 0]}>
              <boxGeometry args={[4, 74, 1]} />
              <meshStandardMaterial
                color="#2a2a2a"
                metalness={0.95}
                roughness={0.15}
              />
            </mesh>
          </group>

          {/* LEFT WALL */}
          <Wall
            position={[-130, 50, 30]}
            rotation={[0, Math.PI / 2, 0]}
            args={[220, 160]}
          />

          {/* BACK WALL */}
          <Wall
            position={[0, 50, -80]}
            rotation={[0, 0, 0]}
            args={[260, 160]}
          />

          {/* FRONT WALL */}
          <Wall
            position={[0, 50, 140]}
            rotation={[0, Math.PI, 0]}
            args={[260, 160]}
          />

          {/* NEW PROPS - Strategically placed around room */}
          {/* Door - on front wall */}
          <Door position={[0, 0, 138]} rotation={[0, Math.PI, 0]} scale={35} />

          {/* Couch - left side of room */}
          <Couch
            position={[-100, 0, 35]}
            rotation={[0, Math.PI / 2, 0]}
            scale={0.4}
          />

          {/* Cat - on desk or floor */}
          {/* <Cat
            position={[100, 3, 100]}
            rotation={[0, (-5 * Math.PI) / 6, 0]}
            scale={8}
          /> */}
          <Cat
            position={[-30, 3, -65]}
            rotation={[0, (-Math.PI) / 4, 0]}
            scale={8}
          />

          {/* Electric Box - on left wall */}
          <ElectricBox
            position={[-128, 40, 100]}
            rotation={[0, Math.PI / 2, 0]}
            scale={11}
          />

          {/* Generator - back corner */}
          <Generator
            position={[-90, -7.7, 40]}
            rotation={[0, Math.PI / 4, 0]}
            scale={30}
          />

          {/* Chair - Behind the desk */}
          <Chair
            position={[13, 0, -15]}
            rotation={[0, (-2 * Math.PI) / 3, 0]}
            scale={0.5}
          />

          {/* Noodle Sign - Left side wall */}
          <NoodleSign
            position={[-55, 65, -78]}
            rotation={[0, Math.PI, 0]}
            scale={0.4}
          />

          {/* Hanging Lamp */}
          <LantianLamp
            position={[-55, 39, -48]}
            rotation={[0, (-3 * Math.PI) / 4, 0]}
            scale={45}
          />

          {/* Sci-Fi Lights - Higher with new ceiling */}
          <SciFiLight
            position={[-70, 129, -20]}
            rotation={[Math.PI, 0, 0]}
            scale={0.2}
          />
          <SciFiLight
            position={[70, 129, -20]}
            rotation={[Math.PI, 0, 0]}
            scale={0.2}
          />
          <SciFiLight
            position={[-70, 129, 80]}
            rotation={[Math.PI, 0, 0]}
            scale={0.2}
          />
          <SciFiLight
            position={[70, 129, 80]}
            rotation={[Math.PI, 0, 0]}
            scale={0.2}
          />

          {/* 4 Hanging Lights */}
          {/* <HangingLight position={[-70, 40, -20]} rotation={[0, 0, 0]} scale={6} /> */}
          {/* <HangingLight position={[70, 40, -20]} rotation={[0, 0, 0]} scale={6} /> */}
          {/* <HangingLight position={[-70, 40, 80]} rotation={[0, 0, 0]} scale={6} /> */}
          {/* <HangingLight position={[70, 40, 80]} rotation={[0, 0, 0]} scale={6} /> */}

          {/* 1 Hanging LED in center */}
          <HangingLED position={[0, 113, 30]} rotation={[0, 0, 0]} scale={14} />

          {/* 2 Wall Lights */}
          <WallLight
            position={[121, 65, 120]}
            rotation={[0, -Math.PI / 3, 0]}
            scale={1.45}
          />
          <WallLight
            position={[121, 65, -75]}
            rotation={[0, -Math.PI / 3, 0]}
            scale={1.45}
          />

          {/* Desk - 1.5x bigger, pushed to back wall */}
          <SciFiDesk position={[0, 0, -60]} rotation={[0, 0, 0]} scale={11} />

          {/* Plant - Double size */}
          <PlantPot position={[70, 0, -55]} rotation={[0, 0, 0]} scale={6} />
          <PlantPot position={[-70, 0, -55]} rotation={[0, 0.8, 0]} scale={5} />

          {/* Modular Cable - On back wall, rotated 180 to face front */}
          <ModularCables position={[0, 130, -77]} scale={130} />
          <ModularCables position={[130, 130, -77]} scale={130} />

          {/* Electric Cable - On back wall, flipped upside down */}
          <ElectricCable
            position={[70, 55, -78]}
            rotation={[Math.PI, 0, 0]}
            scale={25}
          />

          <DigitalClock />

          <NeonSign position={[-100, 72, -79]} text="CHAOS" color="#ff9500" />
          <NeonSign position={[100, 72, -79]} text="CODE" color="#7fff00" />

          {/* Ceiling/Roof - Higher with proper material */}
          <mesh
            position={[0, 130, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[260, 300]} />
            <meshStandardMaterial
              color={0x2a2a2a}
              roughness={0.5}
              metalness={0.5}
              depthWrite={true}
              depthTest={true}
            />
          </mesh>

          {/* Ground */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[260, 300]} />
            <meshStandardMaterial
              color={0x1a1a1a}
              roughness={0.6}
              metalness={0.4}
              depthWrite={true}
              depthTest={true}
            />
          </mesh>

          <ambientLight intensity={0.2} color="#ffffff" />

          {/* Boost hemisphere light */}
          <hemisphereLight
            skyColor="#006633"
            groundColor="#002211"
            intensity={1.0}
            position={[0, 80, 0]}
          />

          {/* <CylinderLight
            position={[125, 70, -78]}
            color={0x7fff00}
            intensity={10}
          /> */}
          <CylinderLight
            position={[-125, 70, -78]}
            color={"orange"}
            intensity={11}
          />

          <EffectComposer>
            <Bloom
              mipmapBlur
              luminanceThreshold={0.5}
              levels={6}
              intensity={1.0}
            />
            <ToneMapping mode={0} />
          </EffectComposer>
        </Suspense>

        <OrbitControls
          target={[0, 55, -60]}
          minDistance={distance}
          enableRotate={true}
          enablePan={false}
          enableZoom={false}
          enableDamping={false}
          dampingFactor={0.05}
          maxAzimuthAngle={zoomed ? Math.PI / 8 : Math.PI / 2}
          minAzimuthAngle={zoomed ? -Math.PI / 8 : -Math.PI / 2}
          maxPolarAngle={zoomed ? Math.PI / 2.2 : (2.6 * Math.PI) / 5}
          minPolarAngle={zoomed ? Math.PI / 2.5 : (1.5 * Math.PI) / 5}
          makeDefault
        />
      </Canvas>
    </>
  );
}
