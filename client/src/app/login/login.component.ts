import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormControl,
	FormGroup,
	ValidatorFn,
	Validators,
} from '@angular/forms';
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
	registerForm: FormGroup;
	loggedIn: boolean;
	iconStatus: string = 'fa-eye';
	passType: string = 'password';
	reel;
	tab1;
	tab2;
	panel1;
	panel2;
	islogin = true;
	loginValidationErrors: string[];
	constructor(
		private accountService: AccountService,
		private router: Router,
		private fb: FormBuilder
	) {}

	ngOnInit(): void {
		this.getCurrentUser();
		this.initRegForm();
		// console.log(this.registerForm.controls['password']);
	}
	initRegForm(): void {
		this.registerForm = this.fb.group({
			name: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			username: ['', Validators.required],

			password: ['', [Validators.required, Validators.minLength(6)]],
			confirmpassword: [
				'',
				[Validators.required, this.matchValues('password')],
			],
		});
	}
	matchValues(matchTo: string): ValidatorFn {
		return (control: AbstractControl) => {
			return control?.value === control?.parent?.controls[matchTo].value
				? null
				: { isMatch: true };
		};
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
				this.loginValidationErrors = error.error;
			}
		);
	}

	register() {
		this.accountService.register(this.registerForm.value).subscribe(
			(response) => {
				this.router.navigateByUrl('/profilecompletion');
				//load animations
			},
			(error) => {
				console.log(error);
			}
		);
	}

	getCurrentUser() {
		let user = JSON.parse(localStorage.getItem('user'));
		this.loggedIn = !!user;
		if (this.loggedIn) {
			this.router.navigateByUrl('/discover');
		}
	}
	toggle() {
		if (this.passType == 'password') {
			this.iconStatus = 'fa-eye-slash';
			this.passType = 'text';
			return;
		}
		this.iconStatus = 'fa-eye';
		this.passType = 'password';
		// console.log(this.registerForm.status);
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
