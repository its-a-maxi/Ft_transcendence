import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomSocket } from '../chat-service/custom-socket/custom-socket';
import { UserI } from '../models/user.interface';
import { GameSocket } from './socket-game/socket-game';

@Injectable({
	providedIn: 'root'
})
export class GameService
{

	constructor(private socket: GameSocket) { }

	test(): Promise<any>
	{
		return this.socket.fromOneTimeEvent<any>('listUsers')
	}

	connect()
	{
		this.socket.connect()
	}

	keyReled(data: any)
	{
		this.socket.emit('keyboard', data)
	}

	getListUsers(): Observable<any>
	{
		return this.socket.fromEvent<any>('listUsers')
	}

	leaveRoom(roomId: number)
	{
		this.socket.emit('leaveUser', roomId)
	}

	joinRoom()
	{
		this.socket.emit('joinUser')
	}

	destroyUsers()
	{
		this.socket.emit('destroyUsers')
	}

	findUsers()
	{
		console.log("FIND")
		this.socket.emit('findUsers')
	}

    changeStatus()
    {
        this.socket.emit('gameStatus')
    }
}
