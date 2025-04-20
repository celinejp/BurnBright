import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');

  const tokenRes = await fetch('https://canvas.ucdavis.edu/login/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.CANVAS_CLIENT_ID!,
      client_secret: process.env.CANVAS_CLIENT_SECRET!,
      redirect_uri: process.env.NEXT_PUBLIC_CANVAS_REDIRECT_URI!,
      code: code || '',
    }),
  });

  const data = await tokenRes.json();
  const accessToken = data.access_token;

  const res = NextResponse.redirect(new URL('/dashboard', req.url));
  res.cookies.set('canvas_token', accessToken, { path: '/' });
  res.cookies.set('canvas_connected', 'true', { path: '/' });

  return res;
}
