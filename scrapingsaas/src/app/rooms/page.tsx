import { auth } from "@/auth";
import { db } from "@/db";
import { rooms } from "@/db/schema";
import { eq } from "drizzle-orm";
import LayoutWrapper from "@/components/LayoutWrapper";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import Link from "next/link";
import { createRoom, deleteRoom } from "@/actions/rooms";

export default async function RoomsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const userRooms = await db.select().from(rooms).where(eq(rooms.userId, session.user.id));

  return (
    <LayoutWrapper>
      <div className="rooms-header">
        <div>
          <h1 className="page-title">My Scraping Rooms</h1>
          <p className="page-subtitle">Manage your scraping projects and environments.</p>
        </div>
      </div>

      <div className="rooms-grid">
        {/* Create Room Card */}
        <GlassCard className="create-room-card" glow>
          <h2 className="card-title">New Room</h2>
          <p className="card-description">Create a container for your scrapers.</p>
          
          <form action={createRoom} className="create-room-form">
            <input 
              name="name" 
              placeholder="e.g. E-commerce Monitor" 
              className="room-input" 
              required
            />
            <input 
              name="description" 
              placeholder="Brief description..." 
              className="room-input" 
            />
            <NeonButton label="Create Room" variant="primary" type="submit" className="w-full" />
          </form>
        </GlassCard>

        {/* Existing Rooms */}
        {userRooms.map((room) => (
          <GlassCard key={room.id} className="room-card">
            <div className="room-content">
              <h3 className="room-name">{room.name}</h3>
              <p className="room-desc">{room.description || "No description provided."}</p>
              <span className="room-date">{new Date(room.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="room-actions">
              <Link href={`/rooms/${room.id}`}>
                <NeonButton label="Enter Room" variant="outline" className="w-full" />
              </Link>
              
              <form action={deleteRoom.bind(null, room.id)}>
                <button type="submit" className="delete-btn">
                  Delete Room
                </button>
              </form>
            </div>
          </GlassCard>
        ))}
      </div>
    </LayoutWrapper>
  );
}
