import { AfterViewInit, Component, ElementRef, Input,
		OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { ChatService } from 'src/app/services/chat-service/chat-service';
import { MessageI, MessagePaginateI } from 'src/app/services/models/message.interface';
import { RoomI } from 'src/app/services/models/room.interface';
import { map, startWith, tap } from 'rxjs/operators';
import { UserI } from 'src/app/services/models/user.interface';
import { Session } from 'inspector';

@Component({
	selector: 'app-chat-channel',
	templateUrl: './chat-channel.component.html',
	styleUrls: ['./chat-channel.component.css']
})
export class ChatChannelComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit
{

	@Input()
	chatRoom!: RoomI;
	@ViewChild('messages')
	private messagesScroller!: ElementRef;
	userId: any
	write: string = ""

	message: string = "";
	//chatMessage: FormControl = new FormControl(null, [Validators.required])

	messagesPaginate$: Observable<MessagePaginateI> = combineLatest([this.chatService.getMessages(),
		this.chatService.getAddedMessage().pipe(startWith(null))])
		.pipe(map(([messagePaginate, message]) => {

			if (message && message.room.id === this.chatRoom.id &&
				!messagePaginate.items.some(m => m.id === message.id))
				{
					messagePaginate.items.push(message);
				}
			const items = messagePaginate.items
				.sort((a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime());
			messagePaginate.items = items;
			return messagePaginate;
		}),
		tap(() => this.scrollToBottom())
		)

	constructor(private chatService: ChatService) { }

	ngOnInit(): void
	{
		this.userId = sessionStorage.getItem('token')
		
	}

	ngOnChanges(changes: SimpleChanges)
	{
		this.chatService.leaveRoom(changes['chatRoom'].previousValue);
		if (this.chatRoom)
		{
			this.chatService.joinRoom(this.chatRoom);
			this.typingMessage();
		}
	}

	ngOnDestroy()
	{
		this.chatService.leaveRoom(this.chatRoom);
	}

	ngAfterViewInit()
	{
		if (this.messagesScroller)
		{
			this.scrollToBottom();
		}
	}

	sendMessage()
	{
		this.chatService.sendMessage({ text: this.message, room: this.chatRoom});
		this.message = "";
		//this.chatMessage.reset();
	}

	private scrollToBottom(): void
	{
		try
		{
			setTimeout(() => { this.messagesScroller.nativeElement.scrollTop = this.messagesScroller.nativeElement.scrollHeight }, 1);
		}
		catch { }
	}

	typingIndicator()
	{
		console.log("Typing...")
		this.chatService.typing()
	}

	typingMessage()
	{
		this.chatService.typingMessage().subscribe(res => {
			this.write = res
			setTimeout(() => this.write = "", 3000);
		})
	}

	deleteChannel()
	{
		let rooms: RoomI[] = [];
		rooms.push(this.chatRoom);
		let option = confirm("Are you sure you want to delete this Channel?");
		if (!option)
			return;
		this.chatService.deleteRooms(rooms);
		window.location.reload();
	}

	changeChannelOption()
	{
		if (this.chatRoom.option == "private")
		{
			this.chatRoom.password = "";
			this.chatRoom.option = "public";
		}
		else
		{
			this.chatRoom.password = "a"//openInput();
			this.chatRoom.option = "private";
		}
		//this.chatService.updateRoom(this.chatRoom);
	}
}