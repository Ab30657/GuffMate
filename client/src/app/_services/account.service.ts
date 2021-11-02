import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/user';
import { map } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class AccountService {
	fullRegisterComplete;
	baseUrl = environment.apiUrl;
	memberCache = new Map();
	private currentUserSource = new ReplaySubject<User>(1);
	currentUser$ = this.currentUserSource.asObservable();
	constructor(private http: HttpClient, private router: Router) {}
	isFullRegisterComplete() {
		return this.fullRegisterComplete;
	}
	login(model: any) {
		return this.http.post(this.baseUrl + 'account/login', model).pipe(
			map((response: User) => {
				const user = response;
				if (user) {
					// console.log(user);
					localStorage.setItem('user', JSON.stringify(user));
					this.memberCache = new Map();
					this.currentUserSource.next(user);
				}
			})
		);
	}
	register(model: any) {
		return this.http.post(this.baseUrl + 'account/register', model).pipe(
			map((response: User) => {
				const user = response;
				if (user) {
					localStorage.setItem('user', JSON.stringify(user));
					this.currentUserSource.next(user);
				}
			})
		);
	}
	setCurrentUser(user: User) {
		localStorage.setItem('user', JSON.stringify(user));
		this.currentUserSource.next(user);
	}
	logout() {
		localStorage.removeItem('user');
		this.memberCache = null;
		this.currentUserSource.next(null);
		this.router.navigateByUrl('/login');
	}
}
