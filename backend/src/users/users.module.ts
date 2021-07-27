import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { enviroment } from 'enviroment';
import { AuthService } from 'src/auth/auth.service';
import { User } from './entities/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
            JwtModule.register({
                    secret: enviroment.PASS_SECRET,
                    signOptions: { expiresIn: '1h'}
            })],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  exports: [UsersService]
})
export class UsersModule {}
