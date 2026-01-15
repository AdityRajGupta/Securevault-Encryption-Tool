// src/utils/crypto.js
// WebCrypto helpers for encrypting/decrypting text and files (AES-GCM + PBKDF2)

const enc = new TextEncoder();
const dec = new TextDecoder();

export function bufToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}
export function base64ToBuf(base64) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export async function deriveKeyFromPassword(password, salt) {
  const pwKey = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    pwKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// Text helpers (optional)
export async function encryptText(plainText, password) {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKeyFromPassword(password, salt);
  const ct = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(plainText)
  );
  return {
    ciphertext: bufToBase64(ct),
    iv: Array.from(iv),
    salt: Array.from(salt),
  };
}

export async function decryptText(base64Ciphertext, password, ivArr, saltArr) {
  const iv = new Uint8Array(ivArr);
  const salt = new Uint8Array(saltArr);
  const key = await deriveKeyFromPassword(password, salt);
  const ctBuf = base64ToBuf(base64Ciphertext);
  const plainBuf = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ctBuf
  );
  return dec.decode(plainBuf);
}

// File encryption: returns { blob, filename }
export async function encryptFile(file, password) {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKeyFromPassword(password, salt);
  const fileBuf = await file.arrayBuffer();
  const ct = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, fileBuf);
  const ctBytes = new Uint8Array(ct);

  // out = salt (16) | iv (12) | ciphertext
  const out = new Uint8Array(salt.length + iv.length + ctBytes.length);
  out.set(salt, 0);
  out.set(iv, salt.length);
  out.set(ctBytes, salt.length + iv.length);

  const blob = new Blob([out], { type: "application/octet-stream" });
  return { blob, filename: file.name + ".enc" };
}

// File decryption: accepts ArrayBuffer of the encrypted file, returns Blob of plaintext
export async function decryptFile(encryptedArrayBuffer, password) {
  const data = new Uint8Array(encryptedArrayBuffer);
  const salt = data.slice(0, 16);
  const iv = data.slice(16, 28);
  const ciphertext = data.slice(28).buffer;
  const key = await deriveKeyFromPassword(password, salt);
  const plainBuf = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
  return new Blob([plainBuf]);
}
