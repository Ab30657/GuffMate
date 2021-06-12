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
	iconStatus: string = 'fa-eye';
	passType: string = 'password';
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
	toggle() {
		if (this.passType == 'password') {
			this.iconStatus = 'fa-eye-slash';
			this.passType = 'text';
			return;
		}
		this.iconStatus = 'fa-eye';
		this.passType = 'password';
	}
}
