import { NextRequest, NextResponse } from 'next/server';
import { Cerebras } from 'cerebras-cloud-sdk';

interface Assignment {
  due_at: string;
  title: string;
  course_name: string;
  points?: number;
}

function getDateRange(view: string, dateStr: string): [Date, Date] {
  const date = new Date(dateStr);
  const start = new Date(date);
  const end = new Date(date);
  if (view === 'Week') {
    const day = date.getDay();
    start.setDate(date.getDate() - day);
    end.setDate(start.getDate() + 6);
  } else if (view === 'Month') {
    start.setDate(1);
    end.setMonth(date.getMonth() + 1);
    end.setDate(0);
  }
  return [start, end];
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

export async function POST(req: NextRequest) {
  const { date, view } = await req.json();

  // Use hardcoded email for assignment fetch
  const email = "slokhande@ucdavis.edu";
  const assignmentRes = await fetch(`https://burnbright-api.onrender.com/api/assignments/${email}`);
  const assignments: Assignment[] = await assignmentRes.json();

  const [start, end] = getDateRange(view, date);
  const filtered = assignments.filter(a => {
    const due = new Date(a.due_at);
    return due >= start && due <= end;
  });

  const totalPoints = filtered.reduce((sum, a) => sum + (a.points || 0), 0);
  const numQuizzes = filtered.filter(a => a.title.toLowerCase().includes("quiz") || a.title.toLowerCase().includes("exam")).length;

  const table = `
| Due Date | Course | Title | Points |
|----------|--------|-------|--------|
${filtered.map(a => `| ${formatDate(new Date(a.due_at))} | ${a.course_name} | ${a.title} | ${a.points || 0} |`).join("\n")}
`;

  const prompt = `
You are my AI wellness assistant.

This is my workload for the ${view.toLowerCase()} period (${formatDate(start)} to ${formatDate(end)}):
- 📚 Assignments: ${filtered.length}
- 🧪 Quizzes/Exams: ${numQuizzes}
- 🎯 Total Points: ${totalPoints}

Table of tasks:
${table}

Now help me:
1. What is my burnout risk (0–100%)?
2. 3 reasons my workload may be stressful?
3. 3 ways I can manage it better?
4. 3 daily wellness tips?
5. Most stressful day?

Respond as a supportive AI wellness assistant.
`;

  const client = new Cerebras();
  const response = await client.chat.completions.create({
    model: 'llama-4-scout-17b-16e-instruct',
    messages: [{ role: 'user', content: prompt }],
  });

  const reply = response.choices[0].message.content;
  const percentMatch = reply.match(/burnout risk.*?(\d{1,3})%/i);
  const burnout = percentMatch ? parseInt(percentMatch[1]) : 64;
  const stressLevel = burnout >= 75 ? 'High' : burnout >= 50 ? 'Moderate' : 'Low';

  const weekMap: Record<string, string> = {};
  filtered.forEach(a => {
    const day = new Date(a.due_at).getDay();
    const keys = ['S', 'M', 'T', 'W', 'T2', 'F', 'S'];
    const key = keys[day] || '?';
    weekMap[key] = stressLevel === 'High' ? 'bg-red-500' : stressLevel === 'Moderate' ? 'bg-orange-400' : 'bg-green-500';
  });

  return NextResponse.json({
    burnout,
    stressLevel,
    summary: reply,
    weeklyStressMap: weekMap,
  });
}
