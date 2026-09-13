import React from "react";
import TeamCard from "./TeamCard";

/**
 * Horizontally auto-scrolling row of TeamCards.
 * - Pure CSS animation (see styles/team.css) — no JS needed to run it.
 * - The member list is rendered twice back-to-back so the strip can
 *   loop with no visible seam; the second copy is aria-hidden so
 *   screen readers only hear each member once.
 * - Pauses on hover AND on keyboard focus (`:focus-within`), so it's
 *   comfortable to inspect a card with a mouse or a keyboard.
 * - `speed` is in seconds for one full loop of ONE copy of the list;
 *   it defaults to scaling with the number of members so every
 *   section feels like the same speed per card.
 */
export default function TeamMarquee({ members, direction = "left", speed }) {
  const duration = speed ?? Math.max(members.length * 4, 18);
  const track = [...members, ...members];

  return (
    <div
      className="team-marquee relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
    >
      <div
        className="team-marquee-track flex w-max gap-4 px-4 md:px-8"
        style={{
          "--marquee-duration": `${duration}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {track.map((member, i) => (
          <TeamCard
            key={`${member.name}-${i}`}
            member={member}
            aria-hidden={i >= members.length ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  );
}
