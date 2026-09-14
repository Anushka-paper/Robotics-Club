import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get the Registration model
    const RegistrationModel = mongoose.model('Registration');
    
    // Fetch all registered teams (you can filter by registrationStatus: "CONFIRMED" if needed later)
    // We fetch their _id, teamName, and score
    const teams = await RegistrationModel.find({}, 'teamName score _id').lean();

    const formattedTeams = teams.map((team: any) => ({
      id: team._id.toString(),
      name: team.teamName,
      score: team.score || 0 // Default to 0 points if undefined
    }));

    return NextResponse.json({ teams: formattedTeams });
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
