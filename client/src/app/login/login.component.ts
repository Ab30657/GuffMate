import { AfterViewInit, Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit, AfterViewInit {
	model: any = {};
	registermodel: any = {};
	loggedIn: boolean;
	iconStatus: string = 'fa-eye';
	passType: string = 'password';
	reel;
	tab1;
	tab2;
	panel1;
	panel2;
	islogin = true;
	constructor(
		private accountService: AccountService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.getCurrentUser();
	}
	ngAfterViewInit(): void {
		this.reel = document.querySelector('.tab_reel');
		this.tab1 = document.querySelector('.tab1');
		this.tab2 = document.querySelector('.tab2');
		this.panel1 = document.querySelector('.tab_panel1');
		this.panel2 = document.querySelector('.tab_panel2');
	}
	login() {
		this.accountService.login(this.model).subscribe(
			(response) => {
				this.router.navigateByUrl('/discover');
			},
			(error) => {
				console.log(error);
			}
		);
	}

	register() {
		this.accountService.register(this.registermodel).subscribe(
			(response) => {
				this.router.navigateByUrl('/discover');
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
				this.router.navigateByUrl('/discover');
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

	slideLeft() {
		this.tab2.classList.remove('active');
		this.tab1.classList.add('active');
		this.reel.style.transform = 'translateX(0%)';
		this.islogin = true;
	}

	slideRight() {
		this.tab1.classList.remove('active');
		this.tab2.classList.add('active');
		this.reel.style.transform = 'translateX(-125%)';
		this.islogin = false;
	}
}
