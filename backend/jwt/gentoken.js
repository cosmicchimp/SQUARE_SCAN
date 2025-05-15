import jwt from 'jsonwebtoken'
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export function generateAccessToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email },   
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }                  
    );
  }
export function generateRefreshToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '30d' }
    );
  }

