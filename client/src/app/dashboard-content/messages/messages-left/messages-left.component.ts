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
	) {}

	ngOnInit(): void {
		this.membersService.getFriends().subscribe((x) => {
			this.friends = x;
			this.chatMember = this.route.snapshot.paramMap.get('username');
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
		this.messageService.stopHubConnection();
		this.router.navigate(['messages', username]);
		this.chatMember = username;
	}
}
