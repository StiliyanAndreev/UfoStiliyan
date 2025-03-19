import { HttpClientModule, provideHttpClient, withFetch } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';

import { NgOptimizedImage } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PlayComponent } from './play/play.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { RecordsComponent } from './records/records.component';
import { RegisterComponent } from './register/register.component';
import { MessagesComponent } from './messages/messages.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    RecordsComponent,
    RegisterComponent,
    PreferencesComponent,
    LoginComponent,
    PlayComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgOptimizedImage,
    FormsModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
