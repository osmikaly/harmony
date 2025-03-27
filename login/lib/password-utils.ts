export function hashPassword(password: string): string {
  // This is a simple hash for demonstration
  // DO NOT use this in production - use bcrypt or Argon2 instead
  return btoa(password + "salt_for_demo_only") + ".hashed"
}

