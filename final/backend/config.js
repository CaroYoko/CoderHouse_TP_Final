import dotenv from 'dotenv'
import { Command } from 'commander'

const program = new Command()

program
.option('--mode <mode>', "Ingrese el modo de trabajo", 'DEVELOPMENT')
program.parse()

const enviroment = program.opts().mode

dotenv.config({
    path: enviroment === "DEVELOPMENT" ? './.env.development' : './.env.production'
})

export default {
    port: process.env.PORT,
    mongoURL: process.env.URLMONGODB,
    user: process.env.USER,
    password: process.env.PASSWORD,    
    cookie: process.env.SIGNED_COOKIE,
    jwt: process.env.JWT_SECRET,
    env: enviroment
}