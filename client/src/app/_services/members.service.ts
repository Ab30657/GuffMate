import { UserParams } from './../_models/userParams';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, ReplaySubject, BehaviorSubject } from 'rxjs';
import { Member } from '../_models/member';
import { of } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { PaginatedResult } from '../_models/pagination';
import { AccountService } from './account.service';
import { User } from '../_models/user';
import { Friend, RequestStatus } from '../_models/Friend';
import { FriendsParams } from '../_models/friendsParams';

@Injectable({
	providedIn: 'root',
})
export class MembersService {
	baseUrl = environment.apiUrl;
	members: Member[] = [];
	private friendSource = new BehaviorSubject<Friend[]>([]);
	friends$ = this.friendSource.asObservable();
	friends: Friend[] = [];
	user: User;
	userParams: UserParams;
	friendsParams: FriendsParams;
	constructor(
		private http: HttpClient,
		private accountService: AccountService
	) {
		this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
			this.user = user;
			this.userParams = new UserParams();
			this.friendsParams = new FriendsParams();
			this.GetUserRequests(this.friendsParams).subscribe((x) => {});
			// console.log(this.user);
		});
	}
	getFriends() {
		return this.http.get<Friend[]>(
			this.baseUrl + 'friends?predicate=accepted'
		);
	}
	updateFriendList(data) {
		this.friendSource.next(data);
	}
	SendRequest(username: string) {
		return this.http.post(
			this.baseUrl + 'friends/send-request/' + username,
			''
		);
	}
	CancelRequest(username: string) {
		return this.http.delete(
			this.baseUrl + 'friends/delete-request/' + username
		);
	}
	AcceptUserRequest(username: string) {
		return this.http
			.put(this.baseUrl + 'friends/received/' + username + '/accept', '')
			.pipe(
				map(() => {
					this.friends.splice(
						this.friends.findIndex((x) => x.username == username),
						1
					);
					this.friendSource.next(Object.assign([], this.friends));
				})
			);
		// .pipe(
		// map(() => {
		// this.members.find((x) => x.username).friendStatus = 2;
		// let member:Member = [...this.accountService.friendCache.values()]
		// 	.reduce((arr, elem) => arr.concat(elem.result), [])
		// 	.find((member: Member) => member.username === username);
		// 	})
		// );
		// let friends = [];
		// this.friends$.subscribe(
		// 	friends => (x.find((x) => x.username == username).status = 2)
		// );
		// this.members.find((x) => x.username == username).friendStatus = 2;
		// console.log(this.members);
		// console.log(this.friends);
		// return of(this.friends.find((x) => x.username));
	}
	RejectUserFriend(username: string) {
		return this.http.put(
			this.baseUrl + 'friends/received/' + username + '/reject',
			''
		);
	}
	//Ideas to combine above two functions into a same function with status property changed for a request
	GetUserRequests(userParams: FriendsParams) {
		// var response = this.accountService.friendCache.get(
		// 	Object.values(this.friendsParams).join('-')
		// );
		// if (response) {
		// 	return of(response);
		// }
		// console.log(this.friends);
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
				if (x != undefined) {
					this.friends = x.result;
					this.friendSource.next(Object.assign([], this.friends));
				}
			})
		);
		// 			this.friends = x.result;
		// 			return this.friends;
		// 			// var requests = [];
		// 			// x.result.forEach((x) => {
		// 			// 	this.GetUser(x.username).subscribe((x) => {
		// 			// 		requests.push(x);
		// 			// 	});
		// 			// });
		// 			// this.accountService.friendCache.set(
		// 			// 	Object.values(this.friendsParams).join('-'),
		// 			// 	requests
		// 			// );
		// 			// return requests;
		// 		}
		// 	})
		// );
		// let params = this.getPaginationHeaders(
		// 	userParams.pageNumber,
		// 	userParams.pageSize
		// );

		// return this.getPaginatedResult<Member[]>(
		// 	this.baseUrl + 'users',
		// 	params
		// ).pipe(
		// 	map((response) => {
		// 		// console.log(response);
		// 		this.accountService.memberCache.set(
		// 			Object.values(userParams).join('-'),
		// 			response
		// 		);
		// 		this.members = response.result;
		// 		return response;
		// 	})
		// );
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
		this.userParams = new UserParams();
		return this.userParams;
	}
	GetUsers(userParams: UserParams) {
		// if (this.members.length > 0) {
		// 	return of(this.members);
		// }
		// var response = this.accountService.memberCache.get(
		// 	Object.values(userParams).join('-')
		// );
		// if (response) {
		// 	return of(response);
		// }
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
				// console.log(response);
				this.accountService.memberCache.set(
					Object.values(userParams).join('-'),
					response
				);
				this.members = response.result;
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
