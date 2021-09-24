import { Body, Controller, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from 'src/auth/auth-service/auth.service';
import { verifyUser } from 'src/auth/strategies/auth.guard';
import { RoomService } from 'src/chat/chat-service/room/room.service';
import { RoomDto } from 'src/chat/models/room/dto/room.dto';
import { RoomI } from 'src/chat/models/room/room.interface';
import { UserEntity } from 'src/users/user-service/models/entities/users.entity';
import { UserI } from 'src/users/user-service/models/user.interface';
import { UsersService } from 'src/users/user-service/users.service';
import * as bcrypt from 'bcrypt'

@Controller('chatRoom')
export class ChatController
{
	constructor(private authService: AuthService,
				private userService: UsersService,
				private roomService: RoomService) {}

	@UseGuards(verifyUser)
	@Post('createRoom')
	async createRoom(@Req() req: Request, @Body() room: RoomDto)
	{
		const client: UserI = await this.userService.getUser(room.ownerId);
		return this.roomService.createRoom(room as RoomI, client)
	}

	@UseGuards(verifyUser)
	@Get('getAllRooms')
	async getAllRooms()
	{
		return this.roomService.getAllRooms()
	}

	@UseGuards(verifyUser)
	@Post('deleteRooms')
	async deleteRooms(@Req() req: Request, @Body() rooms: RoomI[])
	{
		return this.roomService.deleteAllRooms(rooms)
	}

    @UseGuards(verifyUser)
    @Post('verifyPassword')
    async verifyPassword(@Res() res: Response, @Body() body: any) 
    {
        const room: RoomI = await this.roomService.getRoom(body.roomId)
        let verifyPass = bcrypt.compareSync(body.password, room.password)
        if (!verifyPass)
        {
            return res.status(400).send(false)
        }
        return res.send(true)
    }

	@UseGuards(verifyUser)
	@Put('updatePassword')
	async updatePassword(@Req() req: Request, @Res() res: Response, @Body() params: any)
	{
        try
        {
            await this.roomService.updatePassword(params.password, params.room.id);
        	return res.status(200).send("OK")
        }
		catch
		{
            return res.status(400)
        }
		
	}

	@UseGuards(verifyUser)
	@Put('updateOption')
	async updateOption(@Req() req: Request,  @Res() res: Response, @Body() params: any)
	{
		try
		{
			await this.roomService.updateOption(params.option, params.room.id);
			return res.status(200).send("OK")	
		}
		catch
		{
			return res.status(400)
		}
	}

	@UseGuards(verifyUser)
	@Put('updateAdmins')
	async updateAdmins(@Req() req: Request, @Res() res: Response, @Body() params: any)
	{
		try
		{
			await this.roomService.updateAdmins(params.admins, params.room.id);
			return res.status(200).send("OK")	
		}
		catch
		{
			return res.status(400)
		}
		
	}

}
