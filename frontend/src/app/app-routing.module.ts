import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatRoomComponent } from './components/chat/chat-room/chat-room.component';
import { ChatComponent } from './components/chat/chat.component';
import { GameComponent } from './components/game/game.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { TwoFAComponent } from './components/two-fa/two-fa.component';

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "mainPage/:id", component: NavigationComponent},
  {path: "game", component: GameComponent},
  {path: "register", component: RegisterComponent},
  {path: "profile/:id", component: ProfileComponent},
  {path: "twofa", component: TwoFAComponent},
  {path: "chat/:id", component: ChatComponent},
  {path: "chatRooms/:id", component: ChatRoomComponent},
  {path: '', redirectTo: "login", pathMatch: "full"},
  {path: '**', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
