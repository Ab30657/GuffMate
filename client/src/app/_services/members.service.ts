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
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { PresenceService } from './presence.service';

@Injectable({
	providedIn: 'root',
})
export class MembersService {
	baseUrl = environment.apiUrl;
	members: Member[] = [];
	memberCache = new Map();
	user: User;
	userParams: UserParams;
	private hubConnection: HubConnection;
	hubUrl = environment.hubUrl;
	constructor(
		private http: HttpClient,
		private accountService: AccountService
	) {
		this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
			this.user = user;
			this.userParams = new UserParams();
			// console.log(this.user);
		});
	}

	GetUserParams() {
		return this.userParams;
	}
	SetUserParams(params: UserParams) {
		this.userParams = params;
	}
	ResetUserParams() {
		this.userParams = new UserParams();
		return this.userParams;
	}
	GetUsers(userParams: UserParams) {
		// if (userParams.uptodate) {
		// 	var response = this.memberCache.get(
		// 		Object.values(userParams).join('-')
		// 	);
		// 	if (response) {
		// 		return of(response);
		// 	}
		// }
		let params = getPaginationHeaders(
			userParams.pageNumber,
			userParams.pageSize
		);
		params = params.append('gender', userParams.gender);
		params = params.append('orderBy', userParams.orderBy);

		return getPaginatedResult<Member[]>(
			this.baseUrl + 'users',
			params,
			this.http
		).pipe(
			map((response) => {
				// console.log(response);
				this.memberCache.set(
					Object.values(userParams).join('-'),
					response
				);
				this.members = response.result;
				userParams.uptodate = true;
				return response;
			})
		);
	}
	GetUser(username: string) {
		const member = [...this.memberCache.values()]
			.reduce((arr, element) => arr.concat(element.result), [])
			.find((member: Member) => member.username === username);
		if (member) return of(member);
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

	sendEmailVerification() {
		return this.http.get(this.baseUrl + 'users/verify-email');
	}

	checkEmailVerification(code) {
		return this.http.put(this.baseUrl + 'users/verify-email/check', {
			code,
		});
	}

	// sendSmsVerification() {
	// 	return this.http.get(this.baseUrl + 'users/verify-phone');
	// }

	// checkSmsVerification(code) {
	// 	return this.http.post(this.baseUrl + 'users/verify-phone/check', {
	// 		code,
	// 	});
	// }
	removeEmailAuth() {
		return this.http.put(this.baseUrl + 'users/verify-email/delete', {});
	}
}
