import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  constructor(
		private http: HttpClient,
		private accountService: AccountService
	) {
		this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
			this.user = user;
			this.userParams = new UserParams(user);
			console.log(this.user);
		});
}
