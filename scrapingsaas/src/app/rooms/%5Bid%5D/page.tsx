import { auth } from "@/auth";
import { db } from "@/db";
import { rooms, scrapers } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import LayoutWrapper from "@/components/LayoutWrapper";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import Link from "next/link";
import { createScraper, toggleScraperStatus } from "@/actions/scrapers";
import { notFound } from "next/navigation";

interface RoomPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { id } = await params;

  // Fetch room details and verify ownership
  const [room] = await db.select().from(rooms).where(
    and(eq(rooms.id, id), eq(rooms.userId, session.user.id))
  );

  if (!room) {
    notFound();
  }

  // Fetch scrapers for this room
  const roomScrapers = await db.select().from(scrapers).where(eq(scrapers.roomId, id));

  return (
    <LayoutWrapper>
      <div className="room-header-section">
        <Link href="/rooms" className="back-link">← Back to Rooms</Link>
        <h1 className="page-title">{room.name}</h1>
        <p className="page-subtitle">{room.description || "Manage scrapers for this environment."}</p>
      </div>

      <div className="room-layout">
        <div className="scrapers-list-section">
          <h2 className="section-title">Active Scrapers</h2>
          <div className="scrapers-list">
            {roomScrapers.length === 0 ? (
              <GlassCard className="empty-state">
                <p>No scrapers defined in this room yet.</p>
              </GlassCard>
            ) : (
              roomScrapers.map((scraper) => (
                <GlassCard key={scraper.id} className="scraper-card">
                  <div className="scraper-info">
                    <div className="scraper-main">
                      <h3 className="scraper-name">{scraper.name}</h3>
                      <span className={`status-badge ${scraper.status}`}>
                        {scraper.status}
                      </span>
                    </div>
                    <p className="scraper-url">{scraper.url}</p>
                  </div>
                  
                  <div className="scraper-actions">
                    <form action={toggleScraperStatus.bind(null, scraper.id, scraper.status)}>
                      <NeonButton 
                        label={scraper.status === 'active' ? 'Pause' : 'Resume'} 
                        variant="outline" 
                        type="submit"
                        className="small-btn"
                      />
                    </form>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </div>

        <div className="add-scraper-section">
          <GlassCard glow className="add-card">
            <h2 className="card-title">Add New Scraper</h2>
            <p className="card-subtitle">Define target URL and automation rules.</p>
            
            <form action={createScraper.bind(null, id)} className="add-form">
              <div className="form-group">
                <label>Scraper Name</label>
                <input name="name" placeholder="e.g. Price Watcher" className="form-input" required />
              </div>
              <div className="form-group">
                <label>Target URL</label>
                <input name="url" placeholder="https://example.com/product" className="form-input" required />
              </div>
              
              <NeonButton label="Add Scraper" variant="primary" type="submit" className="w-full" />
            </form>
          </GlassCard>
        </div>
      </div>

    </LayoutWrapper>
  );
}
