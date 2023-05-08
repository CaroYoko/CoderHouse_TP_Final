import passport from 'passport';
import local from 'passport-local';
import userService from '../dao/models/User.js';
import { createHash, isValidPassport } from '../utils/bcrypt.js';
import CartManager from "../controllers/cart.manager.js";
import { strategyJWT } from './strategies/jwtStrategy.js';
import { gitHubStrategy } from './strategies/githubStrategy.js';

const LocalStrategy = local.Strategy;


const initializePassport = () => {

    

   

/*
    passport.serializeUser((user, done) => {
        done(null, user._id);
    })
    
    passport.deserializeUser(async (id, done) => {
        let user = await userService.findById(id);
        done(null, user);
    })


    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userService.findOne({ email: username }) 
            
            console.log(user)
            console.log("entro 1")
            if (!user) {
                console.log("User doesn't exist");
                console.log("entro 2")
                return done(null, false);
            }
            if (!isValidPassport(password, user.password)){
                
                console.log("entro 3")
                return done(null, false);
            }
            console.log(done(null, user))
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }))
    */
    passport.use('github', gitHubStrategy)

    passport.use(strategyJWT)

}
export default initializePassport;
