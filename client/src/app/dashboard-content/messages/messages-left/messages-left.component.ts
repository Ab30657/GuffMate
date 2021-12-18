import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../../_services/members.service';
import { Friend } from '../../../_models/Friend';
import { Router, ActivatedRoute } from '@angular/router';
import { ThisReceiver } from '@angular/compiler';

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
		private route: ActivatedRoute,
		private router: Router
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
		this.router.navigate(['messages', username]);
		this.chatMember = username;
	}
}
