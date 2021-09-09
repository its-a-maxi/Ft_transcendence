import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

import { config } from "../ormconfig";
import { AuthModule } from './auth/auth.module';
import { ChatGateway } from './chat/chat-gateway/chat.gateway';


import { ChatModule } from './chat/chat.module';

@Module({
  imports: [TypeOrmModule.forRoot(config),
            UsersModule,
            AuthModule,
            ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
