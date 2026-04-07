const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, subject, grade, chapter, board, language, instructions, questionTypes, answerKey } = req.body;

  let serverPremium = false;
  if (userId) {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase.from('subscriptions').select('id').eq('user_id', userId).eq('status', 'active').gte('expires_at', today).limit(1).single();
    serverPremium = !!data;
  }

  const { mcq, short, long, truefalse, difficulty } = questionTypes;
  let qParts = [];
  if (mcq > 0) qParts.push(`${mcq} MCQ questions (4 options, mark correct answer)`);
  if (short > 0) qParts.push(`${short} Short Answer questions`);
  if (serverPremium && long > 0) qParts.push(`${long} Long Answer questions`);
  if (serverPremium && truefalse > 0) qParts.push(`${truefalse} True/False questions`);

  const langLine = language === 'Bengali' ? 'Write entire paper in Bengali.' : 'Write in English.';
  const answerLine = serverPremium && answerKey ? 'After all questions add ANSWER KEY section.' : '';

  const prompt = `You are an expert ${board} teacher. Create a question paper.
Subject: ${subject}, Class: ${grade}, Chapter: ${chapter}, Board: ${board}
${instructions ? 'Instructions: ' + instructions : ''}
${langLine}
${serverPremium && difficulty ? 'Difficulty: ' + difficulty : ''}
Include: ${qParts.join(', ')}
Format: School:___ Date:___ Marks:___ with section headings.
${answerLine}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], max_tokens: serverPremium ? 3000 : 1200 })
    });
    const data = await response.json();
    if (data.choices?.[0]) return res.json({ paper: data.choices[0].message.content });
    return res.status(500).json({ error: 'Generation failed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
