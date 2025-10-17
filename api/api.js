
import crypto from 'crypto';
export default function handler(req, res){
    if (req.method !== 'POST') return res.status(405).end();

    const {txnID , amount, productinfo, firstname, email} = req.body;

    if (!txnID || !amount || !productinfo || !firstname || !email){
        return res.status(400).json({error : "Missing required fields"});
    }

    const key = process.env.PAYU_KEY;
    const salt = process.env.PAUU_SALT;

    const hashString = `${key}|${txnID}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
  const hash = crypto.createHash('sha512').update(hashString).digest('hex');

  res.status(200).json({
    key,
    txnID,
    amount,
    productinfo,
    firstname,
    email,
    hash
  });
}