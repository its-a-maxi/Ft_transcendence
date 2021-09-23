import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { enviroment } from 'enviroment';
import { UserEntity } from 'src/users/user-service/models/entities/users.entity';
import { UsersService } from 'src/users/user-service/users.service';
import { GameGateway } from './game-gateway/game.gateway';
import { GameEntity } from './models/game.entity';
import { GameService } from './service/game/game.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, GameEntity])
                , JwtModule.register({
            secret: enviroment.PASS_SECRET,
            signOptions: { expiresIn: '1h'}
    })],
    providers: [GameGateway, UsersService, GameService]
})
export class GameModule {}
