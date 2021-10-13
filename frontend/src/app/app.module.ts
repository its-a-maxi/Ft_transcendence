import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatChannelComponent } from './components/main-page/chat-page/chat-channel/chat-channel.component';
import { ChatMessageComponent } from './components/main-page/chat-page/chat-message/chat-message.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { StartComponent } from './components/landing-page/start/start.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SettingsComponent } from './components/main-page/settings/settings.component';
import { RankingComponent } from './components/main-page/ranking/ranking.component';
import { PlayComponent } from './components/main-page/play/play.component';
import { FriendsComponent } from './components/main-page/friends/friends.component';
import { TwoFaPopupComponent } from './components/main-page/settings/two-fa-popup/two-fa-popup.component';
import { ChatPageComponent } from './components/main-page/chat-page/chat-page.component';
import { CreateRoomComponent } from './components/main-page/chat-page/create-room/create-room.component';
import { GetPasswordComponent } from './components/main-page/chat-page/get-password/get-password.component';
import { UserListHiddenComponent } from './components/main-page/chat-page/user-list-hidden/user-list-hidden.component';
import { ChannelListHiddenComponent } from './components/main-page/chat-page/channel-list-hidden/channel-list-hidden.component';
import { WaitingRoomComponent } from './components/main-page/play/waiting-room/waiting-room/waiting-room.component';
import { ProfilePopupComponent } from './components/main-page/profile-popup/profile-popup.component';
import { PongGameComponent } from './components/pong-game/pong-game.component';
import { ShowRoomComponent } from './components/main-page/play/show-room/show-room.component';
import { CookieService } from 'ngx-cookie-service';
import { TwoFaCheckComponent } from './components/landing-page/two-fa-check/two-fa-check.component';
import { CookieModule } from 'ngx-cookie';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule} from '@angular/material/menu';
import { NgxPaginationModule } from 'ngx-pagination'
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatSnackBarModule } from "@angular/material/snack-bar";

export function tokenGetter(): string | null {
  return sessionStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    ChatChannelComponent,
    ChatMessageComponent,
    LandingPageComponent,
    StartComponent,
    MainPageComponent,
    SettingsComponent,
    RankingComponent,
    PlayComponent,
    FriendsComponent,
    TwoFaPopupComponent,
    ChatPageComponent,
    CreateRoomComponent,
    GetPasswordComponent,
    UserListHiddenComponent,
    ChannelListHiddenComponent,
    WaitingRoomComponent,
    ProfilePopupComponent,
    PongGameComponent,
    ShowRoomComponent,
    TwoFaCheckComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatCardModule,
    MatListModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    NgxPaginationModule,
    FlexLayoutModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    CookieModule.forRoot()
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule { }
