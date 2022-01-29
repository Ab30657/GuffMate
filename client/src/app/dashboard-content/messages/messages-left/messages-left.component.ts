import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../../_services/members.service';
import { Friend } from '../../../_models/Friend';
import { Router, ActivatedRoute } from '@angular/router';
import { ThisReceiver } from '@angular/compiler';
import { PresenceService } from '../../../_services/presence.service';
import { MessageService } from '../../../_services/message.service';

@Component({
	selector: 'app-messages-left',
	templateUrl: './messages-left.component.html',
	styleUrls: ['./messages-left.component.css'],
})
export class MessagesLeftComponent implements OnInit {
	friends: Friend[];
	chatMember: string;
	constructor(
		private membersService: MembersService,
		private messageService: MessageService,
		private route: ActivatedRoute,
		private router: Router,
		public presence: PresenceService
	) {
		router.routeReuseStrategy.shouldReuseRoute = () => false;
	}

	ngOnInit(): void {
		this.membersService.getFriends().subscribe((x) => {
			this.friends = x;
			console.log(this.friends);
			this.chatMember = this.route.snapshot.paramMap.get('username');
			this.presence.latestMessage$.subscribe((msg) => {
				console.log(msg);
				if (msg != null) {
					console.log('reached');
					this.friends.find(
						(a) =>
							msg.senderUsername == a.username ||
							msg.recipientUsername == a.username
					).latestMessage = msg.content;
					this.friends = [...this.friends];
				}
			});
			if (this.friends.length !== 0) {
				if (this.chatMember == '') {
					this.router.navigateByUrl(
						'/messages/' + this.friends[0].username
					);
				}
			}
		});
	}

	changeRoute(username: string) {
		this.router.navigate(['messages', username]);
		this.chatMember = username;
	}
}
