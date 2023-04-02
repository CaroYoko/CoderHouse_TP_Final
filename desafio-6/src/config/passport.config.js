import passport from 'passport';
import local from 'passport-local';
import userService from '../dao/models/User.js';
import { createHash, isValidPassport } from '../utils/bcrypt.js';

const LocalStrategy = local.Strategy;
const initializePassport = () => {

    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {

            const { first_name, last_name, email, age } = req.body;
            try {
                let user = await userService.findOne({ email: username });
                if (user) {
                    console.log("User already exist");
                    return done(null, false);
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }
                let result = await userService.create(newUser);
                return done(null, result);
            }
            catch {
                return done("Error al obtener el usuario" + error.message)
            }

        })
    )

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async(id, done) => {
        let user = await userService.findById(id);
        done(null, user);
    })

    passport.use('login', new LocalStrategy({usernameField :'email'}, async(username, password, done) => {
        try{
            const user = await userService.findOne({email: username})
            if(!user){
                console.log("Use doesn't exist");
                return done(null, false);
            }
            if(!isValidPassport(password, user.password)) return done(null, false);
            return done(null, user);
        } catch(error){
            return done(error);
        }
    }))

}
export default initializePassport;
