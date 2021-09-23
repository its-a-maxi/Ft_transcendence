import { Injectable } from "@angular/core";
import { SocketIoConfig, Socket } from "ngx-socket-io";
import { tokenGetter } from "../../../app.module";

//options: { transports: ['websocket'], reconnection: true }

const config: SocketIoConfig = {
    url: 'http://localhost:3000',
	options: { query: { token: tokenGetter(), gate: "game" }, path: '/game'}
}

@Injectable({providedIn: 'root'})
export class GameSocket extends Socket
{
	
	constructor()
	{
		super(config)
	}
}