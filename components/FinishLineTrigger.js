import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useRef } from "react";

export default function FinishLineTrigger({ position = [0, 3.25, 0], size = [40, 8, 0.2], onCross }) {
  const lastCrossTime = useRef(0);

  return (
    <RigidBody type="fixed" colliders={false} position={position}>
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial color="lime" transparent opacity={0.3} />
      </mesh>
      <CuboidCollider
        args={size.map(s => s / 2)} // half-extents
        sensor
        onIntersectionEnter={({ other }) => {
          const now = performance.now();
          const name = other.rigidBodyObject?.name;
          console.log("🚦 Trigger hit! Body name:", name); // Debug log

          // Only trigger if cooldown has passed and it's the player
          if (name === "playerKart" && now - lastCrossTime.current > 3000) {
            lastCrossTime.current = now;
            console.log("🏁 Finish line crossed!");
            onCross();
          }
        }}
      />
    </RigidBody>
  );
}






