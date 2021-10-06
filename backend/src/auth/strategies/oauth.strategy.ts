import { Body, Injectable, Req } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { PassportStrategy } from "@nestjs/passport";
import { enviroment } from "enviroment";
import { Strategy } from "passport-oauth2";
import { stringify } from "querystring";
import { JwtService } from "@nestjs/jwt";
import { firstValueFrom, lastValueFrom } from "rxjs";
import { Response, Request } from 'express';



@Injectable()
export class OauthStrategy extends PassportStrategy(Strategy, 'oauth')
{
	constructor(private httpService: HttpService, private jwtService: JwtService) {
		super({
			authorizationURL: `https://api.intra.42.fr/oauth/authorize?${stringify({
				client_id: enviroment.API_UID,
				redirect_uri: enviroment.REDIRECT_URL,
				scope: 'public',
				response_type: 'code'
			})}`,
			tokenURL: "https://api.intra.42.fr/oauth/token",
			clientID: enviroment.API_UID,
			clientSecret: enviroment.SECRET,
			callbackURL: enviroment.REDIRECT_URL,
			scope: 'public'
		})
	}

	async validate(accesToken: string): Promise<any>
	{
		const users = {
			me: 'me',
			mmonroy: 'users/mmonroy-',
			aleon: 'users/aleon-ca',
			fballest: 'users/fballest'
		}
		const data = this.httpService.get(`https://api.intra.42.fr/v2/${users.fballest}`, {
			headers: { Authorization: `Bearer ${accesToken}` }
		})
		const axios_res = await firstValueFrom(data)
		const jwt = await this.jwtService.signAsync({
			id: axios_res.data.id,
			loginName: axios_res.data.login,
			userEmail: axios_res.data.email
		})
		return jwt
	}
}