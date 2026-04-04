"use client";

import React from 'react';
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const isAuthPage = pathname?.startsWith('/auth');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="layout-container">
      <nav className="sidebar">
        <Link href="/" className="logo">
          <span className="logo-text">Scraping<span className="accent-text">SaaS</span></span>
        </Link>
        
        <div className="nav-items">
          <div className="nav-group">
            <span className="group-label">Main</span>
            <Link href="/dashboard" className={`nav-item ${pathname === '/dashboard' ? 'active' : ''}`}>Dashboard</Link>
            <Link href="/rooms" className={`nav-item ${pathname === '/rooms' ? 'active' : ''}`}>My Rooms</Link>
            <Link href="/scrapers" className={`nav-item ${pathname === '/scrapers' ? 'active' : ''}`}>Scrapers</Link>
          </div>
          
          <div className="nav-group">
            <span className="group-label">Account</span>
            <Link href="/usage" className={`nav-item ${pathname === '/usage' ? 'active' : ''}`}>Usage</Link>
            <Link href="/billing" className={`nav-item ${pathname === '/billing' ? 'active' : ''}`}>Billing</Link>
            <Link href="/settings" className={`nav-item ${pathname === '/settings' ? 'active' : ''}`}>Settings</Link>
          </div>
        </div>

        <div className="sidebar-footer">
          {session?.user ? (
            <div className="user-profile">
              <div className="avatar">
                {session.user.image ? (
                  <img src={session.user.image} alt={session.user.name || "User"} className="avatar-img" />
                ) : (
                  (session.user.name?.[0] || 'U').toUpperCase()
                )}
              </div>
              <div className="user-info">
                <span className="user-name">{session.user.name || "User"}</span>
                <span className="user-email">{session.user.email}</span>
                <button onClick={handleSignOut} className="sign-out-btn">Sign Out</button>
              </div>
            </div>
          ) : (
            <Link href="/auth/signin" className="login-prompt">
              Login to get started →
            </Link>
          )}
        </div>
      </nav>

      <main className="main-content">
        <header className="top-header glass">
          <div className="header-search">
            <input type="text" placeholder="Search rooms..." className="search-input" />
          </div>
          <div className="header-actions">
            <div className="credit-badge">
              <span className="credit-icon">⚡</span>
              <span className="credit-amount">{session?.user?.credits?.toLocaleString() || "0"}</span>
            </div>
            <button className="icon-btn">🔔</button>
          </div>
        </header>
        
        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
};

export default LayoutWrapper;
