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

    getMove(): Observable<any>
    {
        return this.socket.fromEvent('move')
    }

    setMove(move: any)
    {
        this.socket.emit('setMove', move)
    }

    getMovePlayer(): Observable<any>
    {
        return this.socket.fromEvent('movePlayer')
    }

    setMoveTwo(move: any)
    {
        this.socket.emit('setMoveTwo', move)
    }

    getMovePlayerTwo(): Observable<any>
    {
        return this.socket.fromEvent('movePlayerTwo')
    }

    moveBall(ball: any)
    {
        this.socket.emit('moveBall', ball)
    }

    getMoveBall(): Observable<any>
    {
        return this.socket.fromEvent('returnBall')
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
