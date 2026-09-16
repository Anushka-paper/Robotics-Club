// import EventsApp from "@/events-app/EventsApp";
import Link from "next/link";

export const metadata = {
  title: "Events | Robotics Club MMMUT",
};

export default function Events() {
  return (
    <div className="min-h-screen bg-[#030b18] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 font-['Space_Grotesk'] mb-6 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)] tracking-wide">
          Events Coming Soon
        </h1>
        <p className="text-slate-400 text-lg md:text-xl mb-8 max-w-lg mx-auto">
          We are preparing an exciting lineup of workshops, competitions, and technical events. Stay tuned!
        </p>
        <Link 
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-all font-semibold tracking-wide"
        >
          &larr; Back to Home
        </Link>
      </div>
      
      {/* To restore the actual events page later, simply uncomment the import above and return <EventsApp /> instead of this div. */}
      {/* <EventsApp /> */}
    </div>
  );
}
