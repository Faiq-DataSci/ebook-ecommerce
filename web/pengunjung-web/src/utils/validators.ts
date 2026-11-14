export function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return 'Kata sandi minimal terdiri dari 8 karakter.';
  }
  return null;
}
