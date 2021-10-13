import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WaitingRoomComponent } from './components/main-page/play/waiting-room/waiting-room/waiting-room.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { StartComponent } from './components/landing-page/start/start.component';
import { TwoFaCheckComponent } from './components/landing-page/two-fa-check/two-fa-check.component';
import { ChatPageComponent } from './components/main-page/chat-page/chat-page.component';
import { FriendsComponent } from './components/main-page/friends/friends.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { PlayComponent } from './components/main-page/play/play.component';
import { ShowRoomComponent } from './components/main-page/play/show-room/show-room.component';
import { RankingComponent } from './components/main-page/ranking/ranking.component';
import { SettingsComponent } from './components/main-page/settings/settings.component';
import { CookieGuard } from './guards/cookie.guard';

const routes: Routes = [
  { path: 'landingPage', component: LandingPageComponent, children: [
    { path: 'start', component: StartComponent },
    { path: 'twoFaCheck/:id', component: TwoFaCheckComponent }
  ]},
  { path: 'mainPage', component: MainPageComponent, children: [
    {path: 'waitingRoom/:id', component: WaitingRoomComponent},
    {path: 'play/:id', component: PlayComponent, children: [
      { path: 'private', component: WaitingRoomComponent },
      { path: 'showRoom', component: ShowRoomComponent}
    ]},
    {path: 'chat/:id', component: ChatPageComponent},
    {path: 'friends/:id', component: FriendsComponent},
    {path: 'ranking/:id', component: RankingComponent},
    {path: 'settings/:id', component: SettingsComponent},
  ], canActivate: [CookieGuard]},
  {path: '', redirectTo: "landingPage/start", pathMatch: "full"},
  {path: '**', redirectTo: 'landingPage/start', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
