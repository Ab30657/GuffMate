import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { IPagination } from '../../_models/pagination';
import { UserParams } from '../../_models/userParams';
import { AccountService } from '../../_services/account.service';
import { take } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { Friend } from 'src/app/_models/Friend';
import { FriendsService } from 'src/app/_services/friends.service';

@Component({
	selector: 'app-discover',
	templateUrl: './discover.component.html',
	styleUrls: ['./discover.component.css'],
})
export class DiscoverComponent implements OnInit {
	user: User;
	users: Member[];
	ReceivedRequests: Friend[];
	pagination: IPagination;
	userParams: UserParams;
	genderList = [
		{ display: 'Male', value: 'Male' },
		{ display: 'Female', value: 'Female' },
		{ display: 'All', value: '' },
	];

	constructor(
		private friendsService: FriendsService,
		private memberService: MembersService,
		private accountService: AccountService
	) {
		this.userParams = this.memberService.GetUserParams();
		this.accountService.currentUser$
			.pipe(take(1))
			.subscribe((x) => (this.user = x));
	}
	ngOnInit(): void {
		this.friendsService.friends$.subscribe((x) => {
			this.loadMembers();
		});
	}

	loadMembers() {
		this.memberService.SetUserParams(this.userParams);
		this.memberService.GetUsers(this.userParams).subscribe((response) => {
			this.users = response.result;
			this.pagination = response.pagination;
		});
	}

	pageChanged(event: any) {
		this.userParams.pageNumber = event.page;
		this.memberService.SetUserParams(this.userParams);
		this.loadMembers();
	}

	resetFilters() {
		this.userParams = this.memberService.ResetUserParams();
		this.loadMembers();
	}

	updateRequest(username) {
		this.friendsService.AcceptUserRequest(username).subscribe((x) => {
			let params = this.memberService.GetUserParams();
			params.uptodate = false;
			this.memberService.SetUserParams(params);
		});
		this.loadMembers();
	}
}
