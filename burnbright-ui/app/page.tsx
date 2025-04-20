"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="bg-orange-50 min-h-screen text-gray-900">
      {/* NAVBAR */}
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-xl font-bold">BurnBright 🔥</h1>
        <nav className="flex items-center gap-6">
          <a href="#problem" className="hover:text-orange-600">Problem</a>
          <a href="#features" className="hover:text-orange-600">Features</a>
          <a href="#impact" className="hover:text-orange-600">Impact</a>
          <Link href="/api/auth/login?returnTo=/dashboard">
            <Button className="bg-black text-white text-sm px-4 py-2">Login / Signup</Button>
          </Link>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-10 px-8 py-16">
        <div className="max-w-xl space-y-6">
          <h2 className="text-5xl font-bold">
            AI Planner to Beat <span className="text-orange-600">Burnout</span>
          </h2>
          <p className="text-lg">
            BurnBright helps you manage your schedule and avoid burnout with smart, personalized recommendations.
          </p>
          <Link href="/api/auth/login?returnTo=/dashboard">
            <Button className="bg-black text-white">Get Started</Button>
          </Link>
        </div>
        <div>
          <Image
            src="/main_image.webp"
            alt="Burnout Illustration"
            width={400}
            height={400}
            className="rounded-lg"
          />
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section id="problem" className="bg-white px-8 py-12">
        <h2 className="text-3xl font-semibold mb-4">🧠 The Problem</h2>
        <p className="max-w-3xl text-lg">
          Students don’t realize they’re heading toward burnout — until it’s too late.
          Canvas overload, back-to-back classes, and no space for breaks or recovery
          leads to rising mental health crises across campuses.
        </p>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">What BurnBright Does</h2>
          <ul className="space-y-4 text-md">
            <li>💬 <strong>Chat with Gemini</strong> – Get instant answers to your stress-related questions</li>
            <li>📅 <strong>Smart Planning</strong> – Auto-add recovery blocks into your calendar</li>
            <li>📊 <strong>Live Burnout Score</strong> – Track your stress levels in real-time with AI</li>
          </ul>
        </div>
        <div id="impact">
          <h2 className="text-2xl font-semibold mb-4">Social Good Impact</h2>
          <ul className="space-y-4 text-md">
            <li>🧠 Student mental wellness</li>
            <li>♿ Benefit for neurodiverse users</li>
            <li>🔐 Licensed as student wellness tech</li>
            <li>💡 Potential licensed to universities</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
