import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';
import { catchError, take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
	constructor(
		private accounService: AccountService,
		private router: Router
	) {}

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		let currentUser: User;
		this.accounService.currentUser$
			.pipe(take(1))
			.subscribe((user) => (currentUser = user));

		if (currentUser) {
			request = request.clone({
				setHeaders: {
					Authorization: `Bearer ${currentUser.token}`,
				},
			});
		}
		return next.handle(request).pipe(
			catchError((err) => {
				console.log(err);
				if (err.status === 401) {
					localStorage.removeItem('user');
					this.router.navigateByUrl('/login');
				}
				throw err;
			})
		);
	}
}
