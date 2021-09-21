import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { enviroment } from 'enviroment';
import { UserEntity } from 'src/users/user-service/models/entities/users.entity';
import { UsersService } from 'src/users/user-service/users.service';
import { GameGateway } from './game-gateway/game.gateway';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])
                , JwtModule.register({
            secret: enviroment.PASS_SECRET,
            signOptions: { expiresIn: '1h'}
    })],
    providers: [GameGateway, UsersService]
})
export class GameModule {}
