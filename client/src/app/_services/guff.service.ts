import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { Guff } from '../_models/guff';
import { environment } from 'src/environments/environment';
import { Like } from '../_models/like';

@Injectable({
	providedIn: 'root',
})
export class GuffService {
	user: User;
	userParams: UserParams;
	baseUrl = environment.apiUrl;
	constructor(
		private http: HttpClient,
		private accountService: AccountService
	) {
		this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
			this.user = user;
			this.userParams = new UserParams();
		});
	}

	createGuff(guff: Guff) {
		this.http.post(this.baseUrl + 'users/add-guff', guff);
	}

	getGuffs() {
		return this.http.get(this.baseUrl + 'users/guffs');
	}

	addLike(guffId: number) {
		this.http.post(this.baseUrl + 'users/guffs/' + guffId + '/like', {});
	}

	addComment(comment: Comment, guffId: number) {
		this.http.post(
			this.baseUrl + 'users/guffs/' + guffId + '/comment',
			comment
		);
	}
}
