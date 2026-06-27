"use client";

import { useState } from "react";
import Link from "next/link";
import type {
  NewsItem,
  Discussion,
  Vote,
  AMA,
  MarketplaceListing,
  Business,
} from "@/data/content";
import type { Town } from "@/data/towns";

type Tab = "news" | "vote" | "discuss" | "amas" | "marketplace" | "businesses";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "news", label: "News", icon: "📰" },
  { key: "vote", label: "Vote", icon: "🗳️" },
  { key: "discuss", label: "Discuss", icon: "💬" },
  { key: "amas", label: "AMAs", icon: "🎤" },
  { key: "marketplace", label: "Marketplace", icon: "🏪" },
  { key: "businesses", label: "Businesses", icon: "🏢" },
];

export default function TownClient({
  town,
  news,
  discussions,
  votes,
  amas,
  marketplace,
  businesses,
}: {
  town: Town;
  news: NewsItem[];
  discussions: Discussion[];
  votes: Vote[];
  amas: AMA[];
  marketplace: MarketplaceListing[];
  businesses: Business[];
}) {
  const [tab, setTab] = useState<Tab>("news");

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <Link
            href="/"
            className="mb-3 inline-flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            ← All Towns
          </Link>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">{town.name}</h1>
              <p className="mt-1 text-slate-400">
                {town.state} · Population {town.population.toLocaleString()}
              </p>
              <p className="mt-2 max-w-xl text-sm text-slate-500">
                {town.description}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-700/50 bg-emerald-900/30 px-4 py-1.5 text-sm text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  tab === t.key
                    ? "bg-emerald-900/40 text-emerald-300 border border-emerald-700/50"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
                }`}
              >
                <span>{t.icon}</span>
                {t.label}
                <span className="ml-1 rounded-full bg-slate-800 px-1.5 py-0.5 text-xs text-slate-500">
                  {t.key === "news" && news.length}
                  {t.key === "discuss" && discussions.length}
                  {t.key === "vote" && votes.length}
                  {t.key === "amas" && amas.length}
                  {t.key === "marketplace" && marketplace.length}
                  {t.key === "businesses" && businesses.length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        {tab === "news" && <NewsTab items={news} />}
        {tab === "vote" && <VoteTab items={votes} />}
        {tab === "discuss" && <DiscussTab items={discussions} />}
        {tab === "amas" && <AMAsTab items={amas} />}
        {tab === "marketplace" && <MarketplaceTab items={marketplace} />}
        {tab === "businesses" && <BusinessesTab items={businesses} />}
      </div>
    </main>
  );
}

/* ─── News Tab ─── */
function NewsTab({ items }: { items: NewsItem[] }) {
  if (!items.length) return <EmptyState message="No news yet for this town." />;
  const catColor: Record<string, string> = {
    government: "bg-blue-900/40 text-blue-300 border-blue-700/50",
    community: "bg-emerald-900/40 text-emerald-300 border-emerald-700/50",
    safety: "bg-red-900/40 text-red-300 border-red-700/50",
    events: "bg-purple-900/40 text-purple-300 border-purple-700/50",
    infrastructure: "bg-amber-900/40 text-amber-300 border-amber-700/50",
  };
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((n) => (
        <article
          key={n.id}
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 hover:border-slate-700 transition-colors"
        >
          <div className="mb-3 flex items-center gap-2">
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                catColor[n.category] || "bg-slate-800 text-slate-400"
              }`}
            >
              {n.category}
            </span>
            <span className="text-xs text-slate-500">{n.publishedAt}</span>
          </div>
          <h3 className="mb-2 font-semibold text-white">{n.title}</h3>
          <p className="text-sm text-slate-400">{n.excerpt}</p>
          <p className="mt-3 text-xs text-slate-500">By {n.author}</p>
        </article>
      ))}
    </div>
  );
}

