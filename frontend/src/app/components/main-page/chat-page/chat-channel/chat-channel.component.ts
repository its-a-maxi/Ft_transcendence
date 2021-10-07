import { AfterViewInit, Component, ElementRef, EventEmitter, Input,
		OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { ChatService } from 'src/app/services/chat-service/chat.service';
import { MessageI, MessagePaginateI } from 'src/app/services/models/message.interface';
import { RoomI } from 'src/app/services/models/room.interface';
import { map, startWith, tap } from 'rxjs/operators';
import { UserI } from 'src/app/services/models/user.interface';
import { User } from 'src/app/services/models/user';

@Component({
	selector: 'app-chat-channel',
	templateUrl: './chat-channel.component.html',
	styleUrls: ['./chat-channel.component.css']
})
export class ChatChannelComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit
{

	
	@Output('closeOverlay') closeOverlay: EventEmitter<any> = new EventEmitter();
	@Output('showOverlay') showOverlay: EventEmitter<any> = new EventEmitter();
	@Output('refreshChat') refreshChat: EventEmitter<any> = new EventEmitter();

	@Input()
	chatRoom!: RoomI;
	@ViewChild('messages')
	private messagesScroller!: ElementRef;
	userId: any
	write: string = ""

	message: string = "";

	title: string = "";

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

	constructor(private chatService: ChatService, private authService: AuthService) { }

	ngOnInit(): void
	{
		this.userId = sessionStorage.getItem('token')
		if (this.chatRoom.name[0] == '#')
			this.title = this.chatRoom.name;
		else
			for (let i = 0; this.chatRoom.users![i]; i++)
				if (this.chatRoom.users![i].id != this.userId)
					this.title = this.chatRoom.users![i].nick;
	}

	ngOnChanges(changes: SimpleChanges)
	{
		if (this.chatRoom.name[0] == '#')
			this.title = this.chatRoom.name;
		else
			for (let i = 0; this.chatRoom.users![i]; i++)
				if (this.chatRoom.users![i].id != this.userId)
					this.title = this.chatRoom.users![i].nick;
		this.chatService.leaveRoom(changes['chatRoom'].previousValue);
		if (this.chatRoom)
		{
			this.chatService.joinRoom(this.chatRoom);
			this.typingMessage();
			console.log(this.chatRoom);
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
			this.chatService.updateOption('public', this.chatRoom);

		}
		else
		{
			this.showOverlay.emit("changePassword");
			this.chatService.updateOption('private', this.chatRoom);
		}
		this.refreshChat.emit();
		//this.chatService.updatePassword("random", this.chatRoom);
	}

	changeChannelPassword(password: string)
	{
		this.chatService.updatePassword(password, this.chatRoom).catch(e => console.log(e))
		alert('Your new password is: ' + password);
		this.closeOverlay.emit();
		this.refreshChat.emit();
	}

	checkIfAdmin(userId: number): boolean
	{
		if (this.chatRoom.adminsId)
			for (let i = 0; this.chatRoom.adminsId[i]; i++)
			{
				if (this.chatRoom.adminsId[i] == userId)
					return (true);
			}
		return (false);
	}

	updateAdmin(user: UserI)
	{
		this.chatService.updateAdmins(user.id, this.chatRoom);
		if (this.chatRoom.adminsId?.includes(user.id))
			this.chatRoom.adminsId = this.chatRoom.adminsId?.filter(x => x != user.id);
		else
			this.chatRoom.adminsId?.push(user.id);
		this.refreshChat.emit();
	}

	BanUser(user: UserI)
	{
		this.chatService.userBanned(user)
	}
}
