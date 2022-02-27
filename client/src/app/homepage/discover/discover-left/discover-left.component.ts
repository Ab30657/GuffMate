import { Component, OnInit } from '@angular/core';
import { FriendsService } from 'src/app/_services/friends.service';
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
import { MembersService } from '../../../_services/members.service';
@Component({
	selector: 'app-discover-left',
	templateUrl: './discover-left.component.html',
	styleUrls: ['./discover-left.component.css'],
})
export class DiscoverLeftComponent implements OnInit {
	friendsParams: FriendsParams;
	user: User;
	constructor(
		public friendsService: FriendsService,
		public accountService: AccountService,
		public memberService: MembersService
	) {
		this.accountService.currentUser$
			.pipe(take(1))
			.subscribe((x) => (this.user = x));
	}
	ngOnInit(): void {
<<<<<<< HEAD
		this.friendsService.friends$.subscribe();
=======
		this.friendsService.friends$.subscribe((x) => console.log(x));
>>>>>>> 9c818f6a21613c6282439c76ffe1947d4241ddc9
	}
	UpdateRequest(username) {
		this.friendsService.AcceptUserRequest(username).subscribe((x) => {
			let params = this.memberService.GetUserParams();
			params.uptodate = false;
			this.memberService.SetUserParams(params);
		});
	}
}
