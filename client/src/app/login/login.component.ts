import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
	host: {
		class: 'login-board',
	},
})
export class LoginComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}
