
import GitHubStrategy from 'passport-github2';
import UserManager from '../../service/user.manager.js';

const userManager = new UserManager();

export const gitHubStrategy = new GitHubStrategy({
  clientID: "Iv1.105e51971d7df739",
  clientSecret: 'e2f673625cc0eb353f9848a3822fa6f25a7b2b8f',
  callbackURL: 'http://localhost:5000/api/session/githubcallback'
}, async (accessToken, refreshToken, profile, done) => {
  try {            
      if(!profile._json.login) throw new Error("El email/login de github es requerido");
      
      let user = await userManager.getUserByEmail(profile._json.login);
      
      if (!user) {
          const passwordHash = createHash('coder123');
          const cartManager = new CartManager();
          const cart = await cartManager.addCart([]);
          let newUser = {
              first_name: profile._json.login,
              last_name: ' ',
              age: 18,
              email: profile._json.login,
              password: passwordHash,
              cart: cart._id
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

})