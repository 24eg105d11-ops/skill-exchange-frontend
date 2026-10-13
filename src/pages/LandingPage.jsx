import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        padding: '4rem 1rem',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        marginBottom: '2.5rem'
      }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <span className="brand-badge" style={{ fontSize: '0.85rem', padding: '0.3rem 0.8rem', display: 'inline-block', marginBottom: '1rem' }}>
            Zero-Cost Peer Learning &bull; B.Tech Capstone Project
          </span>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
            Exchange Skills. Learn Together. Grow Without Paying Money.
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
            The <strong>Skill Exchange Platform</strong> connects students and professionals to teach what they know and learn what they desire. Barter programming, design, languages, and communication skills directly with peers.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Your Dashboard &rarr;
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started Free &rarr;
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Demo Login
                </Link>
              </>
            )}
            <Link to="/discovery" className="btn btn-outline-primary btn-lg">
              Explore Available Skills
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works 4 Steps */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>
          How Skill Exchange Works
        </h2>
        <div className="grid-cols-4">
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🎯</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>1. List Your Skills</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Add skills you can teach (offered) and skills you want to learn (wanted) with proficiency levels.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🤝</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>2. Smart Matching</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Our matching algorithm discovers peers whose offered skills fulfill your learning goals and vice-versa.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📩</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>3. Propose Barter</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Send an exchange request proposing which skill you'll teach in return for the skill you want.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>💬</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>4. Chat & Complete</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Once accepted, coordinate learning sessions via built-in chat and mark the exchange completed.
            </p>
          </div>
        </div>
      </section>

      {/* Core Domains */}
      <section className="card" style={{ padding: '2.5rem', background: '#ffffff', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Popular Exchange Categories
        </h2>
        <div className="grid-cols-3">
          <div>
            <h4 style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.35rem' }}>💻 Programming & CS</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Java, Spring Boot, Python, Data Structures & Algorithms, React, SQL.</p>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.35rem' }}>🎨 Creative & UI/UX</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Figma prototypes, UI/UX architecture, Graphic Design, Video Editing.</p>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.35rem' }}>🗣️ Languages & Soft Skills</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>French, Spanish, Public Speaking, Technical Interview Preparation.</p>
          </div>
        </div>
      </section>

      {/* Demo Credentials Box */}
      <section style={{
        background: '#eef2ff',
        border: '1px solid #c7d2fe',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3730a3', marginBottom: '0.5rem' }}>
          Week 15 Capstone Evaluation Quick Credentials
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#4338ca', marginBottom: '1rem' }}>
          Use pre-seeded accounts to demonstrate the full skill exchange workflow during viva review:
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', fontSize: '0.85rem' }}>
          <div style={{ background: 'white', padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)' }}>
            <strong>Student 1:</strong> rahul@example.com / password123 (Java &harr; React)
          </div>
          <div style={{ background: 'white', padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)' }}>
            <strong>Student 2:</strong> priya@example.com / password123 (React &harr; Java)
          </div>
          <div style={{ background: 'white', padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)' }}>
            <strong>Administrator:</strong> admin@skillexchange.com / adminpassword123
          </div>
        </div>
      </section>
    </div>
  );
}
