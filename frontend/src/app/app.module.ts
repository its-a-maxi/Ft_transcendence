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

import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { StartComponent } from './components/landing-page/start/start.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { PlayComponent } from './components/main-page/play/play.component';
import { ChatComponent } from './components/main-page/chat/chat.component';
import { FriendsComponent } from './components/main-page/friends/friends.component';
import { RankingComponent } from './components/main-page/ranking/ranking.component';
import { SettingsComponent } from './components/main-page/settings/settings.component';
import { RegistrationComponent } from './components/landing-page/registration/registration.component';


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

    LandingPageComponent,
    StartComponent,
    MainPageComponent,
    PlayComponent,
    ChatComponent,
    FriendsComponent,
    RankingComponent,
    SettingsComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
