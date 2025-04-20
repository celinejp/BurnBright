'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/datepicker';
import { Select, SelectItem } from '@/components/ui/select';

export default function DashboardPage() {
  const { user, error, isLoading } = useUser();

  const [view, setView] = useState<'Day' | 'Week' | 'Month'>('Week');
  const [date, setDate] = useState<Date>(new Date());
  const [aiSummary, setAiSummary] = useState('');
  const [burnoutPercent, setBurnoutPercent] = useState<number>(0);
  const [stressLevel, setStressLevel] = useState('Moderate');
  const [weeklyStressMap, setWeeklyStressMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBurnoutPrediction = async () => {
      if (!date) return;
      setLoading(true);

      try {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const payload =
          view === 'Day'
            ? {
                email: 'slokhande@ucdavis.edu',
                view,
                start: `${formattedDate}T00:00:00Z`,
                end: `${formattedDate}T23:59:59Z`,
              }
            : {
                email: 'slokhande@ucdavis.edu',
                view,
                date: formattedDate,
              };

        const res = await axios.post('/api/proxy-burnout', payload);
        const { burnout, summary, stressLevel, weeklyStressMap } = res.data;
        setAiSummary(summary);
        setBurnoutPercent(burnout);
        setStressLevel(stressLevel);
        setWeeklyStressMap(weeklyStressMap);
      } catch (err) {
        console.error('❌ Error fetching burnout data:', err);
      }

      setLoading(false);
    };

    fetchBurnoutPrediction();
  }, [date, view]);

  if (isLoading) return <div className="p-10 text-lg">Loading burnout insights...</div>;
  if (error) return <div className="p-10 text-red-600">Error: {error.message}</div>;
  if (!user) {
    return (
      <div className="p-10 text-lg">
        You must{' '}
        <a href="/api/auth/login" className="text-blue-600 underline">
          log in
        </a>{' '}
        to view your dashboard.
      </div>
    );
  }

  return (
    <main className="bg-orange-50 min-h-screen px-6 py-16 text-gray-900">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Welcome, {user.name} 👋</h1>
        <a href="/api/auth/logout">
          <Button variant="outline">Logout</Button>
        </a>
      </div>

      {/* Burnout Meter */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">🔥 Live Burnout Score</h2>
        <div className="w-full bg-gray-200 h-6 rounded-full overflow-hidden">
          <div
            className="bg-red-500 h-6 text-right pr-2 text-white text-sm leading-6"
            style={{ width: `${burnoutPercent}%` }}
          >
            {burnoutPercent}%
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-6 mb-6">
        <DatePicker date={date} onDateChange={(newDate) => setDate(newDate)} />
        <Select value={view} onValueChange={(val) => setView(val as typeof view)}>
          <SelectItem value="Day">Day</SelectItem>
          <SelectItem value="Week">Week</SelectItem>
          <SelectItem value="Month">Month</SelectItem>
        </Select>
      </div>

      {/* Stress Level */}
      <p className="text-lg mb-6">
        Current Stress Level:
        <span
          className={`ml-2 font-semibold ${
            stressLevel === 'High'
              ? 'text-red-600'
              : stressLevel === 'Moderate'
              ? 'text-orange-600'
              : 'text-green-600'
          }`}
        >
          {stressLevel}
        </span>
      </p>

      {/* Weekly Stress Summary */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-2">📅 Weekly Stress Summary</h2>
        <div className="flex gap-3 text-white text-center text-sm font-medium">
          {['M', 'T', 'W', 'T2', 'F', 'S'].map((day) => (
            <div
              key={day}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                weeklyStressMap[day] || 'bg-gray-300'
              }`}
            >
              {day[0]}
            </div>
          ))}
        </div>
      </section>

      {/* AI Summary */}
      {aiSummary ? (
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">🧠 AI Wellness Insights</h2>
          <Card>
            <CardContent className="prose mt-4 whitespace-pre-wrap leading-relaxed">
              {aiSummary}
            </CardContent>
          </Card>
        </section>
      ) : (
        <p className="text-gray-500 italic">No AI summary available for this selection.</p>
      )}
    </main>
  );
}
