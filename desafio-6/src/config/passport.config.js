import passport from 'passport';
import local from 'passport-local';
import UserManager from '../controllers/user.manager.js';
import userService from '../dao/models/User.js';
import GitHubStrategy from 'passport-github2';
import { createHash, isValidPassport } from '../utils/bcrypt.js';

const LocalStrategy = local.Strategy;
const userManager = new UserManager();
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
        console.log("despues", user)
    })
    
    passport.deserializeUser(async (id, done) => {
        let user = await userService.findById(id);
        done(null, user);
    })
    
    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userService.findOne({ email: username })
            if (!user) {
                console.log("Use doesn't exist");
                return done(null, false);
            }
            if (!isValidPassport(password, user.password)) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }))
    
    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.105e51971d7df739",
        clientSecret: 'e2f673625cc0eb353f9848a3822fa6f25a7b2b8f',
        callbackURL: 'http://localhost:5000/api/session/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {            
            if(!profile._json.login) throw new Error("El email/login de github es requerido");
            
            let user = await userManager.getUserByEmail(profile._json.login);
            console.log("adentro github", user)


            if (!user) {
                const passwordHash = createHash('coder123')
                let newUser = {
                    first_name: profile._json.login,
                    last_name: ' ',
                    age: 18,
                    email: profile._json.login,
                    password: passwordHash
                }
                let result = await userManager.addUsers(newUser);
                done(null, result);
            }
            else {
                done(null, user);
            }

        } catch (error) {
            return done(error);
        }

    }))

}
export default initializePassport;
