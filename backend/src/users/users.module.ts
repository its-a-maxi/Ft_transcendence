import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { enviroment } from 'enviroment';
import { AuthService } from 'src/auth/auth-service/auth.service';
import { UserEntity } from './user-service/models/entities/users.entity';
import { UsersController } from './user-controller/users.controller';
import { UsersService } from './user-service/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]),
            JwtModule.register({
                    secret: enviroment.PASS_SECRET,
                    signOptions: { expiresIn: '7200s'}
            })],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  exports: [UsersService]
})
export class UsersModule {}
