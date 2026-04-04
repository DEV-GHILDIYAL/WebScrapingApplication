"use client";

import React from 'react';
import LayoutWrapper from '@/components/LayoutWrapper';
import GlassCard from '@/components/GlassCard';
import NeonButton from '@/components/NeonButton';
import AnimatedInput from '@/components/AnimatedInput';

export default function Home() {
  return (
    <LayoutWrapper>
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Enterprise Grade <br />
            <span className="gradient-text">Web Scraping</span> at Scale
          </h1>
          <p className="hero-subtitle">
            Automate data extraction with headless browsers, managed proxies, and 
            real-time monitoring. Built for performance and reliability.
          </p>
          
          <div className="cta-group">
            <NeonButton label="Create New Room" variant="primary" />
            <NeonButton label="View Documentation" variant="outline" />
          </div>
        </div>

        <div className="stats-grid">
          <GlassCard glow className="stat-card">
            <span className="stat-value">2.4M</span>
            <span className="stat-label">Pages Scraped Today</span>
          </GlassCard>
          <GlassCard className="stat-card">
            <span className="stat-value">99.9%</span>
            <span className="stat-label">Success Rate</span>
          </GlassCard>
          <GlassCard className="stat-card">
            <span className="stat-value">12ms</span>
            <span className="stat-label">Avg. Latency</span>
          </GlassCard>
        </div>
      </div>

      <section className="features-section">
        <h2 className="section-title">Why Choosing ScrapingSaaS?</h2>
        <div className="features-grid">
          <GlassCard className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Proxy Management</h3>
            <p>Automatic rotation of residential and datacenter proxies to bypass rate limits.</p>
          </GlassCard>
          
          <GlassCard className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Parallel Execution</h3>
            <p>Scale vertically with AWS Lambda workers handling thousands of concurrent requests.</p>
          </GlassCard>
          
          <GlassCard className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Visual Selectors</h3>
            <p>Define your scraping targets using an intuitive visual picker and CSS selectors.</p>
          </GlassCard>
        </div>
      </section>

      <section className="quick-start">
        <GlassCard className="quick-start-card">
          <h2>Trial a Scrape</h2>
          <p>Enter a URL to see our engine in action (Preview mode).</p>
          <div className="input-group">
            <AnimatedInput label="Target URL" placeholder="https://example.com/data" />
            <NeonButton label="Start Instant Scrape" variant="secondary" className="w-full" />
          </div>
        </GlassCard>
      </section>
    </LayoutWrapper>
  );
}
