import React from "react";

/**
 * Single member card: portrait + name + role + department.
 * - Image is grayscale by default, transitions to color on hover/focus
 *   (see styles/team.css for `.team-card-image`).
 * - Falls back to a generated initials avatar if the real photo
 *   hasn't been added yet, so the layout never breaks.
 */
export default function TeamCard({ member, "aria-hidden": ariaHidden, className = "" }) {
  const { name, role, department, image } = member;

  const fallback = `https://ui-avatars.com/api/?background=1B1F27&color=C97C3E&bold=true&size=256&name=${encodeURIComponent(
    name
  )}`;

  return (
    <article
      className={`team-card group relative select-none overflow-hidden rounded-xl border border-[#23272F] bg-[#14171D] flex flex-col justify-between ${className || "w-40 shrink-0 sm:w-48 md:w-52 lg:w-56"}`}
      tabIndex={ariaHidden ? -1 : 0}
      aria-hidden={ariaHidden}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#1B1F27]">
        <img
          src={image}
          alt={`Portrait of ${name}`}
          loading="lazy"
          className="team-card-image h-full w-full object-cover object-top"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallback;
          }}
        />
      </div>

      <div className="min-h-[5.5rem] px-3.5 py-3 flex-1 flex flex-col justify-between">
        <div>
          <p
            className="line-clamp-2 text-sm font-semibold leading-snug text-[#ECEEF1]"
            title={name}
          >
            {name}
          </p>
          <p className="mt-1 line-clamp-1 text-xs text-[#C97C3E]" title={role}>
            {role}
          </p>
        </div>
        {department ? (
          <p
            className="mt-1 line-clamp-1 text-[11px] text-[#9BA1AC]"
            title={department}
          >
            {department}
          </p>
        ) : null}
      </div>
    </article>
  );
}
