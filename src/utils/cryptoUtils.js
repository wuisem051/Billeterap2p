const STORAGE_KEY = 'cartera_encrypted_vault_v1';
const PBKDF2_ITERATIONS = 100000;

export function buf2hex(buffer) {
  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

export function hex2buf(hexString) {
  const bytes = new Uint8Array(Math.ceil(hexString.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return bytes;
}

async function deriveKey(pin, salt) {
  const enc = new TextEncoder();
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(pin),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function saveVault(dataObject, pin) {
  const enc = new TextEncoder();
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(pin, salt);

  const encodedData = enc.encode(JSON.stringify(dataObject));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encodedData
  );

  const payload = {
    salt: buf2hex(salt),
    iv: buf2hex(iv),
    ciphertext: buf2hex(encrypted),
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  return true;
}

export async function loadVault(pin) {
  const rawVault = localStorage.getItem(STORAGE_KEY);
  if (!rawVault) return null;

  try {
    const { salt, iv, ciphertext } = JSON.parse(rawVault);
    const key = await deriveKey(pin, hex2buf(salt));

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: hex2buf(iv) },
      key,
      hex2buf(ciphertext)
    );

    const dec = new TextDecoder();
    return JSON.parse(dec.decode(decrypted));
  } catch (error) {
    throw new Error('PIN incorrecto o datos no válidos');
  }
}

export function hasVault() {
  return !!localStorage.getItem(STORAGE_KEY);
}

export async function createOffchainVoucher(amountUsdt, memo = '') {
  const secretRandom = window.crypto.getRandomValues(new Uint8Array(32));
  const secretHex = buf2hex(secretRandom);

  const enc = new TextEncoder();
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', enc.encode(secretHex));
  const redeemHash = buf2hex(hashBuffer);

  const voucherToken = {
    standard: 'CARTERA-USDT-V1',
    amount: parseFloat(amountUsdt),
    memo: memo,
    created_at: Date.now(),
    secret: secretHex,
    hash: redeemHash
  };

  const tokenString = btoa(JSON.stringify(voucherToken));
  return {
    tokenString: `voucher_usdt_${tokenString}`,
    voucherData: voucherToken
  };
}

export async function generatePosInvoice(amountUsdt, memo = 'Cobro PoS') {
  const invoiceId = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const timestamp = Date.now();
  const rawPayload = `${invoiceId}:${amountUsdt}:${timestamp}`;

  const enc = new TextEncoder();
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', enc.encode(rawPayload));
  const validationHash = buf2hex(hashBuffer).substring(0, 16);

  return {
    invoiceId,
    amountUsdt: parseFloat(amountUsdt),
    timestamp,
    memo,
    hash: validationHash,
    payloadString: JSON.stringify({
      id: invoiceId,
      usdt: parseFloat(amountUsdt),
      time: timestamp,
      h: validationHash
    })
  };
}
