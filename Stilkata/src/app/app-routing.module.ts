import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { MessagesComponent } from './messages/messages.component';
import { PlayComponent } from "./play/play.component";
import { PreferencesComponent } from "./preferences/preferences.component";
import { RecordsComponent } from "./records/records.component";
import { RegisterComponent } from "./register/register.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'records', component: RecordsComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'preferences', component: PreferencesComponent},
  {path: 'play', component: PlayComponent},
  { path: 'messages', component: MessagesComponent },
  {path: '**',redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
