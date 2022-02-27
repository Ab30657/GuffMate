import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { FriendsService } from '../../_services/friends.service';
import { MembersService } from '../../_services/members.service';
import { MessageService } from '../../_services/message.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
	loading: boolean;
	messages: Message[];
	friends: number;
	constructor(
		public friendsService: FriendsService,
		public messageService: MessageService
	) {}

	ngOnInit(): void {
		this.messageService.getFriends().subscribe((x) => {
			this.friends = x.length;
		});
		this.messageService.getMessages(1, 5, 'Inbox').subscribe((response) => {
			this.messages = response.result;
			this.loading = false;
		});
	}
}
