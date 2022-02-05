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
@Injectable({
	providedIn: 'root',
})
export class PresenceService {
	hubUrl = environment.hubUrl;
	private hubConnection: HubConnection;
	private onlineUsersSource = new BehaviorSubject<string[]>([]);
	onlineUsers$ = this.onlineUsersSource.asObservable();
	private latestMessageSource = new BehaviorSubject<boolean>(false);
	latestMessage$ = this.latestMessageSource.asObservable();
	constructor(
		private toastr: ToastrService,
		private router: Router,
		private messageService: MessageService
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
			console.log('on');
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
					this.latestMessageSource.next(true);
				} else {
				}
			});
		});

		this.hubConnection.on('NewMessageReceived', (message: Message) => {
			//design a notification pop up
			console.log('here');
			this.latestMessageSource.next(true);
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
			console.log(messages);
			messages.forEach((x) => {
				if (x) {
					this.messageService.updateLatestMessages(x);
				}
			});
		});
	}

	stopHubConnection() {
		this.hubConnection.stop().catch((x) => console.log(x));
	}
}
