import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { action, name, email, phone, password } = req.body;

  if (action === 'signup') {
    const { data: existing } = await supabase.from('users').select('id').eq('email', email.toLowerCase()).single();
    if (existing) return res.json({ error: 'এই email দিয়ে আগেই account আছে।' });
    const hash = await bcrypt.hash(password, 8);
    const { data: newUser, error } = await supabase.from('users').insert({ name, email: email.toLowerCase(), phone, password_hash: hash }).select('id, name, email, phone').single();
    if (error) return res.json({ error: 'Account তৈরি হয়নি।' });
    return res.json({ user: newUser });
  }

  if (action === 'login') {
    const { data: u } = await supabase.from('users').select('id, name, email, phone, password_hash').eq('email', email.toLowerCase()).single();
    if (!u) return res.json({ error: 'Email বা password ভুল' });
    const ok = await bcrypt.compare(password, u.password_hash);
    if (!ok) return res.json({ error: 'Email বা password ভুল' });
    const { password_hash, ...safeUser } = u;
    return res.json({ user: safeUser });
  }
}
