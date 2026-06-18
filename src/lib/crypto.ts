import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const ENCODING = "hex";

// Retrieve and validate the encryption key from environment variables
const SECRET_KEY = process.env.ENCRYPTION_KEY;

if (!SECRET_KEY || SECRET_KEY.length !== 64) {
  throw new Error(
    "ENCRYPTION_KEY environment variable must be a 64 character hex string (32byts).",
  );
}

const KEY_BUFFER = Buffer.from(SECRET_KEY, "hex");

// Encrypts a plain text string into an ciphered format

export function encrypt(text: string): string {
  if (!text) return "";

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY_BUFFER, iv);

  let encrypted = cipher.update(text, "utf8", ENCODING);
  encrypted += cipher.final(ENCODING);

  const authTag = cipher.getAuthTag();

  // Pack all structural elements neatly separated by colons
  return `${iv.toString(ENCODING)}:${authTag.toString(ENCODING)}:${encrypted}`;
}

// Decrypts an ciphered string back to plain text
export function decrypt(encryptedData: string): string {
  if (!encryptedData) return "";

  try {
    const parts = encryptedData.split(":");
    if (parts.length !== 3) {
      // Fallback for pre-existing unencrypted database rows
      return encryptedData;
    }

    const [ivHex, tagHex, ciphertextHex] = parts;

    const iv = Buffer.from(ivHex, ENCODING);
    const tag = Buffer.from(tagHex, ENCODING);
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY_BUFFER, iv);

    decipher.setAuthTag(tag);

    let decrypted = decipher.update(ciphertextHex, ENCODING, "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption failed. Key mismatch or data corruption:", error);
    return "[Decryption Error: Content Unreadable]";
  }
}
