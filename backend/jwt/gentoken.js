import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { neon } from "@neondatabase/serverless";

dotenv.config();

const sql = neon(process.env.DATABASE_URL)
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export async function generateAccessToken(user) {
    return jwt.sign(
      { user_id: user.user_id, email: user.email },   
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }                  
    );
}

export async function generateRefreshToken(email) {
    try {
        let user = await sql`SELECT * FROM userbase.users WHERE users.email = ${email}`;
        user = user[0]
        console.log(user)
        const refToken = jwt.sign(
          { user_id: user.user_id, email: user.email },
          REFRESH_TOKEN_SECRET,
          { expiresIn: '30d' }
        );

        const insert = await sql`INSERT INTO user_tokens (user_id, token_hash, expires_at)
        VALUES (${user.user_id}, ${refToken}, NOW() + INTERVAL '30 days')
        ON CONFLICT (user_id)
        DO UPDATE SET
        token_hash = EXCLUDED.token_hash,
        expires_at = EXCLUDED.expires_at;`;

        console.log('Insert result:', insert);

        return { success: true }
    }
    catch (e) {
        console.log("Error in refresh gen token: ", e);
        return { success: false, error: e.message };
    }
}
