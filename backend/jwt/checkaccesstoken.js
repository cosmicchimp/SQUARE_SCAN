import passport from 'passport'
import dotenv from 'dotenv'
import checkUser from "../middleware/finduser"
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
const params = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secret:process.env.ACCESS_TOKEN_SECRET
}

passport.use(new JwtStrategy(params, async (payload,done) => {
    try {
        const user = checkUser()
    }
    catch (e) {
        console.log("Error in jwt strategy",e)
    }
}))