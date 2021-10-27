import { Component, Input, OnInit } from '@angular/core';
import { Friend } from 'src/app/_models/Friend';
import { Member } from 'src/app/_models/member';
import { MembersService } from '../../../../_services/members.service';

@Component({
	selector: 'app-friend-request',
	templateUrl: './friend-request.component.html',
	styleUrls: ['./friend-request.component.css'],
})
export class FriendRequestComponent implements OnInit {
	@Input() request: Friend;
	member: Member;
	isActive: boolean = false;
	Friends;
	Requests = [];
	constructor(private memberService: MembersService) {}

	ngOnInit(): void {}
	requestClick() {
		this.isActive = !this.isActive;
	}
}
