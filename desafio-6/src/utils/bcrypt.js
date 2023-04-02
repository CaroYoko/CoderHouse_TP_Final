import bcrypt from 'bcrypt'

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.SALT)))

export const isValidPassport = (passwordSend, passwordBDD) => bcrypt.compareSync(passwordSend, passwordBDD)