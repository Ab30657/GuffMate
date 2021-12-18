import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/_models/member';

@Component({
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
	chatMember: Member;
	constructor(
		private memberService: MembersService,
		private route: ActivatedRoute
	) {
		route.params.subscribe((x) => {
			let username = this.route.snapshot.paramMap.get('username');
			this.memberService.GetUser(username).subscribe((x) => {
				this.chatMember = x;
			});
		});
	}

	ngOnInit(): void {}
}
