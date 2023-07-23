import passport from 'passport';
import { strategyJWT } from './strategies/jwtStrategy.js';
import { gitHubStrategy } from './strategies/githubStrategy.js';

const initializePassport = () => {
    passport.use('github', gitHubStrategy)
    passport.use(strategyJWT)
}

export default initializePassport;
