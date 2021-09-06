import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { TwoFAComponent } from './components/two-fa/two-fa.component';

import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { StartComponent } from './components/landing-page/start/start.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { PlayComponent } from './components/main-page/play/play.component';
import { ChatComponent } from './components/main-page/chat/chat.component';
import { FriendsComponent } from './components/main-page/friends/friends.component';
import { RankingComponent } from './components/main-page/ranking/ranking.component';
import { SettingsComponent } from './components/main-page/settings/settings.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { RegistrationComponent } from './components/landing-page/registration/registration.component';

const routes: Routes = [
  {path: '', redirectTo: "landingPage/start", pathMatch: "full"},
  /*{path: '**', redirectTo: 'landingPage/start', pathMatch: 'full'},*/
  { path: 'landingPage', component: LandingPageComponent, children: [
    { path: 'start', component: StartComponent },
    { path: 'registration', component:  RegistrationComponent}
  ]},
  { path: 'mainPage', component: MainPageComponent, children: [
    {path: 'play', component: PlayComponent},
    {path: 'chat', component: ChatComponent},
    {path: 'friends', component: FriendsComponent},
    {path: 'ranking', component: RankingComponent},
    {path: 'settings', component: SettingsComponent}
  ]},
  {path: "home", component: HomeComponent},
  {path: "navigation", component: NavigationComponent},
  {path: "game", component: GameComponent},
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "profile", component: ProfileComponent},
  {path: "twofa", component: TwoFAComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
