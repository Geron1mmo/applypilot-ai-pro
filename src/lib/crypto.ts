function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export function generateSalt(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return bufferToHex(bytes.buffer)
}

export function generateToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return bufferToHex(bytes.buffer)
}

export async function hashPassword(
  password: string,
  salt: string
): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(`${salt}:${password}`)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  return bufferToHex(hashBuffer)
}

export async function verifyPassword(
  password: string,
  salt: string,
  expectedHash: string
): Promise<boolean> {
  const hash = await hashPassword(password, salt)
  return hash === expectedHash
}

export function getPasswordStrength(password: string): {
  score: number
  label: string
} {
  let score = 0
  if (password.length >= 8) score += 25
  if (password.length >= 12) score += 15
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 20
  if (/\d/.test(password)) score += 20
  if (/[^a-zA-Z0-9]/.test(password)) score += 20

  const labels =
    score < 40
      ? "Weak"
      : score < 60
        ? "Fair"
        : score < 80
          ? "Good"
          : "Strong"

  return { score: Math.min(score, 100), label: labels }
}