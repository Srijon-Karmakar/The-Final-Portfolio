"use client";

import { ContactShadows, Environment, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function DroidModel({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });

  const normalizedScene = useMemo(() => {
    const clonedScene = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);

    clonedScene.position.sub(center);

    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    const targetSize = 2.6;
    const uniformScale = targetSize / maxAxis;

    clonedScene.scale.setScalar(uniformScale);

    const normalizedBox = new THREE.Box3().setFromObject(clonedScene);
    const minY = normalizedBox.min.y;

    clonedScene.position.y -= minY + 0.95;

    return clonedScene;
  }, [scene]);

  useEffect(() => {
    const handlePointerMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handlePointerMove);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
    };
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return;
    }

    smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 2.4 * delta;
    smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 2.4 * delta;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      smoothMouse.current.x * 0.2 - 0.12,
      2.2 * delta
    );

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      smoothMouse.current.y * -0.1 - 0.08,
      2.2 * delta
    );

    groupRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.06;
  });

  return (
    <group ref={groupRef} position={[0, 0.12, 0]}>
      <primitive object={normalizedScene} />
    </group>
  );
}

export function DroidScene({ visible }: { visible: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [modelPath, setModelPath] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const timer = setTimeout(() => setMounted(true), 180);
    return () => clearTimeout(timer);
  }, [visible]);

  useEffect(() => {
    let cancelled = false;

    async function resolveModelPath() {
      try {
        const gltfResponse = await fetch("/droid.gltf", { method: "HEAD" });
        if (!cancelled && gltfResponse.ok) {
          setModelPath("/droid.gltf");
          return;
        }
      } catch {}

      if (!cancelled) {
        setModelPath("/DROID.glb");
      }
    }

    resolveModelPath();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className="hero__model-canvas"
      style={{
        opacity: mounted ? 1 : 0,
        transition: "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)"
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 30 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.1} />
          <directionalLight position={[6, 8, 6]} intensity={1.35} />
          <directionalLight position={[-5, 2, -4]} intensity={0.45} />
          {modelPath ? <DroidModel path={modelPath} /> : null}
          <ContactShadows
            position={[0, -1.7, 0]}
            opacity={0.18}
            scale={5.8}
            blur={2.8}
            far={3}
          />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/DROID.glb");
