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
@NgModule({
	declarations: [
		AppComponent,
		DashboardContentComponent,
		NavComponent,
		LoginComponent,
		DiscoverComponent,
		UserCardsComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		HttpClientModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
