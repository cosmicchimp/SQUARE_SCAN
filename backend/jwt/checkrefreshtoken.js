import passport from 'passport'
import dotenv from 'dotenv'
import { neon } from "@neondatabase/serverless";
import { generateAccessToken, generateRefreshToken } from "./gentoken.js";
import checkAccessToken from "./checkaccesstoken.js"
import genToken from "./gentoken.js"
const sql = neon(process.env.DATABASE_URL)
export default async function checkRefreshToken(email) {
    try {
        const user = await sql`SELECT * FROM users WHERE email = ${email}`
        const result = await sql`SELECT * FROM user_tokens WHERE user_tokens.user_id = (SELECT user_id from users WHERE users.email = ${email}) AND user_tokens.expires_at > NOW()`
        if (result.length > 0) {
            return true
        }
        else {
            return false
        }
    }
    catch (e) {
        console.log("Error in check refresh token", e)
    }
}