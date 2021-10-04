import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { enviroment } from 'enviroment';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth-controller/auth.controller';
import { AuthService } from './auth-service/auth.service';
import { OauthStrategy } from './strategies/oauth.strategy';

@Module({
  imports: [UsersModule,
            HttpModule,
            PassportModule,
            JwtModule.register({
              secret: enviroment.PASS_SECRET,
              signOptions: { expiresIn: '7200s'}
            })],
  controllers: [AuthController],
  providers: [AuthService, OauthStrategy],
  exports: [AuthService]
})
export class AuthModule {}
