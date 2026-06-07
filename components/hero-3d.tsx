"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

/* Orbiting data nodes around the crystal. */
function Nodes() {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.25;
  });
  const nodes = [
    [2.3, 0.2, 0],
    [-1.8, 1.1, 0.6],
    [0.4, -2.1, -0.5],
    [1.5, 1.6, -1],
    [-1.2, -1.3, 1],
  ] as const;
  return (
    <group ref={group}>
      {nodes.map((p, i) => (
        <mesh key={i} position={p as unknown as [number, number, number]}>
          <sphereGeometry args={[0.09, 24, 24]} />
          <meshStandardMaterial
            color={i % 2 ? "#ca8a04" : "#38bdf8"}
            emissive={i % 2 ? "#ca8a04" : "#38bdf8"}
            emissiveIntensity={0.5}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function Crystal() {
  const group = useRef<THREE.Group>(null);
  const cage = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.12;
      // parallax toward pointer
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        state.pointer.y * 0.35,
        0.05
      );
      group.current.position.x = THREE.MathUtils.lerp(
        group.current.position.x,
        state.pointer.x * 0.4,
        0.05
      );
    }
    if (cage.current) cage.current.rotation.y -= delta * 0.2;
  });

  return (
    <group ref={group}>
      <Float speed={1.6} rotationIntensity={0.5} floatIntensity={1.1}>
        {/* core crystal */}
        <mesh>
          <sphereGeometry args={[1.5, 64, 64]} />
          <MeshDistortMaterial
            color="#1e3a8a"
            distort={0.38}
            speed={1.8}
            roughness={0.12}
            metalness={0.55}
          />
        </mesh>
        {/* gold orbital cage */}
        <mesh ref={cage} scale={1.42}>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshBasicMaterial color="#ca8a04" wireframe transparent opacity={0.22} />
        </mesh>
      </Float>
      <Nodes />
    </group>
  );
}

export function Hero3D() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={2.4} />
      <directionalLight position={[-5, -2, 2]} intensity={1.6} color="#0369a1" />
      <directionalLight position={[2, -4, -3]} intensity={1.1} color="#ca8a04" />
      <Crystal />
      <Sparkles count={70} scale={7} size={3} speed={0.4} opacity={0.6} color="#ca8a04" />
    </Canvas>
  );
}
