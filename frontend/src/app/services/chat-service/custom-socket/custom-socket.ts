import { Injectable } from "@angular/core";
import { SocketIoConfig, Socket } from "ngx-socket-io";
import { AuthService } from "../../auth-service/auth.service";
import { tokenGetter } from "../../../app.module";

//options: { transports: ['websocket'], reconnection: true }

const config: SocketIoConfig = {
    url: 'http://localhost:3000',
	options: { query: { token: tokenGetter() }}
}

@Injectable({providedIn: 'root'})
export class CustomSocket extends Socket
{
	
	constructor()
	{
		super(config)
	}
}