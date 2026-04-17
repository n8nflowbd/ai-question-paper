import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ── Supabase client ──────────────────────────────────────────────
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ── Fonts & global CSS ───────────────────────────────────────────
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Hind:wght@400;500;600&display=swap');`;

const css = `
  ${FONTS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0d1117; }

  .app {
    min-height: 100vh;
    background: #0d1117;
    color: #e8dcc8;
    font-family: 'Hind', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .bg-pattern {
    position: fixed;
    inset: 0;
    background-image:
      radial-gradient(ellipse 80% 50% at 20% 10%, rgba(212,175,55,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(139,0,0,0.06) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  .container {
    max-width: 860px;
    margin: 0 auto;
    padding: 40px 20px 80px;
    position: relative;
    z-index: 1;
  }

  /* ── Navbar ── */
  .navbar {
    background: rgba(13,17,23,0.95);
    border-bottom: 1px solid rgba(212,175,55,0.15);
    padding: 12px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(10px);
  }
  .nav-brand {
    font-family: 'Playfair Display', serif;
    font-size: 14px;
    font-weight: 700;
    color: #d4af37;
    letter-spacing: 1px;
  }
  .nav-right { display: flex; align-items: center; gap: 12px; }
  .plan-badge {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    padding: 4px 10px;
    border-radius: 20px;
    text-transform: uppercase;
  }
  .plan-free { background: rgba(255,255,255,0.06); color: #8a7d6b; border: 1px solid rgba(255,255,255,0.1); }
  .plan-premium { background: rgba(212,175,55,0.15); color: #d4af37; border: 1px solid rgba(212,175,55,0.3); }
  .nav-btn {
    font-size: 12px;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 6px;
    cursor: pointer;
    border: 1px solid rgba(212,175,55,0.3);
    background: transparent;
    color: #d4af37;
    font-family: 'Hind', sans-serif;
    transition: all 0.2s;
  }
  .nav-btn:hover { background: rgba(212,175,55,0.1); }

  /* ── Auth Screen ── */
  .auth-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    position: relative;
    z-index: 1;
  }
  .auth-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(212,175,55,0.2);
    border-radius: 16px;
    padding: 40px 36px;
    width: 100%;
    max-width: 420px;
    backdrop-filter: blur(10px);
  }
  .auth-logo {
    text-align: center;
    margin-bottom: 28px;
  }
  .auth-logo .badge {
    display: inline-block;
    background: linear-gradient(135deg, #d4af37, #b8860b);
    color: #0d1117;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 3px;
    padding: 4px 12px;
    border-radius: 2px;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .auth-logo h1 {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 800;
    color: #f0e6cc;
    line-height: 1.2;
  }
  .auth-logo h1 span {
    background: linear-gradient(90deg, #d4af37, #f5d87a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .auth-tabs {
    display: flex;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(212,175,55,0.1);
    border-radius: 8px;
    padding: 4px;
    margin-bottom: 24px;
  }
  .auth-tab {
    flex: 1;
    padding: 8px;
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    color: #5a5040;
    border: none;
    background: transparent;
    font-family: 'Hind', sans-serif;
  }
  .auth-tab.active { background: rgba(212,175,55,0.15); color: #d4af37; }

  .auth-field { margin-bottom: 16px; }
  .auth-field label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #8a7d6b;
    margin-bottom: 6px;
  }
  .auth-field input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(212,175,55,0.2);
    border-radius: 8px;
    color: #e8dcc8;
    font-family: 'Hind', sans-serif;
    font-size: 14px;
    padding: 10px 14px;
    outline: none;
    transition: all 0.2s;
  }
  .auth-field input:focus {
    border-color: #d4af37;
    background: rgba(212,175,55,0.06);
    box-shadow: 0 0 0 3px rgba(212,175,55,0.08);
  }
  .auth-btn {
    width: 100%;
    padding: 13px;
    background: linear-gradient(135deg, #d4af37, #b8860b);
    color: #0d1117;
    border: none;
    border-radius: 10px;
    font-family: 'Playfair Display', serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.25s;
    margin-top: 8px;
  }
  .auth-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(212,175,55,0.3); }
  .auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .auth-error {
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 8px;
    padding: 10px 14px;
    color: #f87171;
    font-size: 13px;
    margin-top: 12px;
  }

  /* ── Header ── */
  .header { text-align: center; margin-bottom: 48px; }
  .badge {
    display: inline-block;
    background: linear-gradient(135deg, #d4af37, #b8860b);
    color: #0d1117;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    padding: 5px 14px;
    border-radius: 2px;
    text-transform: uppercase;
    margin-bottom: 18px;
  }
  .title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 5vw, 46px);
    font-weight: 800;
    line-height: 1.15;
    color: #f0e6cc;
    margin-bottom: 12px;
  }
  .title span {
    background: linear-gradient(90deg, #d4af37, #f5d87a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .subtitle { color: #8a7d6b; font-size: 15px; line-height: 1.6; }
  .divider {
    width: 60px; height: 2px;
    background: linear-gradient(90deg, transparent, #d4af37, transparent);
    margin: 20px auto;
  }

  /* ── Free limit bar ── */
  .limit-bar {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(212,175,55,0.12);
    border-radius: 10px;
    padding: 14px 18px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .limit-info { font-size: 13px; color: #8a7d6b; }
  .limit-info strong { color: #d4af37; }
  .upgrade-link {
    font-size: 12px;
    font-weight: 700;
    color: #d4af37;
    background: rgba(212,175,55,0.1);
    border: 1px solid rgba(212,175,55,0.25);
    border-radius: 6px;
    padding: 6px 12px;
    cursor: pointer;
    border-width: 1px;
    font-family: 'Hind', sans-serif;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .upgrade-link:hover { background: rgba(212,175,55,0.2); }

  /* ── Form Card ── */
  .form-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(212,175,55,0.15);
    border-radius: 12px;
    padding: 32px;
    margin-bottom: 32px;
    backdrop-filter: blur(10px);
  }
  .form-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #d4af37;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .form-section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(212,175,55,0.2);
  }
  .fields-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }
  @media (max-width: 600px) {
    .fields-grid { grid-template-columns: 1fr; }
    .form-card { padding: 20px; }
    .auth-card { padding: 28px 20px; }
  }
  .field { display: flex; flex-direction: column; gap: 8px; }
  .field.full { grid-column: 1 / -1; }
  label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #8a7d6b;
  }
  input, select, textarea {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(212,175,55,0.2);
    border-radius: 8px;
    color: #e8dcc8;
    font-family: 'Hind', sans-serif;
    font-size: 14px;
    padding: 10px 14px;
    transition: all 0.2s;
    outline: none;
    width: 100%;
  }
  input:focus, select:focus, textarea:focus {
    border-color: #d4af37;
    background: rgba(212,175,55,0.06);
    box-shadow: 0 0 0 3px rgba(212,175,55,0.08);
  }
  select option { background: #1a1f2e; }
  textarea { resize: vertical; min-height: 80px; }

  .qtype-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }
  .qtype-chip {
    display: flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(212,175,55,0.15);
    border-radius: 8px; padding: 8px 14px;
    cursor: pointer; transition: all 0.2s;
    flex: 1; min-width: 140px; user-select: none;
  }
  .qtype-chip:hover { border-color: rgba(212,175,55,0.4); }
  .qtype-chip.active { background: rgba(212,175,55,0.1); border-color: #d4af37; }
  .qtype-chip input[type="checkbox"] { accent-color: #d4af37; width: 16px; height: 16px; }
  .qtype-chip .chip-count { width: 50px; }
  .qtype-label { font-size: 13px; font-weight: 500; flex: 1; }

  .generate-btn {
    width: 100%; padding: 16px;
    background: linear-gradient(135deg, #d4af37, #b8860b);
    color: #0d1117; border: none; border-radius: 10px;
    font-family: 'Playfair Display', serif;
    font-size: 16px; font-weight: 700; letter-spacing: 1px;
    cursor: pointer; transition: all 0.25s;
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }
  .generate-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(212,175,55,0.35); }
  .generate-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* ── Loading ── */
  .loading-box {
    text-align: center; padding: 48px 20px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(212,175,55,0.1);
    border-radius: 12px; margin-bottom: 24px;
  }
  .spinner {
    width: 48px; height: 48px;
    border: 3px solid rgba(212,175,55,0.15);
    border-top-color: #d4af37; border-radius: 50%;
    animation: spin 0.9s linear infinite;
    margin: 0 auto 20px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text { font-family: 'Playfair Display', serif; font-size: 18px; color: #d4af37; margin-bottom: 8px; }
  .loading-sub { font-size: 13px; color: #5a5040; }

  /* ── Paper output ── */
  .paper {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(212,175,55,0.15);
    border-radius: 12px; overflow: hidden; margin-bottom: 20px;
  }
  .paper-header {
    background: linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.05));
    border-bottom: 1px solid rgba(212,175,55,0.2);
    padding: 24px 28px;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 12px;
  }
  .paper-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #f0e6cc; }
  .paper-meta { font-size: 12px; color: #8a7d6b; margin-top: 4px; }
  .action-btns { display: flex; gap: 8px; flex-shrink: 0; }
  .btn-outline {
    padding: 8px 16px; background: transparent;
    border: 1px solid rgba(212,175,55,0.35); border-radius: 8px;
    color: #d4af37; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; font-family: 'Hind', sans-serif;
  }
  .btn-outline:hover { background: rgba(212,175,55,0.1); border-color: #d4af37; }
  .btn-solid {
    padding: 8px 16px;
    background: linear-gradient(135deg, #d4af37, #b8860b);
    border: none; border-radius: 8px; color: #0d1117;
    font-size: 13px; font-weight: 700; cursor: pointer;
    transition: all 0.2s; font-family: 'Hind', sans-serif;
  }
  .btn-solid:hover { opacity: 0.9; transform: translateY(-1px); }
  .paper-body { padding: 28px; }
  .section-block { margin-bottom: 32px; }
  .section-heading {
    font-family: 'Playfair Display', serif;
    font-size: 16px; font-weight: 700; color: #d4af37;
    border-bottom: 1px solid rgba(212,175,55,0.2);
    padding-bottom: 10px; margin-bottom: 18px;
    display: flex; align-items: center; gap: 10px;
  }
  .section-icon {
    background: rgba(212,175,55,0.1);
    border: 1px solid rgba(212,175,55,0.25);
    border-radius: 6px; padding: 3px 8px;
    font-size: 11px; font-weight: 700; letter-spacing: 1px;
  }
  .question-item {
    display: flex; gap: 14px; margin-bottom: 18px;
    padding-bottom: 18px; border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .question-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .q-num {
    width: 28px; height: 28px;
    background: rgba(212,175,55,0.1);
    border: 1px solid rgba(212,175,55,0.25); border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #d4af37;
    flex-shrink: 0; margin-top: 1px;
  }
  .q-content { flex: 1; }
  .q-text { font-size: 14px; line-height: 1.65; color: #e0d4bc; margin-bottom: 8px; }
  .q-options {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 4px 16px; margin-top: 6px;
  }
  @media (max-width: 500px) { .q-options { grid-template-columns: 1fr; } }
  .q-option { font-size: 13px; color: #8a7d6b; padding: 2px 0; }
  .q-difficulty {
    display: inline-block; font-size: 10px; font-weight: 700;
    letter-spacing: 1px; padding: 2px 8px; border-radius: 4px;
    margin-bottom: 6px; text-transform: uppercase;
  }
  .diff-easy { background: rgba(34,197,94,0.12); color: #4ade80; border: 1px solid rgba(74,222,128,0.2); }
  .diff-medium { background: rgba(251,191,36,0.12); color: #fbbf24; border: 1px solid rgba(251,191,36,0.2); }
  .diff-hard { background: rgba(239,68,68,0.12); color: #f87171; border: 1px solid rgba(248,113,113,0.2); }

  /* ── Answer Key ── */
  .answer-key-panel {
    background: rgba(255,255,255,0.015);
    border: 1px solid rgba(212,175,55,0.1);
    border-radius: 10px; margin-top: 24px; overflow: hidden;
  }
  .ak-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px;
    background: rgba(212,175,55,0.06);
    cursor: pointer; border-bottom: 1px solid rgba(212,175,55,0.1);
  }
  .ak-title {
    font-family: 'Playfair Display', serif;
    font-size: 15px; font-weight: 700; color: #d4af37;
    display: flex; align-items: center; gap: 8px;
  }
  .ak-body { padding: 18px; }
  .ak-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px; }
  .ak-item {
    display: flex; gap: 10px; align-items: flex-start;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 8px; padding: 8px 12px; font-size: 13px;
  }
  .ak-num { color: #d4af37; font-weight: 700; min-width: 24px; }
  .ak-ans { color: #b8a88a; line-height: 1.4; }

  .stats-bar {
    display: flex; gap: 20px; flex-wrap: wrap;
    padding: 16px 28px;
    border-top: 1px solid rgba(212,175,55,0.1);
    background: rgba(212,175,55,0.02);
  }
  .stat { display: flex; align-items: center; gap: 8px; font-size: 13px; }
  .stat-dot { width: 8px; height: 8px; border-radius: 50%; }
  .stat-label { color: #5a5040; }
  .stat-val { color: #d4af37; font-weight: 700; }

  .error-box {
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 10px; padding: 20px;
    color: #f87171; font-size: 14px; text-align: center;
  }

  /* ── Payment Modal ── */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(4px);
    z-index: 200;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }
  .modal {
    background: #0d1117;
    border: 1px solid rgba(212,175,55,0.25);
    border-radius: 16px;
    padding: 36px 32px;
    width: 100%; max-width: 420px;
    position: relative;
  }
  .modal-close {
    position: absolute; top: 16px; right: 16px;
    background: rgba(255,255,255,0.05); border: none;
    color: #8a7d6b; width: 28px; height: 28px; border-radius: 50%;
    cursor: pointer; font-size: 16px; display: flex;
    align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .modal-close:hover { background: rgba(255,255,255,0.1); color: #e8dcc8; }
  .modal h2 {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700; color: #f0e6cc;
    margin-bottom: 6px;
    display: flex; align-items: center; gap: 10px;
  }
  .modal-sub { font-size: 13px; color: #8a7d6b; margin-bottom: 24px; }

  .plan-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
  .plan-card {
    border: 2px solid rgba(212,175,55,0.15);
    border-radius: 12px; padding: 18px 14px;
    cursor: pointer; transition: all 0.2s; text-align: center;
    background: rgba(255,255,255,0.02);
  }
  .plan-card:hover { border-color: rgba(212,175,55,0.4); }
  .plan-card.selected { border-color: #d4af37; background: rgba(212,175,55,0.08); }
  .plan-price {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 800; color: #d4af37;
  }
  .plan-dur { font-size: 12px; color: #8a7d6b; margin-top: 4px; }
  .plan-save {
    font-size: 11px; font-weight: 700; color: #4ade80;
    background: rgba(34,197,94,0.1); border-radius: 4px;
    padding: 2px 6px; margin-top: 6px; display: inline-block;
  }

  .features-list { margin-bottom: 24px; }
  .feature-item {
    display: flex; align-items: center; gap: 10px;
    font-size: 13px; color: #b8a88a; padding: 6px 0;
    border-bottom: 1px solid rgba(255,255,255,0.03);
  }
  .feature-item:last-child { border-bottom: none; }
  .feature-check { color: #4ade80; font-weight: 700; }

  .pay-btn {
    width: 100%; padding: 15px;
    background: linear-gradient(135deg, #d4af37, #b8860b);
    color: #0d1117; border: none; border-radius: 10px;
    font-family: 'Playfair Display', serif;
    font-size: 15px; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .pay-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
  .pay-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .pay-note { font-size: 11px; color: #5a5040; text-align: center; margin-top: 10px; }

  /* ── Success toast ── */
  .toast {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    background: rgba(34,197,94,0.15);
    border: 1px solid rgba(34,197,94,0.3);
    border-radius: 10px; padding: 14px 24px;
    color: #4ade80; font-size: 14px; font-weight: 600;
    z-index: 300; white-space: nowrap;
    animation: slideUp 0.3s ease;
  }
  @keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
`;

