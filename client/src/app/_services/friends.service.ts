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
	private friendSource = new BehaviorSubject<Friend[]>([]);
	friends$ = this.friendSource.asObservable();
	friendsParams: FriendsParams;
	constructor(private http: HttpClient) {
		this.friendsParams = new FriendsParams();
	}

	updateFriendList(data) {
		this.friendSource.next(data);
	}

	AcceptUserRequest(username: string) {
		return this.http
			.put(this.baseUrl + 'friends/received/' + username + '/accept', '')
			.pipe(
				map(() => {
					// this.friends.splice(
					// 	this.friends.findIndex((x) => x.username == username),
					// 	1
					// );
					this.friends$.pipe(take(1)).subscribe((x) => {
						x.splice(
							x.findIndex((a) => a.username == username),
							1
						);
						console.log(x);
						this.friendSource.next([...x]);
					});
					// console.log([...this.memberCache.values()]);
					// let members = [...this.memberCache.values()].reduce(
					// 	(arr, element) => arr.concat(element.result),
					// 	[]
					// );
					// members.splice(
					// 	members.indexOf((x) => x.username === username),
					// 	1
					// );
					// this.GetUser(username).subscribe((x) => {
					// 	let member: Member = x;
					// 	member.friendStatus = 2;
					// 	this.members.push(member);
					// 	this.memberCache.set(
					// 		Object.values(this.userParams).join('-'),
					// 		members
					// 	);
					// 	console.log([...this.memberCache.values()]);
					// });
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
	GetFriendsParams() {
		return this.friendsParams;
	}
	//Ideas to combine above two functions into a same function with status property changed for a request
	// GetUserRequests(userParams: FriendsParams) {
	// 	// var response = this.accountService.friendCache.get(
	// 	// 	Object.values(this.friendsParams).join('-')
	// 	// );
	// 	// if (response) {
	// 	// 	return of(response);
	// 	// }
	// 	// console.log(this.friends);
	// 	let params = getPaginationHeaders(
	// 		userParams.pageNumber,
	// 		userParams.pageSize
	// 	);
	// 	params = params.append('predicate', 'received');

	// 	return getPaginatedResult<Friend[]>(
	// 		this.baseUrl + 'friends',
	// 		params,
	// 		this.http
	// 	).pipe(
	// 		map((x) => {
	// 			if (x != undefined) {
	// 				this.friendSource.next([...x.result]);
	// 			}
	// 		})
	// 	);
	// 	// 			this.friends = x.result;
	// 	// 			return this.friends;
	// 	// 			// var requests = [];
	// 	// 			// x.result.forEach((x) => {
	// 	// 			// 	this.GetUser(x.username).subscribe((x) => {
	// 	// 			// 		requests.push(x);
	// 	// 			// 	});
	// 	// 			// });
	// 	// 			// this.accountService.friendCache.set(
	// 	// 			// 	Object.values(this.friendsParams).join('-'),
	// 	// 			// 	requests
	// 	// 			// );
	// 	// 			// return requests;
	// 	// 		}
	// 	// 	})
	// 	// );
	// 	// let params = this.getPaginationHeaders(
	// 	// 	userParams.pageNumber,
	// 	// 	userParams.pageSize
	// 	// );

	// 	// return this.getPaginatedResult<Member[]>(
	// 	// 	this.baseUrl + 'users',
	// 	// 	params
	// 	// ).pipe(
	// 	// 	map((response) => {
	// 	// 		// console.log(response);
	// 	// 		this.accountService.memberCache.set(
	// 	// 			Object.values(userParams).join('-'),
	// 	// 			response
	// 	// 		);
	// 	// 		this.members = response.result;
	// 	// 		return response;
	// 	// 	})
	// 	// );
	// }
	getFriends() {
		return this.http.get<Friend[]>(
			this.baseUrl + 'friends?predicate=accepted'
		);
	}
}
