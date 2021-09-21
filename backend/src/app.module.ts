import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

import { config } from "../ormconfig";
import { AuthModule } from './auth/auth.module';


import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [TypeOrmModule.forRoot(config),
            UsersModule,
            AuthModule,
            ChatModule,
            GameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
