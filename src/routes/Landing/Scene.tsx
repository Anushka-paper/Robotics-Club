import { Suspense, useEffect, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
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
      <directionalLight position={[5, 10, 5]} intensity={1.5} />
      <directionalLight position={[-5, -10, -5]} intensity={0.5} />
      <Suspense fallback={null}>
        <Model scroll={scroll} shadowMapSize={small ? 512 : 1024} />
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
