import { useRouter } from "next/navigation";
import { InteractiveTravelCard } from "./ui/3d-card";

export default function PageCards() {
  const router = useRouter();

  return (
    <div className="relative w-full py-24 md:py-32">
      
      {/* SECTION HEADING */}
      <div className="relative z-10 container mx-auto px-6 mb-16 md:mb-24 text-center flex flex-col items-center">
        <span className="text-[11px] font-bold tracking-[0.2em] text-[#f5a524] mb-4 uppercase font-['Inter']">
          // ROBOTICS CLUB
        </span>
        <h2 className="text-[32px] md:text-[44px] font-bold text-[#e7e6e2] tracking-tight uppercase font-['Space_Grotesk'] leading-tight">
          INSIDE ROBOTICS CLUB
        </h2>
        <p className="text-[15px] md:text-[18px] text-[#9a9b9e] mt-4 tracking-wide font-medium font-['Inter']">
          People. Projects. Competitions. Innovation.
        </p>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row flex-wrap items-center justify-center gap-8 md:gap-12 px-6">
        <div style={{ perspective: "1000px" }}>
          <InteractiveTravelCard
            title="THE TEAM"
            subtitle="Meet the builders"
            imageUrl="/team.jpg"
            actionText="Meet the Team &rarr;"
            href="/team"
            onActionClick={() => router.push("/team")}
          />
        </div>

        <div style={{ perspective: "1000px" }}>
          <InteractiveTravelCard
            title="GALLERY"
            subtitle="Moments & Projects"
            imageUrl="/gallery.jpg"
            actionText="View Gallery &rarr;"
            href="/gallery"
            onActionClick={() => router.push("/gallery")}
          />
        </div>

        <div style={{ perspective: "1000px" }}>
          <InteractiveTravelCard
            title="EVENTS"
            subtitle="Competitions & workshops"
            imageUrl="/events.jpg"
            actionText="Discover Events &rarr;"
            href="/events"
            onActionClick={() => router.push("/events")}
          />
        </div>
      </div>
    </div>
  );
}
