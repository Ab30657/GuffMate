import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Friend } from '../_models/Friend';
import { FriendsParams } from '../_models/friendsParams';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
	providedIn: 'root',
})
export class FriendsService {
	baseUrl = environment.apiUrl;
	private friendSource = new BehaviorSubject<Friend[]>(null);
	friends$ = this.friendSource.asObservable();
	constructor(private http: HttpClient) {}

	updateFriendList(data) {
		this.friendSource.next(data);
		this.friends$.subscribe((x: Friend[]) => {});
	}

	AcceptUserRequest(username: string) {
		return this.http
			.put(this.baseUrl + 'friends/received/' + username + '/accept', '')
			.pipe(
				map(() => {
					this.friends$.pipe(take(1)).subscribe((x) => {
						x.splice(
							x.findIndex((a) => a.username == username),
							1
						);
						this.friendSource.next([...x]);
					});
				})
			);
	}
	RejectUserFriend(username: string) {
		return this.http.put(
			this.baseUrl + 'friends/received/' + username + '/reject',
			''
		);
	}
}
