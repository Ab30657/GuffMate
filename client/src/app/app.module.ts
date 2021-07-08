import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './login/login.component';
import { DiscoverComponent } from './dashboard-content/discover/discover.component';
import { UserCardsComponent } from './dashboard-content/discover/user-cards/user-cards.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FriendRequestComponent } from './dashboard-content/discover/discover-left/friend-request/friend-request.component';
import { MessagesComponent } from './dashboard-content/messages/messages.component';
import { MessagesLeftComponent } from './dashboard-content/messages/messages-left/messages-left.component';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import { SettingsComponent } from './dashboard-content/settings/settings.component';
import { SettingsLeftComponent } from './dashboard-content/settings/settings-left/settings-left.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TextInputComponent } from './_forms/text-input/text-input.component';
import { ProfileCompleteComponent } from './profile-complete/profile-complete.component';
import { DiscoverLeftComponent } from './dashboard-content/discover/discover-left/discover-left.component';
@NgModule({
	declarations: [
		AppComponent,
		DashboardContentComponent,
		NavComponent,
		LoginComponent,
		DiscoverComponent,
		UserCardsComponent,
		MessagesComponent,
		MessagesLeftComponent,
		SettingsComponent,
		SettingsLeftComponent,
		TextInputComponent,
		ProfileCompleteComponent,
		FriendRequestComponent,
		DiscoverLeftComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		NgxSpinnerModule,
		TabsModule,
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: JwtInterceptor,
			multi: true,
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: LoadingInterceptor,
			multi: true,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
