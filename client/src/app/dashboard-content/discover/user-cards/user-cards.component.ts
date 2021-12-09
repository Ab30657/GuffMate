import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { User } from 'src/app/_models/user';
import { Member } from '../../../_models/member';
import { MembersService } from '../../../_services/members.service';
import { RequestStatus } from '../../../_models/Friend';

@Component({
	selector: 'app-user-cards',
	templateUrl: './user-cards.component.html',
	styleUrls: ['./user-cards.component.css'],
})
export class UserCardsComponent implements OnInit {
	@Input() member: Member;
	@Output() RequestStatusChanged = new EventEmitter(); // ------------If request updates dont emit anything, later add real time functionality for updates
	constructor(private memberService: MembersService) {}

	ngOnInit(): void {}

	ToggleRequest() {
		// this.memberService.SendRequest(this.member.username).subscribe((x) => {
		// 	this.sent = true;
		// });
		if (!(this.member.friendStatus == 0)) {
			this.memberService
				.SendRequest(this.member.username)
				.subscribe((x) => (this.member.friendStatus = 0));
		} else {
			this.memberService
				.CancelRequest(this.member.username)
				.subscribe((x) => {
					this.member.friendStatus = 4;
				});
		}
	}
	AcceptRequest() {
		this.RequestStatusChanged.emit(this.member.username);
	}
	RejectRequest() {}

	getFriendStatus() {
		if (this.member.friendStatus == 0) {
			return 'sent';
		}
		if (this.member.friendStatus == 1) {
			return 'received';
		}
		if (this.member.friendStatus == 2) {
			return 'friend';
		}
		return '';
	}
}
