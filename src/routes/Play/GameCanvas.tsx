// Ported from pmndrs/examples "space-game" (src/App.tsx).
// Changes: pointer/click wiring moved up to PlayPage (touch + pause handling),
// Stars count reduced on small screens, dpr cap kept at [1, 1.5].
import * as THREE from "three";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Stars from "./3d/Stars";
import Planets from "./3d/Planets";
import Effects from "./3d/Effects";
import Particles from "./3d/Particles";
import Enemies from "./3d/Enemies";
import Rocks from "./3d/Rocks";
import Explosions from "./3d/Explosions";
import Rings from "./3d/Rings";
import Track from "./3d/Track";
import Ship from "./3d/Ship";
import Rig from "./3d/Rig";
import useStore from "./store";

export default function GameCanvas({ small }: { small: boolean }) {
  const { fov } = useStore((state) => state.mutation);
  const init = useStore((state) => state.actions.init);
  return (
    <Canvas
      linear
      dpr={[1, 1.5]}
      gl={{ antialias: false }}
      camera={{ position: [0, 0, 2000], near: 0.01, far: 10000, fov }}
      onCreated={({ gl, camera }) => {
        init(camera);
        gl.toneMapping = THREE.NoToneMapping;
        gl.setClearColor(new THREE.Color("#020209"));
      }}
      style={{ position: "fixed", inset: 0 }}
    >
      <fog attach="fog" args={["#070710", 100, 700]} />
      <ambientLight intensity={0.25 * Math.PI} />
      <Stars count={small ? 1000 : 2000} />
      <Explosions />
      <Track />
      <Particles />
      <Rings />
      <Suspense fallback={null}>
        <Rocks />
        <Planets />
        <Enemies />
        <Rig>
          <Ship />
        </Rig>
      </Suspense>
      <Effects />
    </Canvas>
  );
}
