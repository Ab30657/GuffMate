import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';
import { routeTransitionAnimations } from './route-transition-animations';
import { PresenceService } from './_services/presence.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	animations: [routeTransitionAnimations],
})
export class AppComponent implements OnInit {
	title = 'client';
	/**
	 *
	 */
	constructor(
		private accountService: AccountService,
		private presence: PresenceService
	) {}
	ngOnInit(): void {
		this.setCurrentUser();
	}

	setCurrentUser() {
		const user: User = JSON.parse(localStorage.getItem('user'));
		// if (user) {
		this.accountService.setCurrentUser(user);
		if (user) {
			this.presence.createHubConnection(user);
		}
		// }
	}

	prepareRoute(outlet: RouterOutlet) {
		return (
			outlet &&
			outlet.activatedRouteData &&
			outlet.activatedRouteData['animationState']
		);
	}
}
