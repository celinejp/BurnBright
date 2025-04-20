import { NextResponse } from "next/server";

// Dummy Gemini API simulation
// Replace this with actual Gemini call later
export async function POST(req: Request) {
  const { prompt } = await req.json();

  // TODO: Replace with Google Gemini API call
  const reply = `🤖 (Fake Gemini): You asked "${prompt}". I think you're doing okay, but take a break soon!`;

  return NextResponse.json({ reply });
}
