import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/user';
import { map } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { PresenceService } from './presence.service';
import { SocialAuthService } from 'angularx-social-login';

@Injectable({
	providedIn: 'root',
})
export class AccountService {
	fullRegisterComplete;
	baseUrl = environment.apiUrl;
	memberCache = new Map();
	friendCache = new Map();
	private currentUserSource = new ReplaySubject<User>(1);
	private externalAuth: boolean;
	currentUser$ = this.currentUserSource.asObservable();
	constructor(
		private http: HttpClient,
		private presence: PresenceService,
		private router: Router,
		private socialAuthService: SocialAuthService
	) {}
	isFullRegisterComplete() {
		return this.fullRegisterComplete;
	}
	login(model: any) {
		return this.http.post(this.baseUrl + 'account/login', model).pipe(
			map((response: User) => {
				const user = response;
				if (user) {
					localStorage.setItem('user', JSON.stringify(user));
					this.memberCache = new Map();
					this.friendCache = new Map();
					this.currentUserSource.next(user);
					this.presence.createHubConnection(user);
					return user;
				}
				return null;
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
					this.presence.createHubConnection(user);
				}
			})
		);
	}
	loginExternal(model: any) {
		return this.http
			.post(this.baseUrl + 'account/external-login', model)
			.pipe(
				map((response: User) => {
					const user = response;
					if (user) {
						localStorage.setItem('user', JSON.stringify(user));
						this.memberCache = new Map();
						this.friendCache = new Map();
						this.currentUserSource.next(user);
						this.presence.createHubConnection(user);
						this.externalAuth = true;
						return true;
					}
					return false;
				})
			);
	}
	setCurrentUser(user: User) {
		localStorage.setItem('user', JSON.stringify(user));
		this.currentUserSource.next(user);
	}
	logout() {
		this.presence.stopHubConnection();
		if (this.externalAuth) {
			this.socialAuthService.signOut();
		}
		localStorage.removeItem('user');
		console.log(localStorage.getItem('user'));
		this.memberCache = null;
		this.friendCache = null;
		this.currentUserSource.next(null);
		this.router.navigateByUrl('/login');
	}
}
