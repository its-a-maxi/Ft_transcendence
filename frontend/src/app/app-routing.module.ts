import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatRoomComponent } from './components/chat/chat-room/chat-room.component';
import { ChatComponent } from './components/chat/chat.component';
import { GameComponent } from './components/game/game.component';
import { HomeComponent } from './components/home/home.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { StartComponent } from './components/landing-page/start/start.component';
import { LoginComponent } from './components/login/login.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SettingsComponent } from './components/main-page/settings/settings.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { TwoFAComponent } from './components/two-fa/two-fa.component';

const routes: Routes = [
  {path: "login", component: LoginComponent},
  { path: 'landingPage', component: LandingPageComponent, children: [
    { path: 'start', component: StartComponent }
  ]},
  { path: 'mainPage', component: MainPageComponent, children: [
    {path: 'play/:id', component: SettingsComponent},
    {path: 'chat/:id', component: ChatRoomComponent},
    {path: 'friends/:id', component: SettingsComponent},
    {path: 'ranking/:id', component: SettingsComponent},
    {path: 'settings/:id', component: SettingsComponent},
  ]},
  {path: "mainPage/:id", component: NavigationComponent},
  {path: "game", component: GameComponent},
  {path: "register", component: RegisterComponent},
  {path: "profile/:id", component: ProfileComponent},
  {path: "twofa", component: TwoFAComponent},
  {path: "chat/:id", component: ChatComponent},
  {path: "chatRooms/:id", component: ChatRoomComponent},
  {path: '', redirectTo: "landingPage/start", pathMatch: "full"},
  {path: '**', redirectTo: 'landingPage/start', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
