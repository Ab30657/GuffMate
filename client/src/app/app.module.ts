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
import { FormsModule } from '@angular/forms';
import { FriendRequestsComponent } from './dashboard-content/discover-left/friend-requests/friend-requests.component';
import { MessagesComponent } from './dashboard-content/messages/messages.component';
import { MessagesLeftComponent } from './dashboard-content/messages/messages-left/messages-left.component';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
@NgModule({
	declarations: [
		AppComponent,
		DashboardContentComponent,
		NavComponent,
		LoginComponent,
		DiscoverComponent,
		UserCardsComponent,
		FriendRequestsComponent,
		MessagesComponent,
		MessagesLeftComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		HttpClientModule,
		FormsModule,
		NgxSpinnerModule,
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