// ── Constants ────────────────────────────────────────────────────
const QUESTION_TYPES = [
  { id: "mcq", label: "MCQ", icon: "⓪", defaultCount: 20 },
  { id: "short", label: "Short Answer", icon: "✎", defaultCount: 15 },
  { id: "long", label: "Long Answer", icon: "≡", defaultCount: 10 },
  { id: "truefalse", label: "True / False", icon: "✓✗", defaultCount: 5 },
];
const DIFFICULTY_LABELS = { easy: "Easy", medium: "Medium", hard: "Hard" };
const FREE_LIMIT = 3;

// ── Prompt builder ───────────────────────────────────────────────
function buildPrompt(form, types) {
  const activeTypes = types.filter(t => t.enabled);
  const breakdown = activeTypes.map(t => `- ${t.count} ${t.label} questions`).join("\n");
  return `You are an expert Indian school teacher creating a question paper.
Subject: ${form.subject}
Class/Grade: ${form.grade}
Chapter/Topic: ${form.topic}
${form.board ? `Board: ${form.board}` : ""}
${form.language ? `Language: ${form.language}` : ""}
${form.notes ? `Special Instructions: ${form.notes}` : ""}

Generate the following questions:
${breakdown}

For EACH question include:
1. The question text
2. Difficulty: easy | medium | hard
3. For MCQ: 4 options (A, B, C, D) and mark correct answer
4. For True/False: mark correct answer
5. For Short/Long: provide model answer

Return ONLY valid JSON:
{
  "sections": [
    {
      "type": "mcq",
      "label": "Section A: Multiple Choice Questions",
      "questions": [
        { "q": "question text", "difficulty": "easy", "options": ["A. opt1","B. opt2","C. opt3","D. opt4"], "answer": "B. opt2" }
      ]
    }
  ]
}
Only include requested sections. Return pure JSON, no markdown.`;
}

