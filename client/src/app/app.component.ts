import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';
import { routeTransitionAnimations } from './route-transition-animations';

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
	constructor(private accountService: AccountService) {}
	ngOnInit(): void {
		this.setCurrentUser();
	}

	setCurrentUser() {
		const user: User = JSON.parse(localStorage.getItem('user'));
		this.accountService.setCurrentUser(user);
	}

	prepareRoute(outlet: RouterOutlet) {
		return (
			outlet &&
			outlet.activatedRouteData &&
			outlet.activatedRouteData['animationState']
		);
	}
}
