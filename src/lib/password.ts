import bcrypt from 'bcryptjs';

/**
 * Hash a plain text password.
 * @param password Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a plain text password with a hash.
 * @param password Plain text password
 * @param hash Previously hashed password
 * @returns Boolean if they match
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
