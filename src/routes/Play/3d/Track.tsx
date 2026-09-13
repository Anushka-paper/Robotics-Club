// Ported verbatim from pmndrs/examples "space-game" (src/3d/Track.tsx).
import useStore from "../store";

export default function Track() {
  const { scale, track } = useStore((state) => state.mutation);
  return (
    <mesh scale={[scale, scale, scale]} geometry={track}>
      <meshBasicMaterial color="indianred" />
    </mesh>
  );
}
