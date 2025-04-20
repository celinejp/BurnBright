"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // Ensure this exists

export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="flex items-center justify-center h-screen bg-orange-50">
        <div className="relative">
          <Image
            src="/main_image.webp"
            alt="BurnBright Splash"
            width={500}
            height={500}
            className="rounded-lg shadow-lg opacity-90"
          />
          <h1 className="absolute inset-0 flex items-center justify-center text-white text-5xl font-extrabold tracking-wider drop-shadow-xl">
            BurnBright 🔥
          </h1>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-orange-50 min-h-screen text-gray-900 font-sans">
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm sticky top-0 z-10">
        <h1 className="text-4xl font-extrabold text-orange-600 tracking-tight">BurnBright 🔥</h1>
        <nav className="flex items-center gap-6 text-sm">
          <a href="#problem" className="hover:text-orange-600">Problem</a>
          <a href="#features" className="hover:text-orange-600">Features</a>
          <a href="#impact" className="hover:text-orange-600">Impact</a>
          <Link href="/api/auth/login?returnTo=/dashboard">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full text-sm shadow">Login / Signup</Button>
          </Link>
        </nav>
      </header>

      <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 px-8 py-20 bg-orange-100">
        <div className="max-w-xl space-y-6">
          <h2 className="text-5xl font-extrabold leading-tight">
            Combat Student <span className="text-orange-600">Burnout</span> with AI
          </h2>
          <p className="text-lg text-gray-700">
            BurnBright analyzes your Canvas workload and gives you personalized burnout scores, AI wellness insights, and stress-reducing strategies. All in real time.
          </p>
          <Link href="/api/auth/login?returnTo=/dashboard">
            <Button className="bg-black hover:bg-gray-800 text-white text-lg px-6 py-3 rounded-lg shadow">
              🚀 Get Started
            </Button>
          </Link>
        </div>
        <div>
          <Image
            src="/main_image.webp"
            alt="Burnout Illustration"
            width={450}
            height={450}
            className="rounded-xl shadow-md"
          />
        </div>
      </section>

      <section id="problem" className="bg-white px-8 py-16">
        <h2 className="text-3xl font-semibold mb-4">🧠 The Problem</h2>
        
        <p className="text-sm text-gray-500 mt-4">
        Over 60% of college students report experiencing burnout or overwhelming stress during a typical academic term and yet most don’t recognize the signs until it’s too late.

Academic overload, Canvas deadline chaos, and back-to-back commitments leave students with no space to breathe, reflect, or recover. Many suffer in silence, unsure of how to manage mounting responsibilities.

That’s why we built BurnBright, an AI-powered burnout detection and planning assistant that connects directly with students’ academic workloads. BurnBright analyzes assignment intensity, deadline clusters, and quiz loads to predict burnout risk in real-time. It then offers personalized strategies and wellness habits, empowering students to take action before burnout takes hold.
  <strong>Sources:</strong>{' '}
  <a href="https://www.acha.org/NCHA/ACHANCHA_Data/Publications_and_Reports/NCHA/Data/Reports_ACHA-NCHAIII.aspx" target="_blank" className="underline text-blue-600">ACHA</a>{', '}
  <a href="https://www.bestcolleges.com/research/college-student-mental-health-statistics/" target="_blank" className="underline text-blue-600">BestColleges</a>{', '}
  <a href="https://www.bu.edu/articles/2021/mental-health-of-college-students/" target="_blank" className="underline text-blue-600">BU Study</a>{', '}
  <a href="https://www.insidehighered.com/news/students/2023/01/05/students-say-college-has-hurt-their-mental-health" target="_blank" className="underline text-blue-600">Inside Higher Ed</a>
</p>
      </section>

      <section id="features" className="px-8 py-16 bg-orange-50 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">✨ What BurnBright Offers</h2>
          <ul className="space-y-4 text-md text-gray-700">
          <li>📈 <strong>Live Burnout Score</strong> – Instantly know your academic stress level</li>
  <li>🧠 <strong>AI Wellness Insights</strong> – Get daily mental health guidance tailored to your workload</li>
  <li>🗓 <strong>Smart Planner</strong> – Visualize upcoming deadlines by day, week, or month</li>
  <li>🔁 <strong>Overload Alerts</strong> – Automatically detect stressful days with stacked assignments</li>
  <li>💬 <strong>LLM-Based Advice</strong> – Personalized strategies powered by AI (LLaMA or Gemini)</li>
  <li>📊 <strong>Canvas Workload Dashboard</strong> – Pulls all your assignments into one clean view</li>
  <li>✅ <strong>Focus-Friendly UI</strong> – Minimal, distraction-free interface designed for students</li>

          </ul>
        </div>
        <div id="impact">
          <h2 className="text-2xl font-semibold mb-4">🌍 Social Good Impact</h2>
          <ul className="space-y-4 text-md text-gray-700">
            <li>🧠 Promotes proactive student mental wellness</li>
            <li>♿ Designed for neurodiverse learners</li>
            <li>🔐 Data-responsible and privacy-aware</li>
            <li>🎓 Built for integration with universities and wellness centers</li>
          </ul>
        </div>
      </section>

      <section className="bg-orange-600 text-white px-8 py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Brighten Your Burnout?</h2>
        <p className="text-lg mb-6">Sign in to get your personalized burnout insights and recovery plan today.</p>
        <Link href="/api/auth/login?returnTo=/dashboard">
          <Button className="bg-white text-orange-600 hover:bg-orange-100 font-semibold px-6 py-3 rounded-lg text-lg">
            🌟 Get Started
          </Button>
        </Link>
      </section>
    </main>
  );
}