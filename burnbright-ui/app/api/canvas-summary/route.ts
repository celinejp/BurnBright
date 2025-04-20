// app/api/canvas-summary/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { view, date } = await req.json();

  const ACCESS_TOKEN = process.env.CANVAS_ACCESS_TOKEN!;
  const CANVAS_DOMAIN = 'canvas.ucdavis.edu';

  const headers = {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  };

  const courseRes = await fetch(`https://${CANVAS_DOMAIN}/api/v1/courses`, { headers });
  const courses = await courseRes.json();

  const allAssignments: any[] = [];

  for (const course of courses) {
    const courseId = course.id;
    const courseName = course.name || `Course ${courseId}`;
    const assignRes = await fetch(
      `https://${CANVAS_DOMAIN}/api/v1/courses/${courseId}/assignments`,
      { headers }
    );
    if (!assignRes.ok) continue;

    const data = await assignRes.json();
    for (const a of data) {
      allAssignments.push({
        course: courseName,
        title: a.name,
        due_at: a.due_at,
        points: a.points_possible,
        url: a.html_url,
      });
    }
  }

  return NextResponse.json({ assignments: allAssignments });
}
