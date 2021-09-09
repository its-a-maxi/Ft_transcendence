import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { enviroment } from 'enviroment';
import { UserEntity } from 'src/users/user-service/models/entities/users.entity';
import { ChatGateway } from './chat-gateway/chat.gateway';
import { RoomService } from './chat-service/room/room.service';
import { RoomEntity } from './models/room/room.entity';
import { ChatController } from './chat-controller/chat/chat.controller';
import { AuthService } from 'src/auth/auth-service/auth.service';
import { UsersService } from 'src/users/user-service/users.service';
import { ConnectedUserService } from './chat-service/connected-user/connected-user.service';
import { ConnectedUserEntity } from './models/connected-user/connected-user.entity';
import { JoinedRoomService } from './chat-service/joined-room/joined-room.service';
import { JoinedRoomEntity } from './models/joined-room/joined-room.entity';
import { MessageEntity } from './models/messages/messages.entity';
import { MessageService } from './chat-service/message/message.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoomEntity, ConnectedUserEntity, JoinedRoomEntity, MessageEntity]),
            JwtModule.register({
                    secret: enviroment.PASS_SECRET,
                    signOptions: { expiresIn: '1h'}
  })],
  providers: [RoomService, ChatGateway, AuthService, UsersService, ConnectedUserService, JoinedRoomService, MessageService],
  exports: [RoomService],
  controllers: [ChatController]
})
export class ChatModule {}
