import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { getPaginationHeaders, getPaginatedResult } from './paginationHelper';
import { Message } from '../_models/message';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../_models/user';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { BusyService } from './busy.service';
import { Group } from '../_models/group';
import { PresenceService } from './presence.service';
import { convertUpdateArguments } from '@angular/compiler/src/compiler_util/expression_converter';

@Injectable({
	providedIn: 'root',
})
export class MessageService {
	baseUrl = environment.apiUrl;
	hubUrl = environment.hubUrl;

	private hubConnection: HubConnection;

	private messageThreadSource = new BehaviorSubject<Message[]>([]);
	messageThread$ = this.messageThreadSource.asObservable();
	private isTypingSource = new ReplaySubject<boolean>(1);
	isTyping$ = this.isTypingSource.asObservable();

	private latestMessagesSource = new BehaviorSubject<Message[]>([]);
	latestMessages$ = this.latestMessagesSource.asObservable();

	constructor(private http: HttpClient, private busyService: BusyService) {}

	createHubConnection(user: User, otherUsername: string) {
		this.hubConnection = new HubConnectionBuilder()
			.withUrl(this.hubUrl + 'message?user=' + otherUsername, {
				accessTokenFactory: () => user.token,
			})
			.withAutomaticReconnect()
			.build();
		this.hubConnection.start().catch((x) => console.log(x));
		this.hubConnection.on('ReceiveMessageThread', (messages: Message[]) => {
			this.messageThreadSource.next(messages);
			if (messages != null && messages.length != 0) {
				this.latestMessages$.pipe(take(1)).subscribe((msgs) => {
					if (msgs != null && msgs.length != 0) {
						let x = msgs.find(
							(a) =>
								a.senderUsername == otherUsername ||
								a.senderUsername == otherUsername
						);
						if (x != null && x != undefined) {
							x.dateRead = new Date(Date.now());
							console.log([...msgs]);
							this.latestMessagesSource.next([...msgs]);
						}
					}
				});
			}
		});

		this.hubConnection.on('NewMessage', (message: Message) => {
			this.messageThread$.pipe(take(1)).subscribe((messages) => {
				this.messageThreadSource.next([...messages, message]);
			});
			this.updateLatestMessages(message);
		});

		this.hubConnection.on('TypingNewMessage', (isTyping) => {
			this.isTypingSource.next(isTyping);
		});

		this.hubConnection.on('UpdatedGroup', (group: Group) => {
			if (group.connections.some((x) => x.username === otherUsername)) {
				this.messageThread$.pipe(take(1)).subscribe((x) => {
					x.forEach((a) => {
						if (!a.dateRead) {
							a.dateRead = new Date(Date.now());
						}
					});
					this.messageThreadSource.next([...x]);
				});
			}
		});
		this.hubConnection.on('UpdateLatestMessages', (messages: Message[]) => {
			messages = messages.filter((x) => x != null);
			console.log(messages);
			this.latestMessagesSource.next([...messages]);
		});
	}
	updateLatestMessages(message: Message) {
		this.latestMessages$.pipe(take(1)).subscribe((messages) => {
			var msg = messages.find(
				(x) =>
					(x.senderUsername == message.senderUsername &&
						x.recipientUsername == message.recipientUsername) ||
					(x.senderUsername == message.recipientUsername &&
						x.recipientUsername == message.senderUsername)
			);
			if (msg != null) {
				messages.splice(messages.indexOf(msg), 1);
			}
			this.latestMessagesSource.next([...messages, message]);
		});
	}
	stopHubConnection() {
		if (this.hubConnection) {
			this.hubConnection.stop();
		}
	}
	typingMessage(isTyping: boolean, otherUsername: string) {
		return this.hubConnection
			.invoke('EnteringMessage', otherUsername, isTyping)
			.catch((x) => console.log(x));
	}
	getMessages(pageNumber, pageSize, container) {
		let params = getPaginationHeaders(pageNumber, pageSize);
		params = params.append('Container', container);
		return getPaginatedResult<Message[]>(
			this.baseUrl + 'messages',
			params,
			this.http
		);
	}

	// getMessageThread(username: string) {
	// 	return this.http.get<Message[]>(
	// 		this.baseUrl + 'messages/thread/' + username
	// 	);
	// }

	sendMessage(username: string, content: string, isImage: boolean) {
		return this.hubConnection
			.invoke('SendMessage', {
				recipientUsername: username,
				content,
				isImage,
			})
			.catch((error) => console.log(error));
	}

	sendImage(file: File) {
		const formData = new FormData();
		formData.append('file', file, file.name);
		return this.http.post(this.baseUrl + 'messages/upload/', formData);
	}
}
