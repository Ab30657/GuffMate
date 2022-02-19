import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Message } from '../_models/message';
import { MembersService } from './members.service';
import { Friend } from '../_models/Friend';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MessageService } from './message.service';
import { FriendsService } from './friends.service';
@Injectable({
	providedIn: 'root',
})
export class PresenceService {
	hubUrl = environment.hubUrl;
	private hubConnection: HubConnection;
	private onlineUsersSource = new BehaviorSubject<string[]>([]);
	onlineUsers$ = this.onlineUsersSource.asObservable();
	// private latestMessageSource = new BehaviorSubject<boolean>(false);
	// latestMessage$ = this.latestMessageSource.asObservable();

	constructor(
		private toastr: ToastrService,
		private router: Router,
		private messageService: MessageService,
		private friendsService: FriendsService
	) {}

	createHubConnection(user: User) {
		this.hubConnection = new HubConnectionBuilder()
			.withUrl(this.hubUrl + 'presence', {
				accessTokenFactory: () => user.token,
			})
			.withAutomaticReconnect()
			.build();

		this.hubConnection.start().catch((error) => console.log(error));
		this.hubConnection.on('UserIsOnline', (username) => {
			this.onlineUsers$.pipe(take(1)).subscribe((users) => {
				this.onlineUsersSource.next([...users, username]);
			});
		});

		this.hubConnection.on('UserIsOffline', (username) => {
			this.onlineUsers$.pipe(take(1)).subscribe((usernames) => {
				this.onlineUsersSource.next([
					...usernames.filter((x) => x !== username),
				]);
			});
		});

		this.hubConnection.on('GetOnlineUsers', (usernames: string[]) => {
			this.onlineUsersSource.next(usernames);
			this.messageService.latestMessages$.subscribe((x) => {
				if (x) {
					// this.latestMessageSource.next(true);
				} else {
				}
			});
		});

		this.hubConnection.on('NewMessageReceived', (message: Message) => {
			//design a notification pop up
			// console.log('here');
			// this.latestMessageSource.next(true)			this.latestFriendRequest.next(data);;
			this.messageService.updateLatestMessages(message);
			this.toastr
				.info(
					message.senderUsername +
						': ' +
						(message.isImage ? 'Sent an image.' : message.content)
				)
				.onTap.pipe(take(1))
				.subscribe(() => {
					this.router.navigateByUrl(
						'/messages/' + message.senderUsername
					);
				});
		});

		this.hubConnection.on('UpdateLatestMessages', (messages: Message[]) => {
			// console.log(messages);
			messages.forEach((x) => {
				if (x) {
					this.messageService.updateLatestMessages(x);
				}
			});
		});

		this.hubConnection.on('UpdateRequestList', (requests: Friend[]) => {
			this.friendsService.updateFriendList(requests);
		});

		this.hubConnection.on('NewFriendRequest', (data: Friend) => {
			// console.log(data);
			this.friendsService.friends$.pipe(take(1)).subscribe((x) => {
				// x.splice(x.findIndex((a) => a.username == data.username));
				// console.log(x);
				this.friendsService.updateFriendList([...x, data]);
			});
		});

		this.hubConnection.on('DeletedRequest', (request) => {
			this.friendsService.friends$.pipe(take(1)).subscribe((x) => {
				x.splice(x.findIndex((a) => a.username == request.username));
				this.friendsService.updateFriendList([...x]);
			});
		});
	}

	stopHubConnection() {
		this.hubConnection.stop().catch((x) => console.log(x));
	}
	SendRequest(username: string) {
		return this.hubConnection
			.invoke('SendRequest', username)
			.catch((error) => console.log(error));
		// return this.http.post(
		// 	this.baseUrl + 'friends/send-request/' + username,
		// 	''
		// );
	}
	CancelRequest(username: string) {
		return this.hubConnection
			.invoke('CancelRequest', username)
			.catch((x) => console.log(x));
	}
}
