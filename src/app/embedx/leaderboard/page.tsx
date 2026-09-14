"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import ShaderWaves from "@/components/ui/ShaderWaves";
import SleekLineCursor from "@/components/SleekLineCursor";

// Define the Team interface based on expected MongoDB document structure
interface Team {
  _id?: string;
  id?: string;
  name: string;
  score: number;
}

export default function LeaderboardPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // Fetch leaderboard data from MongoDB API
    const fetchLeaderboard = async (isInitial = false) => {
      if (isInitial) setIsLoading(true);
      try {
        const response = await fetch(`/api/embedx/leaderboard?t=${Date.now()}`, { 
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.hidden) {
            setIsHidden(true);
          } else {
            setIsHidden(false);
            const fetchedTeams = data.teams || data || [];
            setTeams(fetchedTeams);
          }
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
      } finally {
        if (isInitial) setIsLoading(false);
      }
    };

    fetchLeaderboard(true);

    // Poll every 5 seconds for real-time updates without refreshing
    const intervalId = setInterval(() => {
      fetchLeaderboard(false);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // Sort teams: by score descending, then alphabetically
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  // Only teams with >0 points get on the podium
  const podiumTeams = sortedTeams.filter(t => t.score > 0).slice(0, 3);
  const firstPlace = podiumTeams[0] || null;
  const secondPlace = podiumTeams[1] || null;
  const thirdPlace = podiumTeams[2] || null;

  return (
    <div className="min-h-screen w-full bg-[#050810] text-white relative flex flex-col font-['Inter']">
      {/* Background Layers */}
      <ShaderWaves />
      
      {/* Robotics Hardware Theme Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[1] opacity-15 md:opacity-20 mix-blend-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/robotics_hardware_bg.jpg')` }}
      />
      
      <div className="fixed inset-0 pointer-events-none z-[10]">
        <SleekLineCursor />
      </div>
      <div className="fixed inset-0 bg-gradient-to-b from-[#050810]/95 via-[#050810]/70 to-[#050810] pointer-events-none z-[2]" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto pt-20 md:pt-28 px-4 md:px-6 pb-20">

        {isHidden ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="bg-[#0a1120]/80 backdrop-blur-md rounded-2xl border border-blue-900/40 p-10 md:p-16 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(59,130,246,0.05)] mt-10"
          >
            <h1 className="text-3xl md:text-5xl font-black font-['Space_Grotesk'] tracking-widest uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 drop-shadow-2xl">
              Leaderboard Hidden
            </h1>
            <p className="text-neutral-400 font-mono tracking-wide text-sm md:text-base">
              The live rankings are currently hidden by the administrators. Stay tuned!
            </p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
          {/* CARD 1: Header */}
          <div className="bg-[#0a1120]/80 backdrop-blur-md rounded-2xl border border-blue-900/40 p-6 md:p-8 flex flex-col items-center justify-center text-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.05)]">
            <h1 className="text-3xl md:text-5xl font-black font-['Space_Grotesk'] tracking-widest uppercase mb-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500 drop-shadow-2xl">
              Leaderboard
            </h1>
            <div className="text-blue-500 font-mono text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] font-bold uppercase mb-4">
              EMBEDX HARDWARE HACKATHON
            </div>
            
            <div className="flex items-center justify-center gap-3 md:gap-5 text-blue-500 font-mono text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.3em] font-bold uppercase w-full">
              <span className="hidden sm:block w-8 md:w-24 h-[1px] bg-gradient-to-r from-transparent to-blue-500"></span>
              <span className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">SCORE HIGH &bull; CONQUER THE CROWN</span>
              <span className="hidden sm:block w-8 md:w-24 h-[1px] bg-gradient-to-l from-transparent to-blue-500"></span>
            </div>
          </div>

          {/* CARD 2: Hall of Fame (Podium) */}
          <div className="relative bg-[#0a1120]/90 backdrop-blur-md rounded-2xl border border-blue-900/50 p-6 md:p-10 mb-6 shadow-[0_0_40px_rgba(59,130,246,0.1)] flex flex-col items-center overflow-hidden">
            
            {/* Inner Tech Background specifically for this box */}
            <div 
              className="absolute inset-0 z-0 opacity-30 mix-blend-screen bg-cover bg-center pointer-events-none"
              style={{ backgroundImage: `url('/robotics_hardware_bg.jpg')` }}
            ></div>
            {/* Vignette fade for the bottom so it grounds the podium */}
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a1120] via-[#0a1120]/40 to-transparent pointer-events-none"></div>

            <div className="relative z-10 flex items-center justify-center gap-4 mb-10 md:mb-12 w-full">
               <span className="text-3xl md:text-4xl drop-shadow-md">⚡</span>
               <h2 className="text-2xl md:text-3xl font-black text-white tracking-[0.15em] uppercase font-['Space_Grotesk'] drop-shadow-xl">Top Innovators</h2>
            </div>
            
            {isLoading ? (
              <div className="relative z-10 h-64 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="relative z-10 flex justify-center items-end gap-3 md:gap-8 pt-6 pb-2 w-full">
                 {/* 2nd Place */}
                 <div className="flex flex-col items-center w-[90px] md:w-[120px]">
                    <div className="mb-3 flex flex-col items-center">
                       <span className="text-3xl md:text-4xl mb-1 drop-shadow-md">🥈</span>
                       <span className="font-black text-neutral-300 font-['Space_Grotesk'] text-sm md:text-base drop-shadow-md">2ND</span>
                    </div>
                    <div className="w-full h-28 md:h-32 bg-neutral-400/10 backdrop-blur-sm border-2 border-neutral-300/80 rounded-t-xl shadow-[0_0_20px_rgba(212,212,216,0.2)] relative"></div>
                    <div className="mt-4 text-center w-full">
                       <div className="text-sm md:text-base font-black font-['Space_Grotesk'] text-neutral-200 truncate px-1 tracking-wide">{secondPlace ? secondPlace.name : "TBD"}</div>
                       <div className="text-sm md:text-base font-mono font-bold text-neutral-300 mt-1">{secondPlace ? secondPlace.score.toLocaleString() : "0"} <span className="text-[10px] text-neutral-500">PTS</span></div>
                    </div>
                 </div>
                 
                 {/* 1st Place */}
                 <div className="flex flex-col items-center w-[100px] md:w-[140px]">
                    <div className="mb-3 flex flex-col items-center">
                       <span className="text-4xl md:text-5xl mb-1 drop-shadow-lg">🥇</span>
                       <span className="font-black text-amber-400 font-['Space_Grotesk'] text-base md:text-lg drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">1ST</span>
                    </div>
                    <div className="w-full h-36 md:h-44 bg-amber-500/20 backdrop-blur-sm border-2 border-amber-400 rounded-t-xl shadow-[0_0_30px_rgba(251,191,36,0.4)] relative"></div>
                    <div className="mt-4 text-center w-full">
                       <div className="text-base md:text-xl font-black font-['Space_Grotesk'] text-amber-400 truncate px-1 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] tracking-wide">{firstPlace ? firstPlace.name : "TBD"}</div>
                       <div className="text-base md:text-lg font-mono font-black text-amber-300 mt-1">{firstPlace ? firstPlace.score.toLocaleString() : "0"} <span className="text-[10px] text-amber-500/80">PTS</span></div>
                    </div>
                 </div>

                 {/* 3rd Place */}
                 <div className="flex flex-col items-center w-[90px] md:w-[120px]">
                    <div className="mb-3 flex flex-col items-center">
                       <span className="text-3xl md:text-4xl mb-1 drop-shadow-md">🥉</span>
                       <span className="font-black text-orange-600 font-['Space_Grotesk'] text-sm md:text-base drop-shadow-md">3RD</span>
                    </div>
                    <div className="w-full h-20 md:h-24 bg-orange-600/20 backdrop-blur-sm border-2 border-orange-600/80 rounded-t-xl shadow-[0_0_20px_rgba(234,88,12,0.2)] relative"></div>
                    <div className="mt-4 text-center w-full">
                       <div className="text-sm md:text-base font-black font-['Space_Grotesk'] text-orange-500 truncate px-1 tracking-wide">{thirdPlace ? thirdPlace.name : "TBD"}</div>
                       <div className="text-sm md:text-base font-mono font-bold text-orange-400 mt-1">{thirdPlace ? thirdPlace.score.toLocaleString() : "0"} <span className="text-[10px] text-orange-600">PTS</span></div>
                    </div>
                 </div>
              </div>
            )}
          </div>

          {/* CARD 3: Table / Rankings List */}
          <div className="bg-[#0a1120]/80 backdrop-blur-md rounded-2xl border border-blue-900/40 p-5 md:p-8 shadow-[0_0_30px_rgba(59,130,246,0.05)]">
            <div className="flex items-center justify-between px-2 md:px-4 pb-3 mb-2 border-b border-blue-900/40 text-neutral-400 font-bold font-['Space_Grotesk'] text-[10px] md:text-xs tracking-widest uppercase">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="w-12 text-left">RANK</div>
                <div>TEAM NAME</div>
              </div>
              <div className="text-right">SCORE</div>
            </div>
            
            {isLoading ? (
              <div className="py-10 text-center flex flex-col items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-3"></div>
                <div className="text-blue-500/50 font-mono tracking-widest uppercase text-xs">Loading Live Rankings...</div>
              </div>
            ) : (
              <div className="flex flex-col">
                {sortedTeams.map((team, idx) => {
                   let rankDisplay: React.ReactNode = (idx + 1).toString();
                   
                   if (team.score === 0) {
                     rankDisplay = "-";
                   } else if (idx === 0) {
                     rankDisplay = <span className="text-amber-400 font-black">🥇 #1</span>;
                   } else if (idx === 1) {
                     rankDisplay = <span className="text-neutral-300 font-black">🥈 #2</span>;
                   } else if (idx === 2) {
                     rankDisplay = <span className="text-orange-600 font-black">🥉 #3</span>;
                   } else {
                     rankDisplay = `#${idx + 1}`;
                   }

                   // Use team._id if it comes directly from MongoDB, fallback to team.id, or index
                   const key = team._id || team.id || `team-${idx}`;

                   return (
                    <div 
                      key={key}
                      className="flex items-center justify-between p-3 md:p-4 rounded-lg hover:bg-blue-900/10 transition-colors duration-200 group border-b border-blue-900/10 last:border-0"
                    >
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="w-12 text-left text-sm md:text-base font-bold text-neutral-400 font-mono group-hover:text-blue-400 transition-colors">
                          {rankDisplay}
                        </div>
                        <div className="font-bold text-neutral-200 text-sm md:text-base tracking-wide group-hover:text-white transition-colors">
                          {team.name}
                        </div>
                      </div>
                      <div className="text-blue-400 font-mono text-sm md:text-base font-medium">
                        {team.score.toLocaleString()}
                      </div>
                    </div>
                   )
                })}

                {sortedTeams.length === 0 && (
                  <div className="p-10 text-center flex flex-col items-center justify-center">
                    <div className="text-neutral-500 font-mono tracking-widest uppercase text-xs">No teams ranked yet.</div>
                  </div>
                )}
              </div>
            )}
          </div>

        </motion.div>
        )}
      </div>
    </div>
  );
}
