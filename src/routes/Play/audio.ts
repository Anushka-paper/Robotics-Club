// Ported from pmndrs/examples "space-game" (src/audio/index.ts).
// Audio elements are module-level singletons; PlayPage stops + rewinds them on
// unmount and sound stays off until the player enables it.
import {
  laserAudio,
  engineAudio,
  engine2Audio,
  bgAudio,
  warpAudio,
  clickAudio,
  explosionAudio,
} from "../../assets/game";

const mp3 = { explosion: explosionAudio };

// `Audio` is a browser-only global; guard module-level construction so this
// file can still be imported during server-side rendering.
const makeAudio = (src: string) =>
  typeof window === "undefined" ? ({} as HTMLAudioElement) : new Audio(src);

const zap = makeAudio(laserAudio);
const engine = makeAudio(engineAudio);
const engine2 = makeAudio(engine2Audio);
const bg = makeAudio(bgAudio);
const warp = makeAudio(warpAudio);
const click = makeAudio(clickAudio);
const explosion = makeAudio(explosionAudio);

/** Every looping/background element that must be silenced on unmount. */
const persistent = [zap, engine, engine2, bg, warp, click, explosion];

export { zap, engine, engine2, bg, warp, click, explosion, mp3, persistent };
