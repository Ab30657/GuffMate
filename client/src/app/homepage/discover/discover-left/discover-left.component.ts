import { Component, OnInit } from '@angular/core';
import { MembersService } from 'src/app/_services/members.service';
import { FriendRequestComponent } from './friend-request/friend-request.component';
import { UserParams } from '../../../_models/userParams';
import { Friend } from 'src/app/_models/Friend';
import { FriendsParams } from '../../../_models/friendsParams';
import { Member } from 'src/app/_models/member';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { PresenceService } from '../../../_services/presence.service';
import { AccountService } from '../../../_services/account.service';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs/operators';
@Component({
	selector: 'app-discover-left',
	templateUrl: './discover-left.component.html',
	styleUrls: ['./discover-left.component.css'],
})
export class DiscoverLeftComponent implements OnInit {
	Friends$: Observable<Friend[]>;
	friendsParams: FriendsParams;
	userParams: UserParams;
	user: User;
	constructor(
		public memberService: MembersService,
		public accountService: AccountService
	) {
		this.accountService.currentUser$
			.pipe(take(1))
			.subscribe((x) => (this.user = x));
		this.friendsParams = this.memberService.GetFriendsParams();
	}
	ngOnInit(): void {
		this.ReloadList();
	}
	ReloadList() {
		// this.Friends$ = this.memberService.friends$;
		// this.memberService
		// 	.GetUserRequests(this.friendsParams)
		// 	.subscribe(() => {});
		this.memberService
			.GetUserRequests(this.friendsParams)
			.subscribe((a) =>
				this.memberService.friends$.subscribe((x) => console.log(x))
			);
	}
	UpdateRequest(username) {
		this.memberService.AcceptUserRequest(username).subscribe((x) => {
			// this.ReloadList();
		});
	}
}
