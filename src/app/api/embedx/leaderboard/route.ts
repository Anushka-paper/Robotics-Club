import { NextResponse } from 'next/server';
import { connectToDatabase, SystemSettings } from '@/lib/db';
import mongoose from 'mongoose';

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    // Check if leaderboard is hidden globally
    const settings = await SystemSettings.findOne({ key: 'leaderboard_hidden' });
    if (settings && settings.value === true) {
      return NextResponse.json({ hidden: true, teams: [] });
    }
    
    // Get the Registration model
    const RegistrationModel = mongoose.model('Registration');
    
    // Only show teams whose payment has been verified by an admin
    // We fetch their _id, teamName, and score
    const teams = await RegistrationModel.find(
      { paymentStatus: 'VERIFIED' },
      'teamName score _id'
    ).lean();

    const formattedTeams = teams.map((team: any) => ({
      id: team._id.toString(),
      name: team.teamName,
      score: team.score || 0 // Default to 0 points if undefined
    }));

    return NextResponse.json({ hidden: false, teams: formattedTeams });
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
