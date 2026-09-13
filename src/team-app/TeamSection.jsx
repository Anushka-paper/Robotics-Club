import React from "react";
import TeamMarquee from "./TeamMarquee";
import TeamCard from "./TeamCard";

/**
 * One category block: "Faculties", "Final Year Members", etc.
 * Small sections (<= 5 members) are rendered as a clean static row
 * without duplicate marquee cards.
 */
export default function TeamSection({ title, members, direction }) {
  if (!members?.length) return null;

  if (members.length <= 5) {
    return (
      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <h2 className="font-heading mb-6 text-lg font-semibold tracking-tight text-[#ECEEF1] md:text-xl">
            {title}
          </h2>
          <div className="flex flex-nowrap overflow-x-auto pb-2 md:pb-0 md:grid md:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 scrollbar-none">
            {members.map((member) => (
              <TeamCard
                key={member.name}
                member={member}
                className="w-40 sm:w-44 md:w-full shrink-0 md:shrink"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <h2 className="font-heading mb-6 text-lg font-semibold tracking-tight text-[#ECEEF1] md:text-xl">
          {title}
        </h2>
      </div>
      <TeamMarquee members={members} direction={direction} />
    </section>
  );
}
