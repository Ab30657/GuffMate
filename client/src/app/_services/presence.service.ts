import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Message } from '../_models/message';
import { MembersService } from './members.service';
import { Friend } from '../_models/Friend';

@Injectable({
	providedIn: 'root',
})
export class PresenceService {
	hubUrl = environment.hubUrl;
	private hubConnection: HubConnection;
	private onlineUsersSource = new BehaviorSubject<string[]>([]);
	onlineUsers$ = this.onlineUsersSource.asObservable();
	private latestMessageSource = new BehaviorSubject<Message>(null);
	latestMessage$ = this.latestMessageSource.asObservable();
	constructor() {}

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
			console.log('on');
		});

		this.hubConnection.on('UserIsOffline', (username) => {
			this.onlineUsers$.pipe(take(1)).subscribe((usernames) => {
				this.onlineUsersSource.next([
					...usernames.filter((x) => x != username),
				]);
			});
			console.log('gone');
		});

		this.hubConnection.on('GetOnlineUsers', (usernames: string[]) => {
			this.onlineUsersSource.next(usernames);
		});

		this.hubConnection.on('NewMessageReceived', (message) => {
			//design a notification pop up
			this.latestMessageSource.next(message);
		});
	}

	stopHubConnection() {
		this.hubConnection.stop().catch((x) => console.log(x));
	}
}
