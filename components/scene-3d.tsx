"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export type Variant = "knot" | "rings" | "prism" | "field";

/* Group that auto-rotates and (optionally) parallaxes toward the cursor. */
function Rig({
  children,
  interactive,
}: {
  children: React.ReactNode;
  interactive: boolean;
}) {
  const g = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!g.current) return;
    g.current.rotation.y += delta * 0.12;
    if (interactive) {
      g.current.rotation.x = THREE.MathUtils.lerp(
        g.current.rotation.x,
        state.pointer.y * 0.3,
        0.05
      );
      g.current.position.x = THREE.MathUtils.lerp(
        g.current.position.x,
        state.pointer.x * 0.35,
        0.05
      );
    }
  });
  return <group ref={g}>{children}</group>;
}

function Knot() {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh>
        <torusKnotGeometry args={[1, 0.32, 220, 32]} />
        <MeshDistortMaterial
          color="#1e3a8a"
          distort={0.18}
          speed={1.4}
          metalness={0.6}
          roughness={0.15}
        />
      </mesh>
    </Float>
  );
}

function Rings() {
  const g = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (g.current) g.current.rotation.z += d * 0.25;
  });
  const conf = [
    { r: 1.5, c: "#1e3a8a", e: "#0369a1", rot: [1.4, 0.2, 0] },
    { r: 1.18, c: "#ca8a04", e: "#ca8a04", rot: [0.6, 1.1, 0.3] },
    { r: 0.86, c: "#0369a1", e: "#0369a1", rot: [1.0, 0.5, 1.2] },
  ];
  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={1}>
      <group ref={g}>
        {conf.map((k, i) => (
          <mesh key={i} rotation={k.rot as unknown as [number, number, number]}>
            <torusGeometry args={[k.r, 0.055, 16, 120]} />
            <meshStandardMaterial
              color={k.c}
              emissive={k.e}
              emissiveIntensity={0.2}
              metalness={0.6}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function Prism() {
  const cage = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (cage.current) cage.current.rotation.y -= d * 0.2;
  });
  return (
    <Float speed={1.6} rotationIntensity={0.6} floatIntensity={1.1}>
      <mesh>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial
          color="#1e3a8a"
          flatShading
          metalness={0.5}
          roughness={0.25}
        />
      </mesh>
      <mesh ref={cage} scale={1.28}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial color="#ca8a04" wireframe transparent opacity={0.3} />
      </mesh>
    </Float>
  );
}

function Field() {
  const items = [
    { p: [-2, 1.2, -1], s: 0.5, c: "#1e3a8a" },
    { p: [2.2, 0.6, -0.5], s: 0.42, c: "#0369a1" },
    { p: [-1.4, -1.5, 0.5], s: 0.36, c: "#ca8a04" },
    { p: [1.6, -1.2, -1.2], s: 0.46, c: "#1e3a8a" },
    { p: [0.2, 1.8, -1.5], s: 0.32, c: "#0369a1" },
    { p: [-2.4, -0.4, -1], s: 0.3, c: "#ca8a04" },
  ];
  return (
    <>
      {items.map((it, i) => (
        <Float key={i} speed={1.2 + i * 0.1} rotationIntensity={1} floatIntensity={1.4}>
          <mesh position={it.p as unknown as [number, number, number]}>
            <icosahedronGeometry args={[it.s, 0]} />
            <meshStandardMaterial
              color={it.c}
              flatShading
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

const VARIANTS: Record<Variant, () => React.ReactNode> = {
  knot: Knot,
  rings: Rings,
  prism: Prism,
  field: Field,
};

export function Scene3D({
  variant,
  interactive = false,
}: {
  variant: Variant;
  interactive?: boolean;
}) {
  const Obj = VARIANTS[variant];
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[5, 5, 5]} intensity={2.2} />
      <directionalLight position={[-5, -2, 2]} intensity={1.5} color="#0369a1" />
      <directionalLight position={[2, -4, -3]} intensity={1} color="#ca8a04" />
      <Rig interactive={interactive}>
        <Obj />
      </Rig>
      <Sparkles count={50} scale={8} size={2.5} speed={0.35} opacity={0.5} color="#ca8a04" />
    </Canvas>
  );
}
