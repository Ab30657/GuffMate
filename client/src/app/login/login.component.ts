import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
	host: {
		class: 'login-board',
	},
})
export class LoginComponent implements OnInit {
	model: any = {};
	loggedIn: boolean;
	constructor(
		private accountService: AccountService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.getCurrentUser();
	}

	login() {
		this.accountService.login(this.model).subscribe(
			(response) => {
				this.router.navigateByUrl('/home');
			},
			(error) => {
				console.log(error);
			}
		);
	}

	getCurrentUser() {
		this.accountService.currentUser$.subscribe(
			(user) => {
				this.loggedIn = !!user;
				this.router.navigateByUrl('/home');
			},
			(error) => {
				console.log(error);
			}
		);
	}
}
