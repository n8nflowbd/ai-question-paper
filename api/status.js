const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const { userId } = req.query;
  if (!userId) return res.json({ isPremium: false });

  const today = new Date().toISOString().split('T')[0];

  const { data } = await supabase
    .from('subscriptions')
    .select('expires_at')
    .eq('user_id', userId)
    .eq('status', 'active')
    .gte('expires_at', today)
    .order('expires_at', { ascending: false })
    .limit(1)
    .single();

  if (data) return res.json({ isPremium: true, until: data.expires_at });
  return res.json({ isPremium: false });
}
