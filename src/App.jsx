import { useState, useRef } from "react";

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

  .header {
    text-align: center;
    margin-bottom: 48px;
  }

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

  .subtitle {
    color: #8a7d6b;
    font-size: 15px;
    line-height: 1.6;
  }

  .divider {
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #d4af37, transparent);
    margin: 20px auto;
  }

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

  .qtype-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }

  .qtype-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(212,175,55,0.15);
    border-radius: 8px;
    padding: 8px 14px;
    cursor: pointer;
    transition: all 0.2s;
    flex: 1;
    min-width: 140px;
    user-select: none;
  }

  .qtype-chip:hover { border-color: rgba(212,175,55,0.4); }
  .qtype-chip.active { background: rgba(212,175,55,0.1); border-color: #d4af37; }
  .qtype-chip input[type="checkbox"] { accent-color: #d4af37; width: 16px; height: 16px; }
  .qtype-chip .chip-count { width: 50px; }
  .qtype-label { font-size: 13px; font-weight: 500; flex: 1; }

  .generate-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #d4af37, #b8860b);
    color: #0d1117;
    border: none;
    border-radius: 10px;
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.25s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .generate-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(212,175,55,0.35);
  }

  .generate-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .loading-box {
    text-align: center;
    padding: 48px 20px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(212,175,55,0.1);
    border-radius: 12px;
    margin-bottom: 24px;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 3px solid rgba(212,175,55,0.15);
    border-top-color: #d4af37;
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
    margin: 0 auto 20px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .loading-text { font-family: 'Playfair Display', serif; font-size: 18px; color: #d4af37; margin-bottom: 8px; }
  .loading-sub { font-size: 13px; color: #5a5040; }

  .paper {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(212,175,55,0.15);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 20px;
  }

  .paper-header {
    background: linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.05));
    border-bottom: 1px solid rgba(212,175,55,0.2);
    padding: 24px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }

  .paper-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #f0e6cc; }
  .paper-meta { font-size: 12px; color: #8a7d6b; margin-top: 4px; }

  .action-btns { display: flex; gap: 8px; flex-shrink: 0; }

  .btn-outline {
    padding: 8px 16px;
    background: transparent;
    border: 1px solid rgba(212,175,55,0.35);
    border-radius: 8px;
    color: #d4af37;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Hind', sans-serif;
  }

  .btn-outline:hover { background: rgba(212,175,55,0.1); border-color: #d4af37; }

  .btn-solid {
    padding: 8px 16px;
    background: linear-gradient(135deg, #d4af37, #b8860b);
    border: none;
    border-radius: 8px;
    color: #0d1117;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Hind', sans-serif;
  }

  .btn-solid:hover { opacity: 0.9; transform: translateY(-1px); }

  .paper-body { padding: 28px; }

  .section-block { margin-bottom: 32px; }

  .section-heading {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    font-weight: 700;
    color: #d4af37;
    border-bottom: 1px solid rgba(212,175,55,0.2);
    padding-bottom: 10px;
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .section-icon {
    background: rgba(212,175,55,0.1);
    border: 1px solid rgba(212,175,55,0.25);
    border-radius: 6px;
    padding: 3px 8px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
  }

  .question-item {
    display: flex;
    gap: 14px;
    margin-bottom: 18px;
    padding-bottom: 18px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }

  .question-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }

  .q-num {
    width: 28px;
    height: 28px;
    background: rgba(212,175,55,0.1);
    border: 1px solid rgba(212,175,55,0.25);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: #d4af37;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .q-content { flex: 1; }
  .q-text { font-size: 14px; line-height: 1.65; color: #e0d4bc; margin-bottom: 8px; }

  .q-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px 16px;
    margin-top: 6px;
  }

  @media (max-width: 500px) { .q-options { grid-template-columns: 1fr; } }
  .q-option { font-size: 13px; color: #8a7d6b; padding: 2px 0; }

  .q-difficulty {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    padding: 2px 8px;
    border-radius: 4px;
    margin-bottom: 6px;
    text-transform: uppercase;
  }

  .diff-easy { background: rgba(34,197,94,0.12); color: #4ade80; border: 1px solid rgba(74,222,128,0.2); }
  .diff-medium { background: rgba(251,191,36,0.12); color: #fbbf24; border: 1px solid rgba(251,191,36,0.2); }
  .diff-hard { background: rgba(239,68,68,0.12); color: #f87171; border: 1px solid rgba(248,113,113,0.2); }

  .answer-key-panel {
    background: rgba(255,255,255,0.015);
    border: 1px solid rgba(212,175,55,0.1);
    border-radius: 10px;
    margin-top: 24px;
    overflow: hidden;
  }

  .ak-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    background: rgba(212,175,55,0.06);
    cursor: pointer;
    border-bottom: 1px solid rgba(212,175,55,0.1);
  }

  .ak-title {
    font-family: 'Playfair Display', serif;
    font-size: 15px;
    font-weight: 700;
    color: #d4af37;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ak-body { padding: 18px; }

  .ak-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 8px;
  }

  .ak-item {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 13px;
  }

  .ak-num { color: #d4af37; font-weight: 700; min-width: 24px; }
  .ak-ans { color: #b8a88a; line-height: 1.4; }

  .stats-bar {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
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
    border-radius: 10px;
    padding: 20px;
    color: #f87171;
    font-size: 14px;
    text-align: center;
  }
`;

const QUESTION_TYPES = [
  { id: "mcq", label: "MCQ", icon: "⓪", defaultCount: 20 },
  { id: "short", label: "Short Answer", icon: "✎", defaultCount: 15 },
  { id: "long", label: "Long Answer", icon: "≡", defaultCount: 10 },
  { id: "truefalse", label: "True / False", icon: "✓✗", defaultCount: 5 },
];

const DIFFICULTY_LABELS = { easy: "Easy", medium: "Medium", hard: "Hard" };

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

For EACH question, include:
1. The question text
2. Difficulty: easy | medium | hard
3. For MCQ: 4 options (A, B, C, D) and mark correct answer
4. For True/False: mark correct answer
5. For Short/Long: provide model answer

Return ONLY valid JSON in this exact structure:
{
  "sections": [
    {
      "type": "mcq",
      "label": "Section A: Multiple Choice Questions",
      "questions": [
        {
          "q": "question text",
          "difficulty": "easy",
          "options": ["A. opt1", "B. opt2", "C. opt3", "D. opt4"],
          "answer": "B. opt2"
        }
      ]
    }
  ]
}

Only include sections that were requested. Return pure JSON, no markdown, no explanation.`;
}

export default function App() {
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

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleType = (id) => setTypes(ts => ts.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
  const setTypeCount = (id, val) => setTypes(ts => ts.map(t => t.id === id ? { ...t, count: Math.max(1, Math.min(30, Number(val) || 1)) } : t));
  const totalQ = types.filter(t => t.enabled).reduce((s, t) => s + t.count, 0);

  const generate = async () => {
    if (!form.subject || !form.grade || !form.topic) { setError("Subject, Class aur Topic bharna zaroori hai!"); return; }
    if (types.every(t => !t.enabled)) { setError("Kam se kam ek question type select karo."); return; }
    setLoading(true); setError(null); setResult(null);
    try {
      const prompt = buildPrompt(form, types);
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 8000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      const raw = data.content?.map(c => c.text || "").join("").trim();
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (e) {
      setError("Kuch gadbad ho gayi! Dobara try karo. Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    let text = `QUESTION PAPER\nSubject: ${form.subject} | Class: ${form.grade} | Topic: ${form.topic}\n${"=".repeat(60)}\n\n`;
    result.sections.forEach(sec => {
      text += `\n${sec.label.toUpperCase()}\n${"-".repeat(40)}\n`;
      sec.questions.forEach((q, i) => { text += `\n${i + 1}. ${q.q}\n`; if (q.options) q.options.forEach(o => { text += `   ${o}\n`; }); });
    });
    navigator.clipboard.writeText(text).catch(() => {});
    alert("Copied!");
  };

  const totalGenerated = result ? result.sections.reduce((s, sec) => s + sec.questions.length, 0) : 0;
  const countByDiff = (d) => result ? result.sections.flatMap(s => s.questions).filter(q => q.difficulty === d).length : 0;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="bg-pattern" />
        <div className="container">
          <div className="header">
            <div className="badge">PSP Digital Services</div>
            <h1 className="title">AI Question Paper<br /><span>Generator</span></h1>
            <div className="divider" />
            <p className="subtitle">Teachers ka 5-6 ghante ka kaam — ab sirf 60 seconds mein ✨</p>
          </div>

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
              {loading ? "⏳ Generating..." : `⚡ Generate Question Paper (${totalQ} Questions)`}
            </button>
          </div>

          {error && <div className="error-box">⚠️ {error}</div>}

          {loading && (
            <div className="loading-box">
              <div className="spinner" />
              <div className="loading-text">AI Paper Bana Raha Hai...</div>
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
      </div>
    </>
  );
}
