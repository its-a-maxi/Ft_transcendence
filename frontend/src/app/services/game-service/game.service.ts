import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GameI } from '../models/gameRoom.interface';
import { RoomI } from '../models/room.interface';
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

    disconnect()
    {
        this.socket.disconnect()
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

	findUsers()
	{
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

    ///////////////////////////////////////////////////////////////////////

    createGame(game: any)
    {
        this.socket.emit('createGame', game)
    }

    startGame(): Observable<any>
    {
        return this.socket.fromEvent('startGame')
    }

    ////////////////////////////////////////////////////////////////////////

    addLiveUser()
    {
        this.socket.emit('addLiveUsers')
    }

    removeLiveUser()
    {
        this.socket.emit('removeLiveUsers')
    }

    showRooms()
    {
        this.socket.emit('showRooms')
    }

    getLiveRooms(): Observable<GameI[]>
    {
        return this.socket.fromEvent('liveRooms')
    }

    updateStats(data: any)
    {
        this.socket.emit('updateStats', data)
    }

    createSpecialRoom(options: any)
    {
        this.socket.emit('createSpecialRooms', options)
    }

    createChallenge(enemy: number)
    {
        this.socket.emit('challengeRoom', enemy)
    }
}
