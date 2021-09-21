import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomSocket } from '../chat-service/custom-socket/custom-socket';

@Injectable({
	providedIn: 'root'
})
export class GameService
{

	constructor(private socket: CustomSocket) { }

	test(): Observable<string>
	{
		return this.socket.fromEvent('game')
	}

	test2()
	{
		this.socket.emit('gameTest', "Hola desde Game")
	}

	keyReled(data: any)
	{
		this.socket.emit('keyboard', data)
	}
}
