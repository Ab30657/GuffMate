import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { Guff } from '../_models/guff';
import { environment } from 'src/environments/environment';
import { Like } from '../_models/like';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { GuffComment } from '../_models/comment';

@Injectable({
	providedIn: 'root',
})
export class GuffService {
	user: User;
	userParams: UserParams;
	baseUrl = environment.apiUrl;
	hubUrl = environment.hubUrl;

	private hubConnection: HubConnection;
	private guffThreadSource = new BehaviorSubject<Guff[]>(null);
	guffThread$ = this.guffThreadSource.asObservable();

	constructor(
		private http: HttpClient,
		private accountService: AccountService
	) {
		this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
			this.user = user;
			this.userParams = new UserParams();
		});
	}
	createHubConnection(user: User, otherUser) {
		this.hubConnection = new HubConnectionBuilder()
			.withUrl(this.hubUrl + 'guffs?user=' + otherUser, {
				accessTokenFactory: () => user.token,
			})
			.withAutomaticReconnect()
			.build();
		this.hubConnection.start().catch((x) => console.log(x));
		this.hubConnection.on('ReceiveTimelineGuffs', (guffs: Guff[]) => {
			this.guffThreadSource.next(guffs);
		});

		this.hubConnection.on('NewGuff', (guff: Guff) => {
			this.guffThread$.pipe(take(1)).subscribe((guffs) => {
				this.guffThreadSource.next([guff, ...guffs]);
			});
		});
		//New Guff Notification
		this.hubConnection.on('NewFriendGuff', (guff: Guff) => {});

		this.hubConnection.on('LikeGuff', (likeDto: Like) => {
			this.guffThread$.pipe(take(1)).subscribe((x) => {
				var guff = x.find((x) => x.id == likeDto.guffId);
				if (guff) {
					guff.likedUsers?.push(likeDto);
					this.guffThreadSource.next([...x]);
				}
			});
		});
		this.hubConnection.on('UnlikeGuff', (likeDto: Like) => {
			this.guffThread$.pipe(take(1)).subscribe((x) => {
				var guff = x.find((x) => x.id == likeDto.guffId);
				console.log(guff);
				if (guff) {
					guff.likedUsers?.splice(
						guff.likedUsers.findIndex(
							(a) => a.username == likeDto.username
						),
						1
					);
				}
			});
		});
		this.hubConnection.on('NewComment', (commentDto: GuffComment) => {
			this.guffThread$.pipe(take(1)).subscribe((x) => {
				var guff = x.find((x) => x.id == commentDto.guffId);
				if (guff) {
					guff.comments?.push(commentDto);
					this.guffThreadSource.next([...x]);
				}
			});
		});
		this.hubConnection.on('RemoveComment', (commentDto: GuffComment) => {
			this.guffThread$.pipe(take(1)).subscribe((x) => {
				var guff = x.find((x) => x.id == commentDto.guffId);
				if (guff) {
					guff.likedUsers?.splice(
						guff.likedUsers.findIndex((a) => a.id == commentDto.id),
						1
					);
					this.guffThreadSource.next([...x]);
				}
			});
		});
	}
	stopHubConnection() {
		if (this.hubConnection) {
			this.guffThreadSource.next([]);
			this.hubConnection.stop();
		}
	}

	createGuff(content) {
		return this.hubConnection
			.invoke('CreateGuff', content)
			.catch((error) => console.log(error));
	}

	createComment(comment) {
		return this.hubConnection
			.invoke('CreateComment', comment)
			.catch((error) => console.log(error));
	}

	likeGuff(guffId) {
		return this.hubConnection
			.invoke('LikeGuff', guffId)
			.catch((error) => console.log(error));
	}
	unlikeGuff(guffId) {
		return this.hubConnection
			.invoke('UnlikeGuff', guffId)
			.catch((error) => console.log(error));
	}
	getGuffs(username) {
		return this.http.get(this.baseUrl + 'users/' + username + '/guffs');
	}

	deleteGuff(guffId: number) {
		return this.http.delete(this.baseUrl + 'users/guffs/delete/' + guffId);
	}
}
