import { Component, OnDestroy, OnInit } from '@angular/core';
import { MembersService } from '../../../_services/members.service';
import { Friend } from '../../../_models/Friend';
import { Router, ActivatedRoute } from '@angular/router';
import { ThisReceiver } from '@angular/compiler';
import { PresenceService } from '../../../_services/presence.service';
import { MessageService } from '../../../_services/message.service';
import { take } from 'rxjs/operators';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { Message } from 'src/app/_models/message';
import { FriendsService } from '../../../_services/friends.service';

@Component({
	selector: 'app-messages-left',
	templateUrl: './messages-left.component.html',
	styleUrls: ['./messages-left.component.css'],
})
export class MessagesLeftComponent implements OnInit, OnDestroy {
	friends: Friend[];
	user: User;
	chatMember: string;
	constructor(
		private membersService: MembersService,
		private messageService: MessageService,
		private route: ActivatedRoute,
		private router: Router,
		public presence: PresenceService,
		private accountService: AccountService,
		private friendsService: FriendsService
	) {
		this.accountService.currentUser$
			.pipe(take(1))
			.subscribe((x) => (this.user = x));
	}
	ngOnDestroy(): void {
		this.messageService.stopHubConnection();
	}

	ngOnInit(): void {
		this.friendsService.getFriends().subscribe((t) => {
			this.friends = t;
			this.chatMember = this.route.snapshot.paramMap.get('username');
			// console.log(this.chatMember);
			if (this.chatMember == '') {
				this.chatMember = this.friends[0].username;
				this.router.navigateByUrl(
					'/messages/' + this.friends[0].username
				);
			}
			if (this.friends) {
				this.messageService.latestMessages$.subscribe((a) => {
					a.forEach((x) => {
						this.friends.find(
							(chatUser) =>
								(x.senderUsername == chatUser.username &&
									x.recipientUsername ==
										this.user.username) ||
								(x.senderUsername == this.user.username &&
									x.recipientUsername == chatUser.username)
						).latestMessage = { ...x };
						// console.log(this.friends);
					});
					this.friends = [...this.friends];
				});
			}
		});
	}

	changeRoute(username: string) {
		this.messageService.stopHubConnection();
		this.router.navigate(['messages', username]);
		this.chatMember = username;
	}
}
