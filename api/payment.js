const Razorpay = require('razorpay');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    if (req.method === 'POST') {
      const { userId, amount } = req.body;
      const order = await razorpay.orders.create({
        amount: parseInt(amount) * 100,
        currency: 'INR',
        receipt: `psp_${Date.now()}`,
      });
      return res.status(200).json({ orderId: order.id });
    }

    if (req.method === 'PUT') {
      const { userId, months, paymentId, orderId, signature } = req.body;
      const body = orderId + '|' + paymentId;
      const expectedSig = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');
      if (expectedSig !== signature)
        return res.status(400).json({ success: false });

      const today = new Date();
      const expires = new Date(today);
      expires.setMonth(expires.getMonth() + (months || 1));
      const expiresStr = expires.toISOString().split('T')[0];

      await supabase.from('subscriptions').insert({
        user_id: userId,
        status: 'active',
        expires_at: expiresStr,
        razorpay_payment_id: paymentId,
        razorpay_order_id: orderId,
        amount_paid: months === 3 ? 129 : 49,
        months_purchased: months,
      });

      return res.status(200).json({ success: true, until: expiresStr });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    console.error('Payment error:', err);
    return res.status(500).json({ error: err.message });
  }
}
