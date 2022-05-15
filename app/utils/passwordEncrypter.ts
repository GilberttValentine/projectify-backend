import bcrypt from 'bcrypt';

const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

export const encryptPassword = async (password: string) => await bcrypt.hash(password, saltRounds);

export const comparePassword = async (password: string, passwordEncrypted: string) => await bcrypt.compare(password, passwordEncrypted);
