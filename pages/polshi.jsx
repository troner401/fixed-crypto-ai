import crypto from "crypto";

export function signKalshi(method, path) {
  const keyId = process.env.KALSHI_KEY_ID;
  const privateKey = process.env.KALSHI_PRIVATE_KEY;
  
  if (!keyId || !privateKey) {
    console.error("Kalshi Keys missing from .env file!");
    return {};
  }

  const ts = Date.now().toString();
  const msg = ts + method + path;
  const sign = crypto.createSign('RSA-SHA256').update(msg).sign(privateKey, 'base64');
  
  return { 
    'KALSHI-ACCESS-KEY': keyId, 
    'KALSHI-ACCESS-SIGNATURE': sign, 
    'KALSHI-ACCESS-TIMESTAMP': ts 
  };
}