/* ─── Vote Tab ─── */
function VoteTab({ items }: { items: Vote[] }) {
  if (!items.length) return <EmptyState message="No votes open for this town." />;
  return (
    <div className="space-y-4">
      {items.map((v) => {
        const total = v.votesFor + v.votesAgainst;
        const pct = total > 0 ? Math.round((v.votesFor / total) * 100) : 50;
        const statusColor =
          v.status === "open"
            ? "bg-emerald-900/40 text-emerald-300 border-emerald-700/50"
            : v.status === "upcoming"
            ? "bg-amber-900/40 text-amber-300 border-amber-700/50"
            : "bg-slate-800 text-slate-400 border-slate-700";
        return (
          <div
            key={v.id}
            className="rounded-xl border border-slate-800 bg-slate-900/50 p-6"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor}`}>
                {v.status}
              </span>
              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-400">
                {v.category}
              </span>
              <span className="ml-auto text-xs text-slate-500">
                Closes {v.closesAt}
              </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">{v.question}</h3>
            <p className="mb-4 text-sm text-slate-400">{v.description}</p>
            {v.status !== "upcoming" && (
              <>
                <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-400">
                    👍 {v.votesFor.toLocaleString()} ({pct}%)
                  </span>
                  <span className="text-red-400">
                    👎 {v.votesAgainst.toLocaleString()} ({100 - pct}%)
                  </span>
                </div>
              </>
            )}
            {v.status === "open" && (
              <div className="mt-4 flex gap-3">
                <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors">
                  Vote For
                </button>
                <button className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors">
                  Vote Against
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Discuss Tab ─── */
function DiscussTab({ items }: { items: Discussion[] }) {
  if (!items.length) return <EmptyState message="No discussions yet. Start one!" />;
  return (
    <div className="space-y-4">
      {items.map((d) => (
        <div
          key={d.id}
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition-colors"
        >
          <h3 className="mb-2 text-lg font-semibold text-white">{d.title}</h3>
          <p className="mb-3 text-sm text-slate-400 line-clamp-2">{d.body}</p>
          <div className="flex flex-wrap items-center gap-2">
            {d.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-400"
              >
                #{tag}
              </span>
            ))}
            <span className="ml-auto text-xs text-slate-500">
              by {d.author} · {d.createdAt}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
            <span>💬 {d.replies} replies</span>
            <button className="text-emerald-400 hover:text-emerald-300 transition-colors">
              Join discussion →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── AMAs Tab ─── */
function AMAsTab({ items }: { items: AMA[] }) {
  if (!items.length) return <EmptyState message="No AMAs scheduled yet." />;
  const statusColor: Record<string, string> = {
    upcoming: "bg-amber-900/40 text-amber-300 border-amber-700/50",
    live: "bg-red-900/40 text-red-300 border-red-700/50",
    completed: "bg-slate-800 text-slate-400 border-slate-700",
  };
  return (
    <div className="space-y-4">
      {items.map((a) => (
        <div
          key={a.id}
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-6"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor[a.status]}`}>
              {a.status === "live" && "🔺 "}
              {a.status}
            </span>
            <span className="text-xs text-slate-500">
              {new Date(a.scheduledAt).toLocaleString()}
            </span>
          </div>
          <h3 className="mb-1 text-lg font-semibold text-white">{a.topic}</h3>
          <p className="mb-3 text-sm text-slate-400">
            {a.politicianName} · {a.politicianTitle}
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>❓ {a.questions} questions submitted</span>
            {a.status === "upcoming" && (
              <button className="text-emerald-400 hover:text-emerald-300 transition-colors">
                Submit a question →
              </button>
            )}
            {a.status === "live" && (
              <button className="text-red-400 hover:text-red-300 transition-colors animate-pulse">
                Join live AMA →
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Marketplace Tab ─── */
function MarketplaceTab({ items }: { items: MarketplaceListing[] }) {
  if (!items.length) return <EmptyState message="No listings yet." />;
  const catIcon: Record<string, string> = {
    goods: "📦",
    services: "🔧",
    housing: "🏠",
    jobs: "💼",
  };
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((m) => (
        <div
          key={m.id}
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 hover:border-slate-700 transition-colors"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-2xl">{catIcon[m.category] || "📦"}</span>
            <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-400">
              {m.category}
            </span>
          </div>
          <h3 className="mb-1 font-semibold text-white">{m.title}</h3>
          {m.price > 0 && (
            <p className="mb-2 text-lg font-bold text-emerald-400">
              €{m.price.toLocaleString()}
              {m.category === "housing" && <span className="text-sm font-normal text-slate-500">/mo</span>}
            </p>
          )}
          <p className="mb-3 text-sm text-slate-400 line-clamp-2">{m.description}</p>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{m.seller}</span>
            <span>{m.postedAt}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Businesses Tab ─── */
function BusinessesTab({ items }: { items: Business[] }) {
  if (!items.length) return <EmptyState message="No businesses listed yet." />;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((b) => (
        <div
          key={b.id}
          className={`rounded-xl border bg-slate-900/50 p-6 transition-colors ${
            b.featured
              ? "border-emerald-700/50 hover:border-emerald-600"
              : "border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="mb-2 flex items-center gap-2">
            {b.featured && (
              <span className="rounded-full bg-emerald-900/40 px-2 py-0.5 text-xs text-emerald-300 border border-emerald-700/50">
                ⭐ Featured
              </span>
            )}
            <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-400">
              {b.category}
            </span>
          </div>
          <h3 className="mb-1 text-lg font-semibold text-white">{b.name}</h3>
          <p className="mb-3 text-sm text-slate-400">{b.description}</p>
          <div className="flex flex-wrap gap-3 text-sm">
            {b.phone && (
              <span className="text-slate-500">📞 {b.phone}</span>
            )}
            {b.website && (
              <a
                href={`https://${b.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                🌐 {b.website}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Empty State ─── */
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/30 py-20 text-center">
      <div className="mb-4 text-4xl">🏘️</div>
      <p className="text-slate-400">{message}</p>
    </div>
  );
}
