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
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FriendRequestsComponent } from './dashboard-content/discover-left/friend-requests/friend-requests.component';
import { MessagesComponent } from './dashboard-content/messages/messages.component';
import { MessagesLeftComponent } from './dashboard-content/messages/messages-left/messages-left.component';
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
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
