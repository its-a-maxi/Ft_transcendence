import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatRoomComponent } from './components/chat/chat-room/chat-room.component';
import { ChatComponent } from './components/chat/chat.component';
import { GameComponent } from './components/game/game.component';
import { WaitingRoomComponent } from './components/game/waiting-room/waiting-room/waiting-room.component';
import { HomeComponent } from './components/home/home.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { StartComponent } from './components/landing-page/start/start.component';
import { TwoFaCheckComponent } from './components/landing-page/two-fa-check/two-fa-check.component';
import { LoginComponent } from './components/login/login.component';
import { ChatPageComponent } from './components/main-page/chat-page/chat-page.component';
import { FriendsComponent } from './components/main-page/friends/friends.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { PlayComponent } from './components/main-page/play/play.component';
import { ShowRoomComponent } from './components/main-page/play/show-room/show-room.component';
import { RankingComponent } from './components/main-page/ranking/ranking.component';
import { SettingsComponent } from './components/main-page/settings/settings.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { TwoFAComponent } from './components/two-fa/two-fa.component';

const routes: Routes = [
  {path: "login", component: LoginComponent},
  { path: 'landingPage', component: LandingPageComponent, children: [
    { path: 'start', component: StartComponent },
    { path: 'twoFaCheck', component: TwoFaCheckComponent }
  ]},
  { path: 'mainPage', component: MainPageComponent, children: [
    {path: 'waitingRoom/:id', component: WaitingRoomComponent},
    {path: 'play/:id', component: PlayComponent, children: [
      { path: 'matchmaking', component: WaitingRoomComponent },
      { path: 'showRoom', component: ShowRoomComponent}
    ]},
    {path: 'chat/:id', component: ChatPageComponent},
    {path: 'oldChat/:id', component: ChatRoomComponent},
    {path: 'friends/:id', component: FriendsComponent},
    {path: 'ranking/:id', component: RankingComponent},
    {path: 'settings/:id', component: SettingsComponent},
  ]},
  //{path: "mainPage/:id", component: NavigationComponent},
  //{path: "game", component: GameComponent},
  //{path: "register", component: RegisterComponent},
  //{path: "profile/:id", component: ProfileComponent},
  //{path: "twofa", component: TwoFAComponent},
  //{path: "chat/:id", component: ChatComponent},
  //{path: "chatRooms/:id", component: ChatRoomComponent},
  {path: '', redirectTo: "landingPage/start", pathMatch: "full"},
  {path: '**', redirectTo: 'landingPage/start', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
