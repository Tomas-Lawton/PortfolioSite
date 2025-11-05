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
  useProgress,
  Reflector,
  SpotLightHelper,
} from "@react-three/drei";
import { stagger } from "../../animations";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
  Vignette,
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

const handleCatClick = () => {
  const audio = new Audio("/cat.mp3");
  audio.play();
};

const handleCoffeeClick = () => {
  const audio = new Audio("/slurp.mp3");
  audio.play();
};

const handleLampClick = (setLampOn) => {
  const audio = new Audio("/light-switch.mp3");
  audio.play();
  setLampOn((prev) => !prev);
};

// Cyberpunk particles with varied colors
function Particles({ position = [0, 55, -60], spread = 40 }) {
  const count = 20;
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread + position[0]; // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread + position[1]; // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread + position[2]; // Z

      // Cyberpunk color palette: cyan, magenta, blue, purple
      const colorChoice = Math.random();
      if (colorChoice < 0.35) {
        // Cyan
        col[i * 3] = 0.0;
        col[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        col[i * 3 + 2] = 1.0;
      } else if (colorChoice < 0.65) {
        // Magenta/Pink
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.0;
        col[i * 3 + 2] = 0.6 + Math.random() * 0.4;
      } else if (colorChoice < 0.85) {
        // Electric Blue
        col[i * 3] = 0.2;
        col[i * 3 + 1] = 0.4 + Math.random() * 0.3;
        col[i * 3 + 2] = 1.0;
      } else {
        // Purple
        col[i * 3] = 0.6 + Math.random() * 0.4;
        col[i * 3 + 1] = 0.0;
        col[i * 3 + 2] = 1.0;
      }
    }
    return { positions: pos, colors: col };
  }, [position, spread]);

  const pointsRef = useRef();

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

