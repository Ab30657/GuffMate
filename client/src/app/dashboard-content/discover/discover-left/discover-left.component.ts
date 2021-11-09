import { Component, OnInit } from '@angular/core';
import { MembersService } from 'src/app/_services/members.service';
import { FriendRequestComponent } from './friend-request/friend-request.component';
import { UserParams } from '../../../_models/userParams';
import { Friend } from 'src/app/_models/Friend';
import { FriendsParams } from '../../../_models/friendsParams';
import { Member } from 'src/app/_models/member';
@Component({
	selector: 'app-discover-left',
	templateUrl: './discover-left.component.html',
	styleUrls: ['./discover-left.component.css'],
})
export class DiscoverLeftComponent implements OnInit {
	Friends: Friend[] = [];
	userParams: FriendsParams;
	constructor(private memberService: MembersService) {
		this.userParams = this.memberService.GetFriendsParams();
	}
	ngOnInit(): void {
		this.ReloadList();
	}
	ReloadList() {
		this.memberService.GetUserRequests(this.userParams).subscribe((x) => {
			this.Friends = x;
			this.Friends = this.Friends.filter((x) => x.status == 1);
		});
	}
}
