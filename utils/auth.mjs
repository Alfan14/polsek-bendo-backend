import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); 

export function verifyTokenFromSocketAuth(auth) {
  const token = auth?.token;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.SECRET_KEY); 
  } catch (err) {
    return null;
  }
}