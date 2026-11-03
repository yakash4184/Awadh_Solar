'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function SolarPanelUnit({ position = [0, 0, 0], rotation = [0, 0, 0] }: { position?: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Outer Aluminum Frame */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.04, 1.8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Monocrystalline Deep Blue Silicon Surface */}
      <mesh position={[0, 0.025, 0]}>
        <boxGeometry args={[1.14, 0.015, 1.74]} />
        <meshStandardMaterial
          color="#0f2b5c"
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>
      {/* Photovoltaic Grid Busbars */}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={`h-${i}`} position={[0, 0.035, -0.7 + i * 0.28]}>
          <boxGeometry args={[1.12, 0.005, 0.012]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      ))}
      {[-0.35, 0, 0.35].map((x, i) => (
        <mesh key={`v-${i}`} position={[x, 0.035, 0]}>
          <boxGeometry args={[0.01, 0.005, 1.72]} />
          <meshBasicMaterial color="#7dd3fc" />
        </mesh>
      ))}
      {/* Antireflective coating glass sheen */}
      <mesh position={[0, 0.036, 0]}>
        <planeGeometry args={[1.14, 1.74]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.35}
          roughness={0.05}
          transmission={0.6}
          thickness={0.1}
          color="#60a5fa"
        />
      </mesh>
    </group>
  )
}

export function ProductModel({ kind }: { kind: string }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.4
    }
  })

  if (kind === 'panels') {
    return (
      <group ref={ref} rotation={[0.4, 0.2, 0]}>
        <SolarPanelUnit position={[0, 0, 0]} />
      </group>
    )
  }

  if (kind === 'inverters') {
    return (
      <group ref={ref}>
        {/* Inverter Main Chassis */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[1.2, 1.6, 0.5]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.3} />
        </mesh>
        {/* Front Dark Glass Display Panel */}
        <mesh position={[0, 0.25, 0.26]}>
          <boxGeometry args={[0.9, 0.55, 0.02]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} />
        </mesh>
        {/* LED Status Screen */}
        <mesh position={[0, 0.28, 0.275]}>
          <planeGeometry args={[0.5, 0.18]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
        {/* Glowing Green Power Indicator */}
        <mesh position={[-0.32, 0.28, 0.275]}>
          <circleGeometry args={[0.03, 16]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        {/* Cooling Heat Sink Fins */}
        {[-0.4, -0.2, 0, 0.2, 0.4].map((x, i) => (
          <mesh key={i} position={[x, -0.4, 0.26]}>
            <boxGeometry args={[0.1, 0.35, 0.02]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} />
          </mesh>
        ))}
        {/* Bottom Connectors */}
        {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
          <mesh key={`conn-${i}`} position={[x, -0.85, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.15, 16]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        ))}
      </group>
    )
  }

  // Batteries
  return (
    <group ref={ref}>
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[1.3, 1.2, 0.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Front Accent Panel */}
      <mesh position={[0, 0.1, 0.31]}>
        <boxGeometry args={[1.1, 0.8, 0.02]} />
        <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.2} />
      </mesh>
      {/* LED Battery Level Indicator Bar */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[-0.35 + i * 0.18, 0.1, 0.325]}>
          <boxGeometry args={[0.12, 0.04, 0.01]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      ))}
    </group>
  )
}

