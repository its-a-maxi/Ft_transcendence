import * as dotenv from "dotenv"

dotenv.config()

export const enviroment = {
    API_UID: process.env.API_UID,
    SECRET: process.env.SECRET,
    REDIRECT_URL: process.env.REDIRECT_URL,
    PASS_SECRET: process.env.PASS_SECRET
}