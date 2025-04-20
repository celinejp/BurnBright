import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const flaskRes = await fetch('https://burnbright-api.onrender.com/api/burnout-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!flaskRes.ok) {
      return NextResponse.json({ error: 'Flask API error' }, { status: flaskRes.status });
    }

    const data = await flaskRes.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Proxy error', detail: err }, { status: 500 });
  }
}
