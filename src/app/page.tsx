"use client";

import Link from "next/link";
import { towns } from "@/data/towns";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-950 to-blue-900/20" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-700/50 bg-emerald-900/30 px-4 py-1.5 text-sm text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Now serving {towns.length} communities
          </div>
          <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-6xl">
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Contitown
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            Your local town hub. Stay informed, participate in local decisions,
            connect with neighbors, and support local businesses — all in one place.
          </p>
        </div>
      </header>

      {/* Town Grid */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-8 text-2xl font-semibold text-slate-200">Choose Your Town</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {towns.map((town) => (
            <Link
              key={town.slug}
              href={`/${town.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-emerald-700/50 hover:bg-slate-900 hover:shadow-lg hover:shadow-emerald-900/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/0 to-blue-900/0 transition-all group-hover:from-emerald-900/10 group-hover:to-blue-900/10" />
              <div className="relative">
                <h3 className="mb-1 text-xl font-semibold text-white group-hover:text-emerald-300 transition-colors">
                  {town.name}
                </h3>
                <p className="mb-3 text-sm text-slate-400">{town.state}</p>
                <p className="mb-4 text-sm text-slate-500 line-clamp-2">{town.description}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="rounded-full bg-slate-800 px-2.5 py-1">
                    Pop: {town.population.toLocaleString()}
                  </span>
                  <span className="text-emerald-500 group-hover:translate-x-1 transition-transform">
                    Enter →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-800 bg-slate-900/30">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="mb-12 text-center text-2xl font-semibold text-slate-200">
            Everything Your Community Needs
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: "📰", title: "Local News", desc: "Stay updated with government announcements, events, and community happenings." },
              { icon: "🗳️", title: "Community Voting", desc: "Participate in local decisions. Vote on budgets, zoning, and community initiatives." },
              { icon: "💬", title: "Discussions", desc: "Engage with neighbors on topics that matter. Share ideas, ask questions, build consensus." },
              { icon: "🎤", title: "Politician AMAs", desc: "Direct access to local representatives. Submit questions, get answers, hold leaders accountable." },
              { icon: "🏪", title: "Local Marketplace", desc: "Buy and sell locally, find services, discover housing and job opportunities." },
              { icon: "🏢", title: "Business Directory", desc: "Support local businesses. Find contact info, hours, and special promotions." },
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl border border-slate-800 bg-slate-950/50 p-6">
                <div className="mb-3 text-3xl">{feature.icon}</div>
                <h3 className="mb-2 font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-600">
        Contitown — Empowering local communities
      </footer>
    </main>
  );
}
