import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../_models/member';
import { MembersService } from '../_services/members.service';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
	member: Member;
	constructor(
		private memberService: MembersService,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.loadMember();
	}

	loadMember() {
		this.memberService
			.GetUser(this.route.snapshot.paramMap.get('username'))
			.subscribe((x) => {
				this.member = x;
			});
	}
}
