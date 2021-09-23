import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { HomeComponent } from './components/home/home.component';
import { GameComponent } from './components/game/game.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from './components/profile/profile.component';
import { TwoFAComponent } from './components/two-fa/two-fa.component';
import { ChatComponent } from './components/chat/chat.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatRoomComponent } from './components/chat/chat-room/chat-room.component';
import { ChatChannelComponent } from './components/main-page/chat-page/chat-channel/chat-channel.component';
import { ChatMessageComponent } from './components/main-page/chat-page/chat-message/chat-message.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { NgxPaginationModule } from 'ngx-pagination'
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatSnackBarModule } from "@angular/material/snack-bar";
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
import { WaitingRoomComponent } from './components/game/waiting-room/waiting-room/waiting-room.component';


export function tokenGetter(): string | null {
  return sessionStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    GameComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    TwoFAComponent,
    ChatComponent,
    ChatRoomComponent,
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
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
