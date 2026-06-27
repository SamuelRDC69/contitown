import Link from "next/link";
import { notFound } from "next/navigation";
import { towns, getTown } from "@/data/towns";
import {
  getNewsForTown,
  getDiscussionsForTown,
  getVotesForTown,
  getAMAsForTown,
  getMarketplaceForTown,
  getBusinessesForTown,
} from "@/data/content";
import TownClient from "./TownClient";

export function generateStaticParams() {
  return towns.map((t) => ({ townSlug: t.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ townSlug: string }> }) {
  // Note: in Next 16, params is sync; this is handled at runtime below
  return { title: "Contitown" };
}

export default async function TownPage({
  params,
}: {
  params: Promise<{ townSlug: string }>;
}) {
  const { townSlug } = await params;
  const town = getTown(townSlug);
  if (!town) notFound();

  const townNews = getNewsForTown(townSlug);
  const townDiscussions = getDiscussionsForTown(townSlug);
  const townVotes = getVotesForTown(townSlug);
  const townAMAs = getAMAsForTown(townSlug);
  const townMarketplace = getMarketplaceForTown(townSlug);
  const townBusinesses = getBusinessesForTown(townSlug);

  return (
    <TownClient
      town={town}
      news={townNews}
      discussions={townDiscussions}
      votes={townVotes}
      amas={townAMAs}
      marketplace={townMarketplace}
      businesses={townBusinesses}
    />
  );
}
