import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UserManager from '../../controllers/user.manager.js'; 

const userManager = new UserManager();

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

export const strategyJWT = new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        console.log("payload", payload)
        const user = await userManager.getUserById(payload.user.id)

        if (!user) {
            return done(null, false)
        }

        return done(null, user)

    } catch (error) {
        return done(error, false)
    }
})