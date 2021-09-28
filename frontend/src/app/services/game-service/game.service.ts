import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserI } from '../models/user.interface';
import { GameSocket } from './socket-game/socket-game';

@Injectable({
	providedIn: 'root'
})
export class GameService
{

	constructor(private socket: GameSocket) { }

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

    playDemo()
    {
        this.socket.emit('playDemo')
    }

    getDemo(): Observable<any>
    {
        return this.socket.fromEvent('roomDemo')
    }

    changeStatus()
    {
        this.socket.emit('gameStatus')
    }

    ///////////////////////////////////////////////////////////////////////

    createGame(game: any)
    {
        this.socket.emit('createGame', game)
    }

    startGame(): Observable<any>
    {
        return this.socket.fromEvent('startGame')
    }
}