// ── Razorpay loader ──────────────────────────────────────────────
function loadRazorpayScript() {
  return new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

// ── Free paper count helpers ─────────────────────────────────────
function getTodayCount() {
  const today = new Date().toDateString();
  const stored = JSON.parse(localStorage.getItem("psp_usage") || "{}");
  if (stored.date !== today) return 0;
  return stored.count || 0;
}
function incrementTodayCount() {
  const today = new Date().toDateString();
  const count = getTodayCount() + 1;
  localStorage.setItem("psp_usage", JSON.stringify({ date: today, count }));
  return count;
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  // Auth
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authChecking, setAuthChecking] = useState(true);

  // Premium
  const [isPremium, setIsPremium] = useState(false);
  const [premiumUntil, setPremiumUntil] = useState(null);
  const [todayCount, setTodayCount] = useState(getTodayCount());

  // Payment modal
  const [showPayment, setShowPayment] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [payLoading, setPayLoading] = useState(false);

  // Generator
  const [form, setForm] = useState({
    subject: "", grade: "", topic: "", board: "CBSE", language: "English", notes: ""
  });
  const [types, setTypes] = useState(
    QUESTION_TYPES.map(t => ({ ...t, enabled: t.id === "mcq" || t.id === "short" || t.id === "long", count: t.defaultCount }))
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [toast, setToast] = useState("");

  // ── Auth init ─────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        checkPremium(session.user.id);
      }
      setAuthChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        checkPremium(session.user.id);
      } else {
        setUser(null);
        setIsPremium(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Check premium status ──────────────────────────────────────
  const checkPremium = async (uid) => {
    try {
      const res = await fetch(`/api/status?userId=${uid}`);
      const data = await res.json();
      setIsPremium(data.isPremium || false);
      setPremiumUntil(data.until || null);
    } catch (e) {
      setIsPremium(false);
    }
  };

  // ── Sign in ───────────────────────────────────────────────────
  const handleSignIn = async () => {
    setAuthError(""); setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: authForm.email, password: authForm.password
    });
    if (error) setAuthError(error.message);
    setAuthLoading(false);
  };

  // ── Sign up ───────────────────────────────────────────────────
  const handleSignUp = async () => {
    setAuthError(""); setAuthLoading(true);
    if (!authForm.name) { setAuthError("Name enter koro"); setAuthLoading(false); return; }
    const { data, error } = await supabase.auth.signUp({
      email: authForm.email, password: authForm.password,
      options: { data: { full_name: authForm.name } }
    });
    if (error) { setAuthError(error.message); setAuthLoading(false); return; }
    if (data.user) {
      await supabase.from("users").insert({
        id: data.user.id, name: authForm.name, email: authForm.email
      }).select().single();
    }
    setAuthLoading(false);
    showToast("✅ Account তৈরি হয়েছে! Login করো।");
    setAuthMode("login");
  };

  // ── Sign out ──────────────────────────────────────────────────
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // ── Generate ──────────────────────────────────────────────────
  const generate = async () => {
    if (!form.subject || !form.grade || !form.topic) {
      setError("Subject, Class আর Topic দেওয়া দরকার!"); return;
    }
    if (types.every(t => !t.enabled)) {
      setError("কমপক্ষে একটা question type select কর।"); return;
    }
    if (!isPremium && todayCount >= FREE_LIMIT) {
      setShowPayment(true); return;
    }
    setLoading(true); setError(null); setResult(null);
    try {
      const prompt = buildPrompt(form, types);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      const raw = (data.text || "").trim();
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      if (!isPremium) {
        const newCount = incrementTodayCount();
        setTodayCount(newCount);
      }
    } catch (e) {
      setError("কিছু সমস্যা হয়েছে! আবার try করো। Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Payment ───────────────────────────────────────────────────
  const handlePayment = async () => {
    setPayLoading(true);
    const ok = await loadRazorpayScript();
    if (!ok) { setPayLoading(false); alert("Razorpay load hoyni!"); return; }

    const amount = selectedMonths === 3 ? 249 : 99;
    try {
      // Create order
      const orderRes = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, amount })
      });
      const { orderId } = await orderRes.json();

      // Open Razorpay
      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        name: "PSP Digital Services",
        description: `AI Question Paper Premium — ${selectedMonths} মাস`,
        order_id: orderId,
        prefill: { email: user.email },
        theme: { color: "#d4af37" },
        handler: async function (response) {
          // Verify + activate
          const verifyRes = await fetch("/api/payment", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id,
              months: selectedMonths,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setIsPremium(true);
            setPremiumUntil(verifyData.until);
            setShowPayment(false);
            showToast("🎉 Premium active হয়েছে! " + verifyData.until + " পর্যন্ত");
          } else {
            alert("Payment verify hoyni! Support-e contact koro.");
          }
        }
      });
      rzp.on("payment.failed", () => {
        alert("Payment failed. Abar try koro.");
      });
      rzp.open();
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setPayLoading(false);
    }
  };

  // ── Toast ─────────────────────────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  // ── Helpers ───────────────────────────────────────────────────
  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleType = (id) => setTypes(ts => ts.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
  const setTypeCount = (id, val) => setTypes(ts => ts.map(t => t.id === id ? { ...t, count: Math.max(1, Math.min(30, Number(val) || 1)) } : t));
  const totalQ = types.filter(t => t.enabled).reduce((s, t) => s + t.count, 0);
  const totalGenerated = result ? result.sections.reduce((s, sec) => s + sec.questions.length, 0) : 0;
  const countByDiff = (d) => result ? result.sections.flatMap(s => s.questions).filter(q => q.difficulty === d).length : 0;

  const handleCopy = () => {
    if (!result) return;
    let text = `QUESTION PAPER\nSubject: ${form.subject} | Class: ${form.grade} | Topic: ${form.topic}\n${"=".repeat(60)}\n\n`;
    result.sections.forEach(sec => {
      text += `\n${sec.label.toUpperCase()}\n${"-".repeat(40)}\n`;
      sec.questions.forEach((q, i) => {
        text += `\n${i + 1}. ${q.q}\n`;
        if (q.options) q.options.forEach(o => { text += `   ${o}\n`; });
      });
    });
    navigator.clipboard.writeText(text).catch(() => {});
    showToast("📋 Copied!");
  };

  // ── Loading screen ────────────────────────────────────────────
  if (authChecking) {
    return (
      <>
        <style>{css}</style>
        <div className="app" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
          <div className="bg-pattern" />
          <div style={{ textAlign: "center" }}>
            <div className="spinner" />
            <div style={{ color: "#d4af37", fontFamily: "'Playfair Display', serif" }}>Loading...</div>
          </div>
        </div>
      </>
    );
  }

  // ── Auth Screen ───────────────────────────────────────────────
  if (!user) {
    return (
      <>
        <style>{css}</style>
        <div className="app">
          <div className="bg-pattern" />
          <div className="auth-wrap">
            <div className="auth-card">
              <div className="auth-logo">
                <div className="badge">PSP Digital Services</div>
                <h1>AI Question<br /><span>Paper Generator</span></h1>
              </div>
              <div className="auth-tabs">
                <button className={`auth-tab ${authMode === "login" ? "active" : ""}`} onClick={() => { setAuthMode("login"); setAuthError(""); }}>Login</button>
                <button className={`auth-tab ${authMode === "signup" ? "active" : ""}`} onClick={() => { setAuthMode("signup"); setAuthError(""); }}>Sign Up</button>
              </div>
              {authMode === "signup" && (
                <div className="auth-field">
                  <label>Your Name</label>
                  <input placeholder="Full name" value={authForm.name} onChange={e => setAuthForm(f => ({ ...f, name: e.target.value }))} />
                </div>
              )}
              <div className="auth-field">
                <label>Email</label>
                <input type="email" placeholder="your@email.com" value={authForm.email} onChange={e => setAuthForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="auth-field">
                <label>Password</label>
                <input type="password" placeholder="••••••••" value={authForm.password} onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))} onKeyDown={e => e.key === "Enter" && (authMode === "login" ? handleSignIn() : handleSignUp())} />
              </div>
              <button className="auth-btn" onClick={authMode === "login" ? handleSignIn : handleSignUp} disabled={authLoading}>
                {authLoading ? "⏳ Wait..." : authMode === "login" ? "🔐 Login" : "✨ Account তৈরি করো"}
              </button>
              {authError && <div className="auth-error">⚠️ {authError}</div>}
              {authMode === "login" && (
                <p style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#5a5040" }}>
                  Free plan-এ দিনে {FREE_LIMIT}টা paper generate করা যাবে।
                </p>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Main App ──────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="bg-pattern" />

        {/* Navbar */}
        <div className="navbar">
          <div className="nav-brand">PSP Digital Services</div>
          <div className="nav-right">
            <span className={`plan-badge ${isPremium ? "plan-premium" : "plan-free"}`}>
              {isPremium ? `⭐ Premium${premiumUntil ? ` · ${premiumUntil}` : ""}` : "Free Plan"}
            </span>
            {!isPremium && (
              <button className="upgrade-link" onClick={() => setShowPayment(true)}>⬆ Upgrade</button>
            )}
            <button className="nav-btn" onClick={handleSignOut}>Logout</button>
          </div>
        </div>

        <div className="container">
          <div className="header">
            <div className="badge">AI Powered</div>
            <h1 className="title">AI Question Paper<br /><span>Generator</span></h1>
            <div className="divider" />
            <p className="subtitle">Teachers-এর ৫-৬ ঘণ্টার কাজ — এখন মাত্র ৬০ সেকেন্ডে ✨</p>
          </div>

          {/* Free limit bar */}
          {!isPremium && (
            <div className="limit-bar">
              <div className="limit-info">
                আজকের paper: <strong>{todayCount}/{FREE_LIMIT}</strong> ব্যবহার হয়েছে
                {todayCount >= FREE_LIMIT && " · Limit শেষ!"}
              </div>
              <button className="upgrade-link" onClick={() => setShowPayment(true)}>
                👑 Premium নাও — ₹99/মাস
              </button>
            </div>
          )}

          {/* Form */}
          <div className="form-card">
            <div className="form-section-title">Paper Details</div>
            <div className="fields-grid">
              <div className="field">
                <label>Subject *</label>
                <input placeholder="e.g. Science, Mathematics" value={form.subject} onChange={e => setField("subject", e.target.value)} />
              </div>
              <div className="field">
                <label>Class / Grade *</label>
                <select value={form.grade} onChange={e => setField("grade", e.target.value)}>
                  <option value="">Select Class</option>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(c => <option key={c} value={`Class ${c}`}>Class {c}</option>)}
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Competitive Exam">Competitive Exam</option>
                </select>
              </div>
              <div className="field full">
                <label>Chapter / Topic *</label>
                <input placeholder="e.g. Photosynthesis, Linear Equations" value={form.topic} onChange={e => setField("topic", e.target.value)} />
              </div>
              <div className="field">
                <label>Board</label>
                <select value={form.board} onChange={e => setField("board", e.target.value)}>
                  {["CBSE","ICSE","WBCHSE","State Board","Other"].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Language</label>
                <select value={form.language} onChange={e => setField("language", e.target.value)}>
                  {["English","Hindi","Bengali","Mixed (Hinglish)"].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="field full">
                <label>Special Instructions (Optional)</label>
                <textarea placeholder="e.g. Focus on numericals, NCERT aligned..." value={form.notes} onChange={e => setField("notes", e.target.value)} />
              </div>
            </div>

            <div className="form-section-title">Question Types & Count</div>
            <div className="qtype-row">
              {types.map(t => (
                <div key={t.id} className={`qtype-chip ${t.enabled ? "active" : ""}`} onClick={() => toggleType(t.id)}>
                  <input type="checkbox" checked={t.enabled} readOnly />
                  <span className="qtype-label">{t.icon} {t.label}</span>
                  {t.enabled && (
                    <input type="number" className="chip-count" value={t.count} min={1} max={30}
                      onClick={e => e.stopPropagation()}
                      onChange={e => { e.stopPropagation(); setTypeCount(t.id, e.target.value); }} />
                  )}
                </div>
              ))}
            </div>
            {totalQ > 0 && <p style={{ fontSize: 13, color: "#8a7d6b", marginBottom: 20, textAlign: "right" }}>Total: <span style={{ color: "#d4af37", fontWeight: 700 }}>{totalQ}</span></p>}

            <button className="generate-btn" onClick={generate} disabled={loading}>
              {loading ? "⏳ Generating..." : !isPremium && todayCount >= FREE_LIMIT ? "🔒 Upgrade করো Generate করতে" : `⚡ Generate Paper (${totalQ} Questions)`}
            </button>
          </div>

          {error && <div className="error-box">⚠️ {error}</div>}

          {loading && (
            <div className="loading-box">
              <div className="spinner" />
              <div className="loading-text">AI Paper বানাচ্ছে...</div>
              <div className="loading-sub">{form.topic} — {form.subject} — {form.grade}</div>
            </div>
          )}

          {result && (
            <div className="paper">
              <div className="paper-header">
                <div>
                  <div className="paper-title">📄 {form.subject} — {form.topic}</div>
                  <div className="paper-meta">{form.grade} · {form.board} · {form.language} · {totalGenerated} Questions</div>
                </div>
                <div className="action-btns">
                  <button className="btn-outline" onClick={handleCopy}>📋 Copy</button>
                  <button className="btn-solid" onClick={() => window.print()}>🖨️ Print</button>
                </div>
              </div>
              <div className="stats-bar">
                {[["easy","#4ade80"],["medium","#fbbf24"],["hard","#f87171"]].map(([d,c]) => (
                  <div className="stat" key={d}>
                    <div className="stat-dot" style={{ background: c }} />
                    <span className="stat-label">{d.charAt(0).toUpperCase()+d.slice(1)}:</span>
                    <span className="stat-val">{countByDiff(d)}</span>
                  </div>
                ))}
                <div className="stat">
                  <div className="stat-dot" style={{ background: "#d4af37" }} />
                  <span className="stat-label">Total:</span>
                  <span className="stat-val">{totalGenerated}</span>
                </div>
              </div>
              <div className="paper-body">
                {result.sections.map((sec, si) => (
                  <div className="section-block" key={si}>
                    <div className="section-heading">
                      <span className="section-icon">{sec.type.toUpperCase()}</span>
                      {sec.label}
                    </div>
                    {sec.questions.map((q, qi) => (
                      <div className="question-item" key={qi}>
                        <div className="q-num">{qi + 1}</div>
                        <div className="q-content">
                          <span className={`q-difficulty diff-${q.difficulty}`}>{DIFFICULTY_LABELS[q.difficulty] || q.difficulty}</span>
                          <div className="q-text">{q.q}</div>
                          {q.options && <div className="q-options">{q.options.map((op, oi) => <div className="q-option" key={oi}>{op}</div>)}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                <div className="answer-key-panel">
                  <div className="ak-header" onClick={() => setShowAnswers(!showAnswers)}>
                    <div className="ak-title">🔑 Answer Key {showAnswers ? "▲" : "▼"}</div>
                    <div style={{ fontSize: 12, color: "#5a5040" }}>{showAnswers ? "Hide" : "Show"} answers</div>
                  </div>
                  {showAnswers && (
                    <div className="ak-body">
                      <div className="ak-grid">
                        {result.sections.flatMap((sec, si) =>
                          sec.questions.map((q, qi) => ({
                            num: result.sections.slice(0, si).reduce((s, s2) => s + s2.questions.length, 0) + qi + 1,
                            ans: q.answer
                          }))
                        ).map(item => (
                          <div className="ak-item" key={item.num}>
                            <div className="ak-num">{item.num}.</div>
                            <div className="ak-ans">{item.ans}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Modal */}
        {showPayment && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowPayment(false)}>
            <div className="modal">
              <button className="modal-close" onClick={() => setShowPayment(false)}>✕</button>
              <h2>👑 PSP Premium Plan</h2>
              <p className="modal-sub">একবার pay করো — automatic premium active হবে!</p>

              <div className="plan-cards">
                <div className={`plan-card ${selectedMonths === 1 ? "selected" : ""}`} onClick={() => setSelectedMonths(1)}>
                  <div className="plan-price">₹99</div>
                  <div className="plan-dur">১ মাস</div>
                </div>
                <div className={`plan-card ${selectedMonths === 3 ? "selected" : ""}`} onClick={() => setSelectedMonths(3)}>
                  <div className="plan-price">₹249</div>
                  <div className="plan-dur">৩ মাস</div>
                  <div className="plan-save">₹48 সাশ্রয়!</div>
                </div>
              </div>

              <div className="features-list">
                {[
                  "Unlimited papers per day",
                  "Long Answer + True/False",
                  "Answer Key auto generate",
                  "Easy / Medium / Hard difficulty",
                  "Bengali + English support",
                  "সরাসরি Print"
                ].map(f => (
                  <div className="feature-item" key={f}>
                    <span className="feature-check">✅</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <button className="pay-btn" onClick={handlePayment} disabled={payLoading}>
                {payLoading ? "⏳ Processing..." : `💳 Razorpay-তে Pay করো — ₹${selectedMonths === 3 ? 249 : 99}`}
              </button>
              <p className="pay-note">✅ Secure payment • Payment হলেই auto Premium active হবে</p>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
