import { Injectable } from '@angular/core';
import { RoomI } from '../models/room.interface';
import axios from 'axios';
import { Socket, SocketIoConfig } from "ngx-socket-io";
import { CustomSocket } from './custom-socket/custom-socket';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageI, MessagePaginateI } from '../models/message.interface';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ChatService
{
	constructor(private snackBar: MatSnackBar,
				private socket: CustomSocket) {}

	async createRoom(room: RoomI)
	{
		this.socket.emit('createRoom', room)
		this.snackBar.open(`Room ${room.name} created successfully`, 'Close', {
			duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
		})
	}

	getMyRooms()
	{
		return axios.get<RoomI[]>('http://localhost:3000/chat/getAllRooms')
		//return this.socket.fromEvent('rooms')
	}

	async deleteRooms(rooms: RoomI[])
	{
		return axios.post<RoomI[]>('http://localhost:3000/chat/deleteRooms', rooms)
	}

	joinRoom(room: RoomI)
	{
		this.socket.emit('joinRoom', room);
	}

	leaveRoom(room: RoomI)
	{
		this.socket.emit('leaveRoom', room);
	}

	sendMessage(message: MessageI)
	{
		this.socket.emit('addMessage', message);
	}

	getAddedMessage(): Observable<MessageI>
	{
		return this.socket.fromEvent<MessageI>('messageAdded');
	}

	getMessages(): Observable<MessagePaginateI>
	{
		return this.socket.fromEvent<MessagePaginateI>('messages');
	}

}
