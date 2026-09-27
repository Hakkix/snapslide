'use client';

import { Suspense, useMemo, useRef, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { DEFAULT_IMAGE } from '@/lib/puzzle';
import { getAdjacentPositions } from '@/stores/gameStore';

const GRID = 4;
const SIZE = 1;
const GAP = 0.08;
const DEPTH = 0.28;
const STEP_SECONDS = 1.15;

function slotToXY(slot: number): [number, number] {
  const col = slot % GRID;
  const row = Math.floor(slot / GRID);
  const offset = (GRID - 1) / 2;
  return [(col - offset) * (SIZE + GAP), (offset - row) * (SIZE + GAP)];
}

// Deterministic pseudo-random per tile, so the "explode" pose is stable.
const seeded = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

type SceneProps = { progress: RefObject<number>; animate: boolean };

function Board({ progress, animate }: SceneProps) {
  const texture = useTexture(DEFAULT_IMAGE);
  const { viewport, pointer } = useThree();
  const root = useRef<THREE.Group>(null);
  const tileRefs = useRef<(THREE.Group | null)[]>([]);

  // One texture clone per tile, each cropped to its slice of the artwork.
  const slices = useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    return Array.from({ length: GRID * GRID - 1 }, (_, i) => {
      const t = texture.clone();
      t.repeat.set(1 / GRID, 1 / GRID);
      t.offset.set((i % GRID) / GRID, 1 - (Math.floor(i / GRID) + 1) / GRID);
      t.needsUpdate = true;
      return t;
    });
  }, [texture]);

  // Live puzzle state: slots[tile] = slot. Mutated in the frame loop, never rendered.
  const state = useRef({
    slots: Array.from({ length: GRID * GRID - 1 }, (_, i) => i),
    empty: GRID * GRID - 1,
    lastEmpty: -1,
    clock: 0,
  });

  useFrame((_, delta) => {
    const s = state.current;
    const p = progress.current ?? 0;
    const dt = Math.min(delta, 1 / 20);

    if (animate) {
      s.clock += dt;
      if (s.clock > STEP_SECONDS) {
        s.clock = 0;
        const options = getAdjacentPositions(s.empty, GRID).filter((slot) => slot !== s.lastEmpty);
        const target = options[Math.floor(Math.random() * options.length)];
        const tile = s.slots.indexOf(target);
        s.slots[tile] = s.empty;
        s.lastEmpty = s.empty;
        s.empty = target;
      }
    }

    tileRefs.current.forEach((g, i) => {
      if (!g) return;
      const [x, y] = slotToXY(s.slots[i]);
      const burst = p * p;
      const tx = x * (1 + burst * 0.9);
      const ty = y * (1 + burst * 0.9);
      const tz = burst * (seeded(i, 1) * 5 - 1.5);
      g.position.x = THREE.MathUtils.damp(g.position.x, tx, 9, dt);
      g.position.y = THREE.MathUtils.damp(g.position.y, ty, 9, dt);
      g.position.z = THREE.MathUtils.damp(g.position.z, tz, 6, dt);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, burst * (seeded(i, 2) - 0.5) * 2.4, 6, dt);
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, burst * (seeded(i, 3) - 0.5) * 2.4, 6, dt);
    });

    if (root.current) {
      const tiltX = animate ? -pointer.y * 0.25 : 0;
      const tiltY = animate ? pointer.x * 0.35 : 0;
      root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, tiltX - 0.18, 4, dt);
      root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, tiltY - 0.32, 4, dt);
    }
  });

  const scale = Math.min(1, viewport.width / 5.4);

  return (
    <group ref={root} scale={scale}>
      {slices.map((map, i) => {
        const [x, y] = slotToXY(i);
        return (
          <group key={i} position={[x, y, 0]} ref={(g) => { tileRefs.current[i] = g; }}>
            <RoundedBox args={[SIZE, SIZE, DEPTH]} radius={0.07} smoothness={4}>
              <meshStandardMaterial color="#14141d" metalness={0.7} roughness={0.35} />
            </RoundedBox>
            <mesh position={[0, 0, DEPTH / 2 + 0.002]}>
              <planeGeometry args={[SIZE * 0.9, SIZE * 0.9]} />
              <meshStandardMaterial map={map} roughness={0.45} metalness={0.05} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default function HeroScene({ progress, animate, active }: SceneProps & { active: boolean }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 7.5], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 6]} intensity={1.6} />
      <pointLight position={[-5, -2, 3]} intensity={30} color="#667eea" />
      <pointLight position={[5, 3, 2]} intensity={24} color="#f093fb" />
      <Suspense fallback={null}>
        <Board progress={progress} animate={animate} />
      </Suspense>
    </Canvas>
  );
}
