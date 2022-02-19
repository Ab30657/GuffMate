import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
	UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from '../_services/account.service';

@Injectable({
	providedIn: 'root',
})
export class LoginGuard implements CanActivate {
	constructor(
		private accountService: AccountService,
		private router: Router
	) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> {
		return this.accountService.currentUser$.pipe(
			map((user) => {
				if (!user) return true;
				this.router.navigateByUrl('');
				//else YOU SHALL PASS!
			})
		);
	}
}