function Poster({ position, rotation, scale = 1 }) {
  const { scene } = useGLTF("/posters.glb");
  return (
    <primitive
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

function Cat({ position, rotation, scale = 1, zoomed = false, catRef }) {
  const { scene } = useGLTF("/cat.glb");
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  return (
    <group ref={catRef} position={position} rotation={rotation} scale={scale}>
      <primitive
        object={clonedScene}
        onClick={() => {
          if (!zoomed) {
            handleCatClick();
          }
        }}
      />
    </group>
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
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  return (
    <primitive
      object={clonedScene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

function LantianLamp({
  position,
  rotation,
  scale = 1,
  zoomed = false,
  lampRef,
  onClick,
}) {
  const { scene } = useGLTF("/lamp.glb");
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  return (
    <group ref={lampRef} position={position} rotation={rotation} scale={scale}>
      <primitive
        object={clonedScene}
        onClick={(e) => {
          e.stopPropagation();
          if (!zoomed && onClick) {
            onClick();
          }
        }}
        onPointerOver={() => {
          if (!zoomed) {
            document.body.style.cursor = "pointer";
          }
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      />
    </group>
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

// function HangingLED({ position, rotation, scale = 1 }) {
//   const { scene } = useGLTF("/hangingled.glb");
//   return (
//     <primitive
//       object={scene.clone()}
//       position={position}
//       rotation={rotation}
//       scale={scale}
//     />
//   );
// }

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
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  return (
    <primitive
      object={clonedScene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

function Chair({ position, rotation, scale = 1 }) {
  const { scene } = useGLTF("/chair.glb");
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  return (
    <primitive
      object={clonedScene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

function CoffeeCup({
  position,
  rotation,
  scale = 1,
  zoomed = false,
  coffeeRef,
}) {
  const { scene } = useGLTF("/coffee.glb");
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  return (
    <group ref={coffeeRef}>
      <primitive
        object={clonedScene}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={() => {
          if (!zoomed) {
            handleCoffeeClick();
          }
        }}
      />
    </group>
  );
}

function Bed({ position, rotation, scale = 1 }) {
  const { scene } = useGLTF("/bed.glb");
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  return (
    <primitive
      object={clonedScene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

function Table({ position, rotation, scale = 1 }) {
  const { scene } = useGLTF("/table.glb");
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  return (
    <primitive
      object={clonedScene}
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
      if (!props.zoomed) {
        objectsToIntersect.push(computerMeshRef.current);

        if (props.catRef?.current) {
          objectsToIntersect.push(props.catRef.current);
        }
        if (props.coffeeRef?.current) {
          objectsToIntersect.push(props.coffeeRef.current);
        }
        if (props.lampRef?.current) {
          objectsToIntersect.push(props.lampRef.current);
        }
      }

      const intersects = raycaster.intersectObjects(objectsToIntersect, true);
      document.body.style.cursor =
        intersects.length > 0 ? "pointer" : "default";
    },
    [camera, mouse, raycaster, props.zoomed, props.catRef, props.lampRef]
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
            handleMouseClick();
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

// function Wall({ position, rotation, args, color = 0x2a2a2a }) {
//   return (
//     <mesh position={position} rotation={rotation} receiveShadow>
//       <planeGeometry args={args} />
//       <meshStandardMaterial
//         color={color}
//         roughness={3}
//         metalness={0.4}
//         emissive={0x0a0a0a}
//         emissiveIntensity={0.3}
//       />
//     </mesh>
//   );
// }

function Wall({ position, rotation, args, color = 0x2a2a2a }) {
  const [colorMap, normalMap, roughnessMap] = useTexture([
    "/textures/concrete-color.jpg",
    "/textures/concrete-normal.jpg",
    "/textures/concrete-roughness.jpg",
  ]);

  // Clone textures to set different repeat values per instance
  const clonedColor = useMemo(() => colorMap.clone(), [colorMap]);
  const clonedNormal = useMemo(() => normalMap.clone(), [normalMap]);
  const clonedRoughness = useMemo(() => roughnessMap.clone(), [roughnessMap]);

  useEffect(() => {
    [clonedColor, clonedNormal, clonedRoughness].forEach((texture) => {
      if (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4); // Adjust for walls
        texture.needsUpdate = true;
      }
    });
  }, [clonedColor, clonedNormal, clonedRoughness]);

  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <planeGeometry args={args} />
      <meshStandardMaterial
        map={clonedColor}
        normalMap={clonedNormal}
        normalScale={[0.3, 0.3]}
        roughnessMap={clonedRoughness}
        roughness={0.5}
        metalness={0.85}
        emissive={0x1a1a1a}
        emissiveIntensity={0.15}
        envMapIntensity={1.5}
        color="#e0e0e0"
      />
    </mesh>
  );
}

function ReflectiveFloor() {
  const [colorMap, normalMap, roughnessMap] = useTexture([
    "/textures/concrete-color.jpg",
    "/textures/concrete-normal.jpg",
    "/textures/concrete-roughness.jpg",
  ]);

  [colorMap, normalMap, roughnessMap].forEach((texture) => {
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(3, 3); // Try 8, 10, 12 - lower = bigger tiles
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.05, 0]}>
      <planeGeometry args={[260, 300]} />
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        normalScale={[0.5, 0.5]} // Add this - controls bump intensity
        roughnessMap={roughnessMap}
        roughness={0.3} // Slightly more reflective
        metalness={0.4} // Slightly more metallic for reflections
        envMapIntensity={1.2}
        color="#ffffff" // Add this - brightens texture
      />
    </mesh>
  );
}

function CylinderLight({
  position,
  color,
  length = 5,
  intensity = 8,
  rotation = [0, Math.PI / 2, 0],
}) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.2 + 1;
      meshRef.current.material.emissiveIntensity = intensity * pulse;
    }
  });

  return (
    <mesh ref={meshRef} scale={10} position={position} rotation={rotation}>
      <cylinderGeometry args={[0.1, 0.1, length]} />
      <meshStandardMaterial
        emissiveIntensity={intensity}
        color={color}
        emissive={color}
        depthWrite={true}
        depthTest={true}
      />
    </mesh>
  );
}

function PulsingDirectionalLight({
  position,
  color,
  baseIntensity = 2,
  speed = 1.5,
  pulseAmount = 0.3,
  phase = 0,
  ...props
}) {
  const lightRef = useRef();

  useFrame((state) => {
    if (lightRef.current) {
      const pulse =
        Math.sin(state.clock.elapsedTime * speed + phase) * pulseAmount + 1;
      lightRef.current.intensity = baseIntensity * pulse;
    }
  });

  return (
    <directionalLight
      ref={lightRef}
      position={position}
      intensity={baseIntensity}
      color={color}
      {...props}
    />
  );
}

function LampLight({ position, targetY = 0 }) {
  const spotLightRef = useRef();

  useEffect(() => {
    if (spotLightRef.current) {
      spotLightRef.current.target.position.set(
        position[0],
        targetY,
        position[2]
      );
      spotLightRef.current.target.updateMatrixWorld();
    }
  }, [position, targetY]);

  return (
    <spotLight
      ref={spotLightRef}
      position={position}
      angle={1}
      penumbra={0.4}
      intensity={120}
      distance={100}
      decay={1.2}
      color="#ffb366"
      castShadow
    />
  );
}

export default function Scene() {
  const textOn = useRef();
  const textOne = useRef();
  const canvasRef = useRef();
  const catRef = useRef();
  const coffeeRef = useRef();
  const lampRef = useRef();
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
  const [lampOn, setLampOn] = useState(false);

  const { progress } = useProgress();
  const isLoaded = progress === 100;

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
                {/* <div
                  className="control minimize cursor-pointer"
                  onClick={() => setShowTerminal(false)}
                ></div> */}
                {/* <div
                  className="control maximize cursor-pointer"
                  onClick={() => setShowTerminal(false)}
                ></div> */}
              </div>
            </div>

            {!isLoaded ? (
              <>
                <div className="mt-4 tek text-green-400">
                  <span ref={textOn} style={{ color: "#ff00ff" }}>
                    &gt;
                  </span>{" "}
                  INITIALIZING SYSTEM...
                </div>
                <div className="mt-2 tek text-green-400">
                  <span className="text-green-400">&gt;</span> LOADING 3D
                  ENVIRONMENT... {Math.round(progress)}%
                </div>
                <div className="mt-3 mb-3">
                  <div className="tek text-gray-500 text-xs mb-1">
                    [PROGRESS]
                  </div>
                  <div className="w-full h-5 bg-black border border-green-400 relative shadow-[0_0_10px_rgba(0,255,65,0.3)]">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-lime-300 transition-all duration-300 shadow-[0_0_10px_rgba(0,255,65,0.8)]"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mt-2 tek text-green-400">
                  <span className="text-green-400">&gt;</span> PLEASE WAIT...
                </div>
              </>
            ) : (
              <>
                <div className="mt-4 tek text-green-400">Loading...</div>
                <div ref={textOne} className="mt-2 tek text-green-400">
                  LOGIN COMPLETE.
                </div>
                <div ref={textOne} className="text tek text-green-400 mt-3">
                  <span style={{ color: "#ff00ff" }}>&gt;</span> Click on
                  objects to explore...
                </div>
                <div className="mt-4 tek text-gray-500 text-sm">
                  Made by Tommy.
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Canvas
        ref={canvasRef}
        frameloop="always" // Continuous rendering for smooth animations
        camera={{ position: cameraPosition }}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          depth: true,
          powerPreference: "high-performance",
        }}
        performance={{ min: 0.5, max: 1 }}
        dpr={[1, 1.5]}
        style={{ zIndex: 0 }}
      >
        <UpdateCameraPosition position={cameraPosition} />
        <fog attach="fog" args={["#2a2a2a", 200, 350]} />
        <ambientLight intensity={0.5} />

        <Suspense fallback={null}>
          <group
            castShadow
            rotation={[Math.PI / 2, Math.PI, Math.PI]}
            position={[0, 40.5, -62]}
          >
            <Model
              zoomed={zoomed}
              toggleZoom={toggleZoom}
              catRef={catRef}
              coffeeRef={coffeeRef}
              lampRef={lampRef}
            />
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

            {/* Frame bars - metallic - top and bottom */}
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

            {/* Left and right vertical bars */}
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

            {/* Vertical bars - evenly spaced */}
            <mesh position={[-28, 0, 0]}>
              <boxGeometry args={[2, 74, 1]} />
              <meshStandardMaterial
                color="#2a2a2a"
                metalness={0.95}
                roughness={0.15}
              />
            </mesh>
            <mesh position={[28, 0, 0]}>
              <boxGeometry args={[2, 74, 1]} />
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
          <Door
            position={[-60, 0, 138]}
            rotation={[0, Math.PI, 0]}
            scale={35}
          />

          {/* Couch - left side of room */}
          <Couch
            position={[-100, 0, 35]}
            rotation={[0, Math.PI / 2, 0]}
            scale={0.4}
          />

          {/* Table - in front of couch */}
          <Table
            position={[-54, 0, 35]}
            rotation={[0, Math.PI / 2, 0]}
            scale={5}
          />

          {/* Bed - by window against back wall */}
          <Bed
            position={[100, -13, 87]}
            rotation={[0, Math.PI, 0]}
            scale={0.5}
          />

          {/* Poster - above couch on left wall */}
          <Poster position={[-128, 60, 35]} rotation={[0, 0, 0]} scale={25} />

          {/* Cat - on desk or floor */}
          <Cat
            position={[-30, 3, -65]}
            rotation={[0, -Math.PI / 4, 0]}
            scale={8}
            zoomed={zoomed}
            catRef={catRef}
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
            zoomed={zoomed}
            lampRef={lampRef}
            onClick={() => handleLampClick(setLampOn)}
          />

          {/* Lamp Light - Warm spotlight cone when lamp is on */}
          {lampOn && <LampLight position={[-28, 60, -57]} targetY={0} />}

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

          {/* 1 Hanging LED in center */}
          {/* <HangingLED position={[0, 113, 30]} rotation={[0, 0, 0]} scale={14} /> */}

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

          {/* Coffee Cup - On desk to right of monitor */}
          <CoffeeCup
            position={[30, 40.5, -60]}
            rotation={[0, 0, 0]}
            scale={8}
            zoomed={zoomed}
            coffeeRef={coffeeRef}
          />

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

          <NeonSign position={[-100, 72, -79]} text="CHAOS" color="#ff0099" />
          <NeonSign position={[100, 72, -79]} text="CODE" color="#00ffff" />

          {/* Ceiling */}
          <Wall
            position={[0, 130, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            args={[260, 300]}
            color={0x2a2a2a}
          />

          {/* Ground */}
          <Wall
            position={[0, 0, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            args={[260, 300]}
            color={0x1a1a1a}
          />

          <ReflectiveFloor />

          {/* LIGHTS */}
          <PulsingDirectionalLight
            position={[130, 60, 30]}
            baseIntensity={2.5}
            speed={0.25}
            pulseAmount={0.3}
            color="#ff00aa"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={300}
            shadow-camera-left={-100}
            shadow-camera-right={100}
            shadow-camera-top={100}
            shadow-camera-bottom={-100}
            shadow-bias={-0.0001}
          />

          <PulsingDirectionalLight
            position={[50, 80, 40]}
            baseIntensity={0.6}
            speed={0.3}
            pulseAmount={0.5}
            phase={2.3}
            color="#00d4ff"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={300}
            shadow-camera-left={-100}
            shadow-camera-right={100}
            shadow-camera-top={100}
            shadow-camera-bottom={-100}
            shadow-bias={-0.0001}
          />

          {/* Cyberpunk cyan/magenta cylinder lights */}
          <CylinderLight
            position={[125, 110, 30]}
            color={0x00ffff}
            length={15}
            rotation={[0, Math.PI / 2, Math.PI / 2]}
            intensity={5}
          />
          <CylinderLight
            position={[125, 30, 30]}
            color={0xff00ff}
            length={15}
            rotation={[0, Math.PI / 2, Math.PI / 2]}
            intensity={5}
          />
          <CylinderLight
            position={[-125, 110, 30]}
            rotation={[Math.PI / 2, 0, 0]}
            color={0x9d00ff}
            length={8}
            intensity={12}
          />
          <CylinderLight
            position={[-125, 70, -78]}
            color={0xff1493}
            intensity={5}
          />

          {/* Bloom effect */}
          <EffectComposer>
            <Bloom
              mipmapBlur
              luminanceThreshold={0.4}
              levels={7}
              intensity={1.1}
            />
            <Vignette offset={0.3} darkness={0.35} />
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
