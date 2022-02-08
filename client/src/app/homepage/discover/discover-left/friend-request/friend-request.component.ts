import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Friend } from 'src/app/_models/Friend';
import { Member } from 'src/app/_models/member';
import { MembersService } from '../../../../_services/members.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-friend-request',
	templateUrl: './friend-request.component.html',
	styleUrls: ['./friend-request.component.css'],
})
export class FriendRequestComponent implements OnInit {
	@Input() request: Friend;
	@Output() RequestStatusChanged = new EventEmitter();
	isActive: boolean = false;
	constructor(private memberService: MembersService, private router: Router) {
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;
	}

	ngOnInit(): void {}
	requestClick() {
		this.isActive = !this.isActive;
	}
	AcceptFriend() {
		this.RequestStatusChanged.emit(this.request.username);
	}
	RejectFriend() {
		// this.memberService
		// 	.RejectUserRequest(this.request.username)
		// 	.subscribe((x) => {
		// 		this.RequestStatusChanged.emit();
		// 	});
	}
}
