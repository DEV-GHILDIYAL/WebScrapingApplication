import { auth } from "@/auth";
import { db } from "@/db";
import { rooms, scrapers } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import LayoutWrapper from "@/components/LayoutWrapper";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import RazorpayButton from "@/components/RazorpayButton";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <LayoutWrapper>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to ScrapingSaaS</h1>
          <p className="text-slate-400 mb-8">Please sign in to access your dashboard.</p>
          <Link href="/auth/signin">
            <NeonButton label="Sign In Now" variant="primary" />
          </Link>
        </div>
      </LayoutWrapper>
    );
  }

  // Fetch stats
  const [roomCount] = await db.select({ value: count() }).from(rooms).where(eq(rooms.userId, session.user.id));
  const [activeScrapers] = await db.select({ value: count() }).from(scrapers).where(eq(scrapers.status, "active"));

  return (
    <LayoutWrapper>
      <div className="dashboard-header flex justify-between items-center mb-8">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Welcome back, {session.user.name || "User"}. Here's what's happening.</p>
        </div>
        <div className="flex gap-4">
          <RazorpayButton amount={499} label="Add 5000 Credits" />
          <Link href="/rooms">
            <NeonButton label="New Room" variant="primary" />
          </Link>
        </div>
      </div>

      <div className="dashboard-grid">
        <GlassCard className="stat-card">
          <span className="stat-value">{roomCount.value}</span>
          <span className="stat-label">Total Rooms</span>
        </GlassCard>
        <GlassCard className="stat-card" glow>
          <span className="stat-value">{activeScrapers.value}</span>
          <span className="stat-label">Active Scrapers</span>
        </GlassCard>
        <GlassCard className="stat-card">
          <span className="stat-value">{session.user.credits.toLocaleString()}</span>
          <span className="stat-label">Available Credits</span>
        </GlassCard>
      </div>

      <div className="activity-placeholder mt-8">
        <GlassCard>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Recent scraping usage</h3>
              <p className="text-slate-400">No recent activity logs found. Start by creating a room!</p>
            </div>
            <Link href="/rooms">
              <NeonButton label="Go to Rooms" variant="outline" />
            </Link>
          </div>
        </GlassCard>
      </div>
    </LayoutWrapper>
  );
}
