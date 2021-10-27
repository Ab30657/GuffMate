import { Component, OnInit } from '@angular/core';
import { MembersService } from 'src/app/_services/members.service';
import { FriendRequestComponent } from './friend-request/friend-request.component';
@Component({
	selector: 'app-discover-left',
	templateUrl: './discover-left.component.html',
	styleUrls: ['./discover-left.component.css'],
})
export class DiscoverLeftComponent implements OnInit {
	Friends;
	constructor(private memberService: MembersService) {}
	ngOnInit(): void {
		this.memberService.GetUserRequests().subscribe((x) => {
			this.Friends = x;
			console.log(this.Friends);
		});
	}
}
