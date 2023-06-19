import passport from "passport"


export const passportError = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (error, user, info) => {     
            if (error) { //Errores del Token (token no valido, no posee el formato adecuado o no existe, etc)
                return next(error)
            }
            if (!user) {
                return res.status(401).send({ error: info.message ? info.message : info.toString() })
            }
            req.user = user
            next()
        })(req, res, next)
    }
}

export const current = (role) => {
    return async (req, res, next) => {
        console.log(req.user)
        const userAccess = role.find(x => x === req.user.rol)

        if (!userAccess) {
            return res.status(401).send({ error: "User no autorizado" })
        } else {
            next()
        }

    }

} 