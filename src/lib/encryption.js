import CryptoJS from 'crypto-js'

const KEY = import.meta.env.VITE_ENCRYPTION_KEY

if (!KEY) {
  console.warn('VITE_ENCRYPTION_KEY is not set. Using a fallback — set this in production!')
}

const SECRET = KEY || 'fallback-key-DO-NOT-USE-IN-PRODUCTION'

export function encrypt(plaintext) {
  if (!plaintext) return ''
  return CryptoJS.AES.encrypt(plaintext, SECRET).toString()
}

export function decrypt(ciphertext) {
  if (!ciphertext) return ''
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET)
    const result = bytes.toString(CryptoJS.enc.Utf8)
    return result || ''
  } catch {
    return ''
  }
}
