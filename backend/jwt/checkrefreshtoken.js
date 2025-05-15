import passport from 'passport'
import dotenv from 'dotenv'
import checkUser from "../middleware/finduser"
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
export default async function checkRefreshToken(user) {
    try {}
    catch (e) {
        console.log("Error in check refresh token", e)
    }
}