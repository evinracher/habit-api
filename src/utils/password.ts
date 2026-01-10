import bcrypt from 'bcrypt';
import env from "../../env.ts";

export const hashPassword = async (rawPassword: string) => {
  return bcrypt.hash(rawPassword, env.BCRYPT_ROUNDS);
}