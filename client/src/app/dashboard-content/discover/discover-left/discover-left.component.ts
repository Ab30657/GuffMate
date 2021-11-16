import { Component, OnInit } from '@angular/core';
import { MembersService } from 'src/app/_services/members.service';
import { FriendRequestComponent } from './friend-request/friend-request.component';
import { UserParams } from '../../../_models/userParams';
import { Friend } from 'src/app/_models/Friend';
import { FriendsParams } from '../../../_models/friendsParams';
import { Member } from 'src/app/_models/member';
import { Observable } from 'rxjs';
@Component({
	selector: 'app-discover-left',
	templateUrl: './discover-left.component.html',
	styleUrls: ['./discover-left.component.css'],
})
export class DiscoverLeftComponent implements OnInit {
	Friends$: Observable<Friend[]>;
	friendsParams: FriendsParams;
	userParams: UserParams;
	constructor(private memberService: MembersService) {
		this.friendsParams = this.memberService.GetFriendsParams();
	}
	ngOnInit(): void {
		this.ReloadList();
	}
	ReloadList() {
		this.Friends$ = this.memberService.friends$;
		this.memberService
			.GetUserRequests(this.friendsParams)
			.subscribe(() => {});
	}
	UpdateRequest(username) {
		this.memberService.AcceptUserRequest(username).subscribe((x) => {
			this.ReloadList();
		});
	}
}