function ModernSolarHouse() {
  const houseGroup = useRef<THREE.Group>(null)
  const sunMesh = useRef<THREE.Mesh>(null)
  const sunLight = useRef<THREE.DirectionalLight>(null)

  useFrame(({ clock, pointer }, delta) => {
    if (houseGroup.current) {
      // Gentle responsive mouse tracking
      houseGroup.current.rotation.y = THREE.MathUtils.damp(
        houseGroup.current.rotation.y,
        -0.45 + pointer.x * 0.18,
        3.5,
        delta
      )
      houseGroup.current.rotation.x = THREE.MathUtils.damp(
        houseGroup.current.rotation.x,
        0.08 - pointer.y * 0.08,
        3.5,
        delta
      )
    }

    if (sunMesh.current) {
      sunMesh.current.position.y = 4.8 + Math.sin(clock.elapsedTime * 0.7) * 0.12
    }
  })

  return (
    <>
      {/* Soft Daylight Ambient Lighting */}
      <ambientLight intensity={1.8} color="#e0f2fe" />
      {/* Bright Solar Key Light */}
      <directionalLight
        ref={sunLight}
        position={[6, 9, 5]}
        intensity={3.2}
        color="#fffbeb"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      {/* Electric Blue Secondary Fill */}
      <directionalLight position={[-5, 3, -4]} intensity={1.2} color="#bae6fd" />

      {/* House & Garden Model */}
      <group ref={houseGroup} position={[0.2, -0.6, 0]}>
        {/* Sleek Circular Base Pedestal (Clean Modern Platform) */}
        <mesh position={[0, -0.15, 0]} receiveShadow>
          <cylinderGeometry args={[4.5, 4.3, 0.28, 64]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
        </mesh>
        {/* Subtle Pedestal Outer Ring */}
        <mesh position={[0, -0.14, 0]}>
          <torusGeometry args={[4.45, 0.03, 16, 64]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.5} />
        </mesh>

        {/* Modern Villa Main Body (Clean Architectural White) */}
        <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.8, 2.3, 3.2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} />
        </mesh>

        {/* Upper Accent Terrace / Roof Structure (Modern Slate Trim) */}
        <mesh position={[0, 2.32, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.1, 0.16, 3.5]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} />
        </mesh>

        {/* Angled Solar Mounting Structure on Roof */}
        <group position={[0, 2.5, 0]} rotation={[-0.24, 0, 0]}>
          {/* Aluminum Solar Racks / Rails */}
          {[-1.3, 0, 1.3].map((x, i) => (
            <mesh key={`rail-${i}`} position={[x, 0.02, 0]}>
              <boxGeometry args={[0.06, 0.05, 3.2]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} />
            </mesh>
          ))}

          {/* 6 High-Efficiency Blue Solar Panels */}
          {[-1.3, 0, 1.3].map((x) =>
            [-0.75, 0.75].map((z) => (
              <SolarPanelUnit key={`${x}-${z}`} position={[x, 0.08, z]} />
            ))
          )}
        </group>

        {/* Modern Large Architectural Windows with Blue Sky Reflection */}
        {[-1.1, 1.1].map((x, i) => (
          <group key={`win-${i}`} position={[x, 1.25, 1.62]}>
            <mesh>
              <boxGeometry args={[1.1, 1.2, 0.05]} />
              <meshStandardMaterial color="#0f172a" roughness={0.1} />
            </mesh>
            <mesh position={[0, 0, 0.03]}>
              <planeGeometry args={[1.05, 1.15]} />
              <meshPhysicalMaterial
                color="#7dd3fc"
                transmission={0.4}
                opacity={0.85}
                roughness={0.1}
                metalness={0.3}
              />
            </mesh>
          </group>
        ))}

        {/* Modern Entrance Door */}
        <mesh position={[0, 0.85, 1.62]}>
          <boxGeometry args={[0.75, 1.7, 0.05]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
        <mesh position={[0.26, 0.85, 1.66]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 16]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.9} />
        </mesh>

        {/* Wall-Mounted Solar Inverter System on Side Wall */}
        <group position={[1.93, 1.1, 0.3]} rotation={[0, Math.PI / 2, 0]} scale={0.45}>
          <ProductModel kind="inverters" />
        </group>

        {/* Modern Landscaping (Geometric Green Planters) */}
        {[-2.6, 2.6].map((x, i) => (
          <group key={`planter-${i}`} position={[x, 0.2, i === 0 ? 0.8 : -0.8]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.5, 0.4, 0.5]} />
              <meshStandardMaterial color="#cbd5e1" />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <sphereGeometry args={[0.42, 16, 16]} />
              <meshStandardMaterial color="#10b981" roughness={0.6} />
            </mesh>
          </group>
        ))}

        {/* Glowing Sun in the Sky */}
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <mesh ref={sunMesh} position={[-3.2, 4.6, -2.5]}>
            <sphereGeometry args={[0.65, 32, 32]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
          {/* Sun Outer Glow Rings */}
          <mesh position={[-3.2, 4.6, -2.5]}>
            <torusGeometry args={[0.95, 0.02, 16, 64]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.6} />
          </mesh>
          <mesh position={[-3.2, 4.6, -2.5]}>
            <torusGeometry args={[1.25, 0.015, 16, 64]} />
            <meshBasicMaterial color="#fde68a" transparent opacity={0.35} />
          </mesh>
        </Float>
      </group>
    </>
  )
}

export default function SolarScene({ active = true, kind }: { active?: boolean; kind?: string }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? 'always' : 'never'}
      camera={{
        position: kind ? [2.2, 1.8, 3.2] : [7.2, 5.2, 8.5],
        fov: kind ? 38 : 34,
      }}
      shadows={!kind}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
    >
      {kind ? (
        <>
          <ambientLight intensity={2} color="#f0f7ff" />
          <directionalLight position={[4, 6, 4]} intensity={3.5} color="#ffffff" />
          <directionalLight position={[-3, -2, -2]} intensity={1} color="#38bdf8" />
          <ProductModel kind={kind} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
        </>
      ) : (
        <>
          <ModernSolarHouse />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 4}
            rotateSpeed={0.5}
          />
        </>
      )}
    </Canvas>
  )
}
