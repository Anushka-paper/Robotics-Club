import { Suspense, useEffect, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Model from "./Model";

type SceneProps = {
  scroll: RefObject<number>;
  eventSource: RefObject<HTMLElement | null>;
  small: boolean;
  onReady: () => void;
};

/** Mounts only after the Suspense boundary resolves (model + environment loaded). */
function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => onReady(), [onReady]);
  return null;
}

export default function Scene({ scroll, eventSource, small, onReady }: SceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      eventSource={eventSource as RefObject<HTMLElement>}
      eventPrefix="client"
      style={{ position: "fixed", inset: 0 }}
    >
      <ambientLight intensity={Math.PI} />
      <Suspense fallback={null}>
        <Model scroll={scroll} shadowMapSize={small ? 512 : 1024} />
        <Environment preset="city" />
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
