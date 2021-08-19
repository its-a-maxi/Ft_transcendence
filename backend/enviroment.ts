import * as dotenv from "dotenv"

dotenv.config()

export const enviroment = {
    API_UID: process.env.API_UID,
    SECRET: process.env.SECRET,
    REDIRECT_URL: process.env.REDIRECT_URL,
    PASS_SECRET: process.env.PASS_SECRET,
    // ACOUNT_TWI: process.env.ACOUNT_TWI,
    // TOKEN_TWI: process.env.TOKEN_TWI,
    // PHONE: process.env.PHONE,
    // SMS_VER: process.env.SMS_VER
}