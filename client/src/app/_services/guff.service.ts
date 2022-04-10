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

	createGuff(guff) {
		console.log(guff);
		return this.http.post(this.baseUrl + 'users/add-guff', guff);
	}

	getGuffs(username) {
		return this.http.get(this.baseUrl + 'users/' + username + '/guffs');
	}

	deleteGuff(guffId: number) {
		return this.http.delete(this.baseUrl + 'users/guffs/delete/' + guffId);
	}
	addLike(guffId: number) {
		return this.http.post(
			this.baseUrl + 'users/guffs/' + guffId + '/like',
			{}
		);
	}
	removeLike(guffId: number) {
		return this.http.post(
			this.baseUrl + 'users/guffs/' + guffId + '/like/delete',
			{}
		);
	}
	addComment(comment, guffId: number) {
		return this.http.post(
			this.baseUrl + 'users/guffs/' + guffId + '/comment',
			comment
		);
	}
}
