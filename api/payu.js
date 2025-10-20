import crypto from 'crypto';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { txnid, amount, productinfo, firstname, email } = req.body;

    // Validate required fields
    if (!txnid || !amount || !productinfo || !firstname || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get environment variables
    const key = process.env.PAYU_KEY;
    const salt = process.env.PAYU_SALT;

    if (!key || !salt) {
      return res.status(500).json({ error: "Payment configuration error" });
    }

    // Generate hash
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    // Return response
    res.status(200).json({
      key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      hash
    });

  } catch (error) {
    console.error('PayU API error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}