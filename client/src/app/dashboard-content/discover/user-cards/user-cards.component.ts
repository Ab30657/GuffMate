import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { Member } from '../../../_models/member';
import { MembersService } from '../../../_services/members.service';

@Component({
	selector: 'app-user-cards',
	templateUrl: './user-cards.component.html',
	styleUrls: ['./user-cards.component.css'],
})
export class UserCardsComponent implements OnInit {
	@Input() member: Member;
	sent: boolean = false;
	constructor(private memberService: MembersService) {}

	ngOnInit(): void {}

	ToggleRequest() {
		// this.memberService.SendRequest(this.member.username).subscribe((x) => {
		// 	this.sent = true;
		// });

		if (!this.sent) {
			this.memberService
				.SendRequest(this.member.username)
				.subscribe((x) => {
					this.sent = true;
				});
		} else {
			this.memberService
				.CancelRequest(this.member.username)
				.subscribe((x) => {
					this.sent = false;
				});
		}
	}
}
