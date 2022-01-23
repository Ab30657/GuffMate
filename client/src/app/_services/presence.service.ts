import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class PresenceService {
	hubUrl = environment.hubUrl;
	private hubConnection: HubConnection;
	private onlineUsersSource = new BehaviorSubject<string[]>([]);
	onlineUsers$ = this.onlineUsersSource.asObservable();
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
			console.log(username + ' has connected');
		});

		this.hubConnection.on('UserIsOffline', (username) => {
			console.log(username + ' has disconnected');
		});

		this.hubConnection.on('GetOnlineUsers', (usernames: string[]) => {
			this.onlineUsersSource.next(usernames);
		});
	}

	stopHubConnection() {
		this.hubConnection.stop().catch((x) => console.log(x));
	}
}
