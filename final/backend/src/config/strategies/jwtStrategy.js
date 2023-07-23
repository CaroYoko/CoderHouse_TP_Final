import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UserManager from '../../service/user.manager.js'; 

const userManager = new UserManager();

const cookieExtractor = (req, res) => {   
    return req.cookies?.jwt ?? null;    
}

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), cookieExtractor ]),    
    secretOrKey: process.env.JWT_SECRET
}

export const strategyJWT = new JwtStrategy(jwtOptions, async (payload, done) => {
    try {        
        const user = await userManager.getUserById(payload.user.id);
        if (!user) {
            return done(null, false)
        }
        return done(null, user)

    } catch (error) {
        return done(error, false)
    }
})