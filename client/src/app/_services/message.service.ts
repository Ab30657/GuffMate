import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { getPaginationHeaders, getPaginatedResult } from './paginationHelper';
import { Message } from '../_models/message';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../_models/user';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { BusyService } from './busy.service';

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

	constructor(private http: HttpClient, private busyService: BusyService) {}

	createHubConnection(user: User, otherUsername: string) {
		this.hubConnection = new HubConnectionBuilder()
			.withUrl(this.hubUrl + 'message?user=' + otherUsername, {
				accessTokenFactory: () => user.token,
			})
			.withAutomaticReconnect()
			.build();
		this.hubConnection.start().catch((x) => console.log(x));
		this.hubConnection.on('ReceiveMessageThread', (messages) => {
			this.messageThreadSource.next(messages);
		});

		this.hubConnection.on('NewMessage', (message) => {
			this.messageThread$.pipe(take(1)).subscribe((messages) => {
				this.messageThreadSource.next([...messages, message]);
			});
		});

		this.hubConnection.on('TypingNewMessage', (isTyping) => {
			this.isTypingSource.next(isTyping);
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

	getMessageThread(username: string) {
		return this.http.get<Message[]>(
			this.baseUrl + 'messages/thread/' + username
		);
	}

	sendMessage(username: string, content: string) {
		return this.hubConnection
			.invoke('SendMessage', {
				recipientUsername: username,
				content,
			})
			.catch((error) => console.log(error));
	}
}
