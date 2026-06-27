"use client";

import Link from "next/link";
import { towns } from "@/data/towns";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Launch Banner */}
      <div className="border-b border-emerald-800/50 bg-gradient-to-r from-emerald-950 via-emerald-900/60 to-emerald-950">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-6 py-3 text-sm">
          <span className="flex h-2 w-2">
            <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-emerald-200">
            <strong className="text-emerald-300">Now Live:</strong> Alcúdia, Mallorca — your local hub is open!
          </span>
          <Link
            href="/alcudia"
            className="ml-2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-500 transition-colors"
          >
            Enter Alcúdia →
          </Link>
        </div>
      </div>

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

      {/* Alcudia Spotlight */}
      <section className="border-b border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <span className="mb-4 inline-block rounded-full bg-emerald-900/40 px-3 py-1 text-xs font-medium text-emerald-300 border border-emerald-700/50">
                🏆 Launch Community
              </span>
              <h2 className="mb-4 text-3xl font-bold text-white">
                Welcome, <span className="text-emerald-400">Alcúdia</span>!
              </h2>
              <p className="mb-6 text-slate-400">
                Alcúdia is the first community on Contitown. Your historic walled town in
                northern Mallorca now has a digital home for local news, community votes,
                business listings, and connecting with your neighbors.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/alcudia"
                  className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
                >
                  Visit Alcúdia Hub →
                </Link>
                <a
                  href="#how-it-works"
                  className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-600 transition-colors"
                >
                  How It Works
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "📰", label: "Local News", detail: "Ajuntament announcements & events" },
                { icon: "🗳️", label: "Community Votes", detail: "Have your say on local issues" },
                { icon: "💬", label: "Discussions", detail: "Talk with neighbors & businesses" },
                { icon: "🏪", label: "Marketplace", detail: "Buy, sell & find local services" },
              ].map((f) => (
                <div key={f.label} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="mb-2 text-2xl">{f.icon}</div>
                  <h4 className="text-sm font-semibold text-white">{f.label}</h4>
                  <p className="text-xs text-slate-500">{f.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-b border-slate-800">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="mb-10 text-center text-2xl font-semibold text-slate-200">
            How Contitown Works
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: "1", title: "Pick Your Town", desc: "Find your community. Each town has its own hub with local content." },
              { step: "2", title: "Stay Informed", desc: "Read local news, join discussions, and know what's happening in your area." },
              { step: "3", title: "Participate", desc: "Vote in community decisions, ask politicians questions, and support local businesses." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-900/40 text-lg font-bold text-emerald-300 border border-emerald-700/50">
                  {s.step}
                </div>
                <h3 className="mb-2 font-semibold text-white">{s.title}</h3>
                <p className="text-sm text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      {/* Coming Soon Towns */}
      <section className="border-t border-slate-800 bg-slate-900/30">
        <div className="mx-auto max-w-6xl px-6 py-12 text-center">
          <h3 className="mb-4 text-lg font-semibold text-slate-300">More Towns Coming Soon</h3>
          <p className="mb-6 text-sm text-slate-500">
            Contitown is expanding. Alcúdia is just the beginning — stay tuned for new communities.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {towns.filter(t => t.slug !== 'alcudia').map(t => (
              <span key={t.slug} className="rounded-full border border-slate-700 bg-slate-800/50 px-4 py-1.5 text-sm text-slate-400">
                {t.name}, {t.state}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-600">
        Contitown — Empowering local communities · Launched in Alcúdia, Mallorca 🇪🇸
      </footer>
    </main>
  );
}
