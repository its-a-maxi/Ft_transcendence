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
import { MatSnackBarModule } from "@angular/material/snack-bar";

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
import { ChatRoomComponent } from './components/chat/chat-room/chat-room.component';
import { ChatChannelComponent } from './components/chat/chat-channel/chat-channel.component';
import { ChatMessageComponent } from './components/chat/chat-message/chat-message.component';

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
    ChatMessageComponent
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
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
