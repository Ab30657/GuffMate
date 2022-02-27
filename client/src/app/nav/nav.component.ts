import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { PresenceService } from '../_services/presence.service';
import { MessageService } from '../_services/message.service';
import { Message } from '../_models/message';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
	user: User;
	unreadMessages: boolean;
	messages: Message[];
	constructor(
		private accountService: AccountService,
		private presence: PresenceService,
		private messageService: MessageService
	) {
		this.accountService.currentUser$
			.pipe(take(1))
			.subscribe((x) => (this.user = x));
	}

	ngOnInit(): void {
		this.messageService.latestMessages$.subscribe((x: Message[]) => {
			// console.log(x);
			if (x) {
				this.unreadMessages = x.some(
					(x) =>
						x.dateRead == null &&
						x.senderUsername != this.user.username
				);
			}
		});
		// this.presence.latestMessage$.subscribe((x:Message[]) => {
		// 	this.unreadMessages = x

		// });
	}
	logout() {
		this.accountService.logout();
	}
}
