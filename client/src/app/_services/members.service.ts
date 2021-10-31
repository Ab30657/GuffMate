import { UserParams } from './../_models/userParams';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member } from '../_models/member';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { PaginatedResult } from '../_models/pagination';
import { AccountService } from './account.service';
import { User } from '../_models/user';
import { Friend } from '../_models/Friend';
import { FriendsParams } from '../_models/friendsParams';

@Injectable({
	providedIn: 'root',
})
export class MembersService {
	baseUrl = environment.apiUrl;
	members: Member[] = [];
	memberCache = new Map();
	user: User;
	userParams: UserParams;
	friendsParams: FriendsParams;
	constructor(
		private http: HttpClient,
		private accountService: AccountService
	) {
		this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
			this.user = user;
			this.userParams = new UserParams(user);
			this.friendsParams = new FriendsParams();
			console.log(this.user);
		});
	}
	AcceptUserRequest(username: string) {
		return this.http.put(
			this.baseUrl + 'friends/received/' + username + '/accept',
			''
		);
	}
	RejectUserFriend(username: string) {
		return this.http.put(
			this.baseUrl + 'friends/received/' + username + '/reject',
			''
		);
	}
	//Ideas to combine above two functions into a same function with status property changed for a request
	GetUserRequests(userParams: FriendsParams) {
		let params = this.getPaginationHeaders(
			userParams.pageNumber,
			userParams.pageSize
		);
		params = params.append('predicate', 'received');
		return this.getPaginatedResult<Friend[]>(
			this.baseUrl + 'friends',
			params
		).pipe(
			map((x) => {
				return x;
			})
		);
	}
	GetUserParams() {
		return this.userParams;
	}
	GetFriendsParams() {
		return this.friendsParams;
	}
	SetUserParams(params: UserParams) {
		this.userParams = this.userParams;
	}
	ResetUserParams() {
		this.userParams = new UserParams(this.user);
		return this.userParams;
	}
	GetUsers(userParams: UserParams) {
		// if (this.members.length > 0) {
		// 	return of(this.members);
		// }
		var response = this.memberCache.get(
			Object.values(userParams).join('-')
		);
		if (response) {
			return of(response);
		}
		let params = this.getPaginationHeaders(
			userParams.pageNumber,
			userParams.pageSize
		);
		params = params.append('gender', userParams.gender);
		params = params.append('orderBy', userParams.orderBy);

		return this.getPaginatedResult<Member[]>(
			this.baseUrl + 'users',
			params
		).pipe(
			map((response) => {
				this.memberCache.set(
					Object.values(userParams).join('-'),
					response
				);
				return response;
			})
		);
	}
	private getPaginatedResult<T>(url, params: HttpParams) {
		const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
		return this.http
			.get<T>(url, {
				observe: 'response',
				params,
			})
			.pipe(
				map((response) => {
					paginatedResult.result = response.body;
					if (response.headers.get('Pagination') !== null) {
						paginatedResult.pagination = JSON.parse(
							response.headers.get('Pagination')
						);
					}
					return paginatedResult;
				})
			);
	}

	private getPaginationHeaders(pageNumber: number, pageSize: number) {
		let params = new HttpParams();
		params = params.append('pageNumber', pageNumber.toString());
		params = params.append('pageSize', pageSize.toString());
		return params;
	}
	GetUser(username: string) {
		const member = this.members.find((x) => x.username === username);
		if (member !== undefined) return of(member);
		return this.http.get<Member>(this.baseUrl + 'users/' + username);
	}

	setMainPhoto(photoId: number) {
		return this.http.put(
			this.baseUrl + 'users/set-main-photo/' + photoId,
			{}
		);
	}
	deleteMainPhoto() {
		return this.http.put(this.baseUrl + 'users/remove-main-photo/', {});
	}
	update(profileCompleteForm) {
		return this.http
			.put(this.baseUrl + 'users', profileCompleteForm.value)
			.pipe(
				map(() => {
					const index = this.members.indexOf(
						profileCompleteForm.value
					);
					this.members[index] = profileCompleteForm.value;
				})
			);
	}
}